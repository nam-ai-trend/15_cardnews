const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 키워드 및 출처 기반 스마트 태그 분류기
 */
function classifyNews(title, summary, press, category) {
  const text = `${title} ${summary}`.toLowerCase();

  if (category === 'politics' || text.includes('대통령') || text.includes('국회') || text.includes('의원') || text.includes('당대표') || text.includes('여당') || text.includes('야당') || text.includes('정당') || text.includes('법안')) {
    return {
      tag: '🗳️ 정치/국회',
      importance: '⚡ 실시간 정치',
      sourceType: '정치 이슈'
    };
  } else if (text.includes('국토') || text.includes('정부') || text.includes('장관') || text.includes('신도시') || text.includes('대책') || text.includes('공공')) {
    return {
      tag: '🏛️ 정책/공공',
      importance: '⭐ 정책 발표',
      sourceType: '공공/정책'
    };
  } else if (text.includes('청약') || text.includes('분양') || text.includes('줍줍') || text.includes('당첨') || text.includes('특공') || text.includes('경쟁률')) {
    return {
      tag: '📋 청약/분양',
      importance: '🔥 관심 폭발',
      sourceType: '청약 정보'
    };
  } else if (text.includes('대출') || text.includes('금리') || text.includes('dsr') || text.includes('한도') || text.includes('주담대') || text.includes('영끌')) {
    return {
      tag: '💰 대출/금리',
      importance: '🚨 손실/주의',
      sourceType: '금융/규제'
    };
  } else if (text.includes('신고가') || text.includes('상승') || text.includes('하락') || text.includes('전세') || text.includes('월세') || text.includes('집값') || text.includes('시세')) {
    return {
      tag: '📊 시세/동향',
      importance: '📈 시장 트렌드',
      sourceType: '시장 통계'
    };
  } else {
    return {
      tag: '🏢 핫이슈 일반',
      importance: '⚡ 실시간 속보',
      sourceType: '실시간 뉴스'
    };
  }
}

/**
 * 네이버 특정 섹션 크롤러 헬퍼 함수
 */
async function scrapeNaverSection(url, category, limit = 8) {
  const items = [];
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 5000
    });

    const $ = cheerio.load(res.data);

    $('.sa_item').each((i, el) => {
      if (items.length >= limit) return false;

      const titleEl = $(el).find('.sa_text_title');
      const title = titleEl.text().trim();
      const link = titleEl.attr('href');
      const press = $(el).find('.sa_text_press').text().trim() || '언론사';
      const summary = $(el).find('.sa_text_lede').text().trim();
      const timeStr = $(el).find('.sa_text_datetime').text().trim() || '방금 전';

      if (title && link) {
        const { tag, importance, sourceType } = classifyNews(title, summary, press, category);
        items.push({
          title,
          press,
          url: link,
          timeStr,
          summary: summary || title,
          tag,
          importance,
          sourceType
        });
      }
    });
  } catch (err) {
    console.warn(`[크롤러] ${category} 섹션 수집 실패:`, err.message);
  }
  return items;
}

/**
 * 실시간 네이버 핫이슈 (부동산·정책 + 정치) 통합 수집기
 */
async function fetchAutoRealEstateNews() {
  console.log('[크롤러] 실시간 네이버 핫이슈 뉴스(부동산 + 정치) 라이브 수집 가동...');

  const todayStr = new Date().toLocaleDateString('ko-KR');

  // 부동산 속보 & 정치 속보 병렬 수집
  const [estateNews, politicsNews] = await Promise.all([
    scrapeNaverSection('https://news.naver.com/breakingnews/section/101/260', 'estate', 8),
    scrapeNaverSection('https://news.naver.com/breakingnews/section/100/269', 'politics', 6)
  ]);

  const combined = [];
  let idCounter = 1;

  // 부동산과 정치 뉴스를 적절히 믹스하여 배치
  const maxLength = Math.max(estateNews.length, politicsNews.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < estateNews.length) {
      const item = estateNews[i];
      combined.push({
        id: `hotissue_${idCounter++}`,
        source: `${item.press} (실시간 ${item.timeStr})`,
        sourceType: item.sourceType,
        title: item.title,
        press: item.press,
        url: item.url,
        date: `${todayStr} (${item.timeStr})`,
        tag: item.tag,
        importance: item.importance,
        summary: item.summary
      });
    }
    if (i < politicsNews.length) {
      const item = politicsNews[i];
      combined.push({
        id: `hotissue_${idCounter++}`,
        source: `${item.press} (실시간 ${item.timeStr})`,
        sourceType: item.sourceType,
        title: item.title,
        press: item.press,
        url: item.url,
        date: `${todayStr} (${item.timeStr})`,
        tag: item.tag,
        importance: item.importance,
        summary: item.summary
      });
    }
  }

  console.log(`[크롤러] 실시간 핫이슈 뉴스 총 ${combined.length}건 (부동산 ${estateNews.length}건 + 정치 ${politicsNews.length}건) 수집 완료!`);

  // Fallback 처리
  if (combined.length === 0) {
    combined.push({
      id: "fallback_hotissue_1",
      source: "네이버 뉴스",
      sourceType: "공공/정책",
      title: "2026 부동산 및 주요 정책 실시간 핫이슈",
      url: "https://news.naver.com",
      date: todayStr,
      tag: "🏛️ 정책/공공",
      importance: "⭐ 정책 발표",
      summary: "실시간 주요 정책 및 시장 이슈 브리핑"
    });
  }

  return combined;
}

module.exports = {
  fetchAutoRealEstateNews
};

