require('dotenv').config();
const { ApifyClient } = require('apify-client');

/**
 * 전날 00:00:00(KST) Date 객체 및 YYYY-MM-DD 문자열 계산
 */
function getYesterdayKSTInfo() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kstNow = new Date(utc + (9 * 3600000));
  
  const yesterday = new Date(kstNow);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return {
    dateObj: yesterday,
    timestampMs: yesterday.getTime(),
    timestampSec: Math.floor(yesterday.getTime() / 1000),
    dateStr: dateStr
  };
}

/**
 * 1. Apify - 주제별 실시간 릴스 20개 수집 (어제 0시 이후) ➔ 반응도 순 '베스트 TOP 5' 선별
 */
async function fetchInstagramTopicTrends(topic = '청약') {
  const token = process.env.APIFY_TOKEN;
  const { timestampSec, dateStr } = getYesterdayKSTInfo();
  
  // 키워드 앞의 '#' 기호 자동 제거 및 정제
  const cleanTopic = (topic || '청약').trim().replace(/^#/, '');
  
  console.log(`[Apify 핫트렌드 수집기] 검색 주제: '#${cleanTopic}' | 릴스(reels) 20개 수집 | 기준: ${dateStr} (KST 00:00) 이후`);

  let rawPosts = [];

  if (token && token.trim()) {
    try {
      const client = new ApifyClient({ token: token.trim() });
      const tagUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(cleanTopic)}/`;
      console.log(`[Apify] tagUrl 호출 시작: ${tagUrl} (resultsType: 'posts', resultsLimit: 20, onlyPostsNewerThan: ${dateStr})`);

      const run = await client.actor('apify/instagram-scraper').call({
        directUrls: [tagUrl],
        resultsType: 'posts',
        resultsLimit: 20,
        onlyPostsNewerThan: dateStr
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log(`[Apify] 인스타그램 피드 수집 성공! 원시 아이템 개수: ${items.length}개`);

      // 어제 0시 이후 게시물 필터링 및 데이터 정제
      rawPosts = items
        .filter(item => {
          if (!item.timestamp) return true; // 타임스탬프 없으면 포함
          const itemTimeSec = Math.floor(new Date(item.timestamp).getTime() / 1000);
          return itemTimeSec >= timestampSec;
        })
        .map((item, idx) => {
          const cleanCaption = (item.caption || '').trim();
          const likes = item.likesCount || 0;
          const views = item.videoViewCount || item.videoPlayCount || 0;
          
          let whyHotText = '';
          if (views > 0 && likes > 0) {
            whyHotText = `조회수 ${(views >= 10000 ? (views/10000).toFixed(1) + '만' : views.toLocaleString())}회 · 좋아요 ${likes.toLocaleString()}개`;
          } else if (likes > 0) {
            whyHotText = `실시간 좋아요 ${likes.toLocaleString()}개 돌파`;
          } else if (views > 0) {
            whyHotText = `실시간 조회수 ${views.toLocaleString()}회 기록`;
          } else {
            whyHotText = `최신 해시태그 #${cleanTopic} 릴스`;
          }

          const isVid = item.isVideo || !!item.videoUrl || item.type === 'Video';
          const vidUrl = item.videoUrl || item.video_url || null;
          const imgList = (item.images && item.images.length > 0) 
            ? item.images 
            : (item.childPosts ? item.childPosts.map(c => c.displayUrl).filter(Boolean) : [item.displayUrl].filter(Boolean));

          return {
            id: `apify_${item.id || idx}`,
            topic: cleanTopic,
            author: item.ownerUsername ? `@${item.ownerUsername}` : `@creator_${idx + 1}`,
            url: item.url || (item.shortCode ? `https://www.instagram.com/reel/${item.shortCode}` : `https://www.instagram.com`),
            caption: cleanCaption || `[#${cleanTopic}] 실시간 인기 릴스 (#${idx + 1})`,
            likesCount: likes,
            viewsCount: views,
            isVideo: isVid,
            videoUrl: vidUrl,
            imageUrls: imgList,
            commentsCount: item.commentsCount || (item.latestComments ? item.latestComments.length : 0),
            postedAt: item.timestamp || new Date().toISOString(),
            thumbnail: item.displayUrl || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
            whyHot: whyHotText
          };
        });

    } catch (err) {
      console.error(`[Apify API 호출 오류]`, err.message);
    }
  }

  // 1. 좋아요 및 조회수 종합 반응도 순으로 내림차순 정렬
  const sorted = rawPosts.sort((a, b) => {
    const scoreA = (a.likesCount * 5) + (a.viewsCount || 0);
    const scoreB = (b.likesCount * 5) + (b.viewsCount || 0);
    return scoreB - scoreA;
  }).slice(0, 20);

  // 2. 랭킹 부여 및 상위 베스트 5 선별
  const enriched = sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
    isTop5: index < 5,
    topBadge: index < 5 ? `👑 BEST 0${index + 1}` : `TOP ${index + 1}`
  }));

  const best5 = enriched.filter(item => item.isTop5);

  return {
    topic: cleanTopic,
    totalCollected: enriched.length,
    best5Count: best5.length,
    best5: best5,
    all20: enriched
  };
}

/**
 * 2. 특정 릴스 계정(들) 전날 00시부터 현재까지 최대 10개 수집
 */
async function fetchTargetAccountsReels(targetAccounts = ['@real_estate_king']) {
  const token = process.env.APIFY_TOKEN;
  const { timestampSec, dateStr } = getYesterdayKSTInfo();

  console.log(`[Apify 실시간 계정 수집] 대상: [${targetAccounts.join(', ')}] | 최대 10개 | 기준: ${dateStr} 이후`);

  const results = [];

  for (const acc of targetAccounts) {
    const cleanHandle = acc.trim().replace(/^@/, '');
    if (!cleanHandle) continue;

    let accountPosts = [];

    if (token && token.trim()) {
      try {
        const client = new ApifyClient({ token: token.trim() });
        const reelsUrl = `https://www.instagram.com/${cleanHandle}/reels/`;
        console.log(`[Apify] @${cleanHandle} 릴스 크롤링 시작: ${reelsUrl} (resultsType: 'reels', resultsLimit: 10, onlyPostsNewerThan: ${dateStr})`);

        const run = await client.actor('apify/instagram-scraper').call({
          directUrls: [reelsUrl],
          resultsType: 'reels',
          resultsLimit: 10,
          onlyPostsNewerThan: dateStr
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`[Apify] @${cleanHandle} 릴스 원시 수집 완료 (${items.length}개)`);

        accountPosts = items
          .filter(item => {
            if (!item.timestamp) return true;
            const itemTimeSec = Math.floor(new Date(item.timestamp).getTime() / 1000);
            return itemTimeSec >= timestampSec;
          })
          .map((item, idx) => {
            const views = item.videoViewCount || item.videoPlayCount || 0;
            const likes = item.likesCount || 0;
            let hookTag = '최신 릴스';
            if (views >= 50000 || likes >= 2000) hookTag = '🔥 초대박 떡상';
            else if (views >= 10000 || likes >= 500) hookTag = '⚡ 떡상 릴스';

            const isVid = item.isVideo || !!item.videoUrl || item.type === 'Video';
            const vidUrl = item.videoUrl || item.video_url || null;
            const imgList = (item.images && item.images.length > 0) 
              ? item.images 
              : (item.childPosts ? item.childPosts.map(c => c.displayUrl).filter(Boolean) : [item.displayUrl].filter(Boolean));

            return {
              id: `acc_${cleanHandle}_${item.id || idx}`,
              url: item.url || (item.shortCode ? `https://www.instagram.com/reel/${item.shortCode}` : `https://www.instagram.com`),
              caption: (item.caption || '').trim() || `[@${cleanHandle}] 발행 릴스 (#${idx + 1})`,
              likesCount: likes,
              viewsCount: views,
              hookType: hookTag,
              isVideo: isVid,
              videoUrl: vidUrl,
              imageUrls: imgList,
              postedAt: item.timestamp || new Date().toISOString(),
              thumbnail: item.displayUrl || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"
            };
          })
          .slice(0, 10);
      } catch (err) {
        console.error(`[Apify 계정 @${cleanHandle} 수집 오류]`, err.message);
      }
    }

    results.push({
      account: `@${cleanHandle}`,
      status: accountPosts.length > 0 ? `수집 완료 (${accountPosts.length}개)` : "해당 기간 내 등록된 릴스 없음",
      count: accountPosts.length,
      posts: accountPosts
    });
  }

  return results;
}

/**
 * 3. Apify - 단일 릴스 / 게시물 URL 실시간 정밀 스크래핑
 */
async function fetchSingleInstagramPost(postUrl) {
  const token = process.env.APIFY_TOKEN;
  console.log(`[Apify 단일 릴스 수집기] URL: ${postUrl}`);

  if (!token || !token.trim()) {
    console.warn('[Apify] API 토큰이 없습니다. 기본 분석 데이터로 반환합니다.');
    return {
      success: false,
      url: postUrl,
      caption: "인스타그램 릴스 레퍼런스",
      author: "@creator",
      likesCount: 1500,
      viewsCount: 30000,
      videoUrl: null
    };
  }

  try {
    const client = new ApifyClient({ token: token.trim() });
    console.log(`[Apify] 단일 릴스 Actor 호출 시작: ${postUrl}`);

    const run = await client.actor('apify/instagram-scraper').call({
      directUrls: [postUrl.trim()],
      resultsType: 'posts',
      resultsLimit: 1
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(`[Apify] 단일 릴스 수집 완료! 아이템 수: ${items.length}`);

    if (items.length > 0) {
      const item = items[0];
      const cleanCaption = (item.caption || '').trim();
      const likes = item.likesCount || 0;
      const views = item.videoViewCount || item.videoPlayCount || 0;
      const isVid = item.isVideo || !!item.videoUrl || item.type === 'Video';
      const vidUrl = item.videoUrl || item.video_url || null;
      const imgList = (item.images && item.images.length > 0) 
        ? item.images 
        : (item.childPosts ? item.childPosts.map(c => c.displayUrl).filter(Boolean) : [item.displayUrl].filter(Boolean));

      return {
        success: true,
        id: item.id || `reel_${Date.now()}`,
        url: item.url || postUrl,
        caption: cleanCaption || "인스타그램 릴스 원본 게시물",
        author: item.ownerUsername ? `@${item.ownerUsername}` : '@creator',
        likesCount: likes,
        viewsCount: views,
        isVideo: isVid,
        videoUrl: vidUrl,
        imageUrls: imgList,
        commentsCount: item.commentsCount || 0,
        postedAt: item.timestamp || new Date().toISOString()
      };
    }
  } catch (err) {
    console.error(`[Apify 단일 릴스 수집 오류]`, err.message);
  }

  return {
    success: false,
    url: postUrl,
    caption: "인스타그램 릴스 레퍼런스",
    author: "@creator",
    likesCount: 0,
    viewsCount: 0,
    videoUrl: null
  };
}

module.exports = {
  fetchInstagramTopicTrends,
  fetchTargetAccountsReels,
  fetchSingleInstagramPost
};
