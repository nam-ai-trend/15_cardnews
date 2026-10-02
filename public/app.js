// State Management
let selectedTopicData = null;
let selectedFormula = 'warning';
let topicPosts = [];
let best5Posts = [];
let accountPosts = [];
let estateNewsList = [];

// DOM Elements
const topicContainer = document.getElementById('topic-cards-container');
const best5Container = document.getElementById('best5-cards-container');
const best5Section = document.getElementById('best-5-section');
const accountsContainer = document.getElementById('accounts-cards-container');
const estateContainer = document.getElementById('estate-cards-container');
const selectedTopicBox = document.getElementById('selected-topic-box');
const startRenderBtn = document.getElementById('start-render-btn');
const resultZone = document.getElementById('result-zone');
const galleryGrid = document.getElementById('gallery-grid');

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    
    btn.classList.add('active');
    const targetTab = btn.getAttribute('data-tab');
    document.getElementById(targetTab).style.display = 'block';
  });
});

// Formula Selection
document.querySelectorAll('.formula-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.formula-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selectedFormula = opt.getAttribute('data-formula');
  });
});

// Global Lock State
let isGlobalBusy = false;

/**
 * 3초 쿨다운 타이머 유틸리티
 */
function startCooldown(btn, originalHtml, cooldownSec = 3) {
  let remaining = cooldownSec;
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  btn.style.opacity = '0.6';
  btn.innerHTML = `<span>⏳</span> 쿨다운 중 (${remaining}초)`;

  const interval = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      btn.innerHTML = `<span>⏳</span> 쿨다운 중 (${remaining}초)`;
    } else {
      clearInterval(interval);
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.style.opacity = '1';
      btn.innerHTML = originalHtml;
      isGlobalBusy = false;
    }
  }, 1000);
}

/**
 * 피드 카드 제목 정제 (첫 2~3문장 추출, 잡다한 해시태그 정리하여 깔끔하게 표시)
 */
function cleanDisplayTitle(caption = '') {
  if (!caption) return '최신 부동산/재테크 트렌드';
  // 해시태그 제거 및 줄바꿈 정리
  const cleaned = caption
    .replace(/#[^\s#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length === 0) {
    return caption.slice(0, 50);
  }
  // 최대 65자로 제한하여 2~3줄에 딱 맞게 자름
  return cleaned.length > 65 ? cleaned.slice(0, 65) + '...' : cleaned;
}

// 1. [탭 1] 주제별 20개 수집 및 베스트 5 선별
async function collectTopicTrends() {
  if (isGlobalBusy) return;
  
  const keyword = document.getElementById('topic-keyword-input').value.trim();
  if (!keyword) {
    return alert('수집하고 싶은 관심 주제(키워드)를 입력해주세요!\n예: 부동산, 청약, 대출, AI 등');
  }

  isGlobalBusy = true;
  const btn = document.getElementById('btn-collect-topic');
  const originalHtml = '<span>🔥</span> 20개 수집 및 베스트 5 선별';

  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> 20개 수집 & 베스트 5 분석 중...';
  topicContainer.innerHTML = `<div style="padding: 30px; color: var(--text-muted); text-align: center;">'${keyword}' 관련 어제 0시 이후 20개 수집 및 랭킹 분석 중...</div>`;
  best5Section.style.display = 'none';

  try {
    const res = await fetch('/api/collect/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: keyword })
    });
    const data = await res.json();
    const result = data.data || {};
    best5Posts = result.best5 || [];
    topicPosts = result.all20 || [];

    // Render Best 5
    if (best5Posts.length > 0) {
      best5Section.style.display = 'block';
      best5Container.innerHTML = best5Posts.map(p => {
        const titleText = cleanDisplayTitle(p.caption);
        const isReel = p.isVideo || !!p.videoUrl;
        const mediaBadge = isReel 
          ? '<span class="media-badge reel">🎬 릴스</span>' 
          : '<span class="media-badge cardnews">📑 카드뉴스</span>';

        return `
          <div class="feed-card" style="border-color: var(--accent-orange); background: linear-gradient(180deg, #221815 0%, var(--bg-surface) 100%);" onclick="selectPost('${p.id}', 'topic')">
            <div>
              <div class="card-top-meta">
                <div class="card-top-left">
                  <span class="card-tag" style="background: var(--accent-orange); color: #fff;">${p.topBadge}</span>
                  ${mediaBadge}
                </div>
                <a href="${p.url}" target="_blank" class="origin-link" onclick="event.stopPropagation();" title="인스타그램에서 원본 게시물 보기">🔗 원본 보기 ↗</a>
              </div>
              <div class="card-title" title="${p.caption.replace(/"/g, '&quot;')}">${titleText}</div>
              <div class="card-snippet">🔥 ${p.whyHot}</div>
            </div>
            <div class="card-footer-meta">
              <span style="color: var(--accent-orange); font-weight: 800; font-size: 13px;">❤️ ${p.likesCount.toLocaleString()}</span>
              <span style="font-size: 11px; color: var(--text-muted);">${p.author}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render All 20
    if (topicPosts.length === 0) {
      topicContainer.innerHTML = '<div style="padding: 30px; color: var(--text-muted); text-align: center;">어제 0시 이후 올라온 게시물이 없습니다.</div>';
    } else {
      topicContainer.innerHTML = topicPosts.map(p => {
        const titleText = cleanDisplayTitle(p.caption);
        const isReel = p.isVideo || !!p.videoUrl;
        const mediaBadge = isReel 
          ? '<span class="media-badge reel">🎬 릴스</span>' 
          : '<span class="media-badge cardnews">📑 카드뉴스</span>';

        return `
          <div class="feed-card" onclick="selectPost('${p.id}', 'topic')">
            <div>
              <div class="card-top-meta">
                <div class="card-top-left">
                  <span class="card-tag">${p.topBadge}</span>
                  ${mediaBadge}
                </div>
                <a href="${p.url}" target="_blank" class="origin-link" onclick="event.stopPropagation();" title="인스타그램에서 원본 게시물 보기">🔗 원본 보기 ↗</a>
              </div>
              <div class="card-title" title="${p.caption.replace(/"/g, '&quot;')}">${titleText}</div>
              <div class="card-snippet">🔥 ${p.whyHot}</div>
            </div>
            <div class="card-footer-meta">
              <span style="color: var(--accent-orange); font-weight: 700; font-size: 13px;">❤️ ${p.likesCount.toLocaleString()}</span>
              <span style="font-size: 11px; color: var(--text-muted);">${p.author}</span>
            </div>
          </div>
        `;
      }).join('');
    }

  } catch (err) {
    topicContainer.innerHTML = '<div style="padding: 30px; color: #EF4444; text-align: center;">수집 실패: 다시 시도해 주세요.</div>';
  } finally {
    startCooldown(btn, originalHtml, 3);
  }
}

// 2. [탭 2] 특정 계정 릴스 전수 수집
async function collectAccountReels() {
  if (isGlobalBusy) return;
  isGlobalBusy = true;

  const accountsInput = document.getElementById('accounts-input').value.trim();
  const btn = document.getElementById('btn-collect-accounts');
  const originalHtml = '<span>👥</span> 계정 릴스 전수 수집';

  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> 릴스 전수 수집 중...';
  accountsContainer.innerHTML = '<div style="padding: 30px; color: var(--text-muted); text-align: center;">지정된 계정의 전날 00시 이후 최신 릴스 전수 수집 중...</div>';

  try {
    const res = await fetch('/api/collect/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accounts: accountsInput })
    });
    const data = await res.json();
    accountPosts = [];
    (data.data || []).forEach(acc => {
      (acc.posts || []).forEach(p => {
        accountPosts.push({ ...p, accountName: acc.account });
      });
    });
    renderAccountCards(accountPosts);
  } catch (err) {
    accountsContainer.innerHTML = '<div style="padding: 30px; color: #EF4444; text-align: center;">계정 수집 실패</div>';
  } finally {
    startCooldown(btn, originalHtml, 3);
  }
}

function renderAccountCards(posts) {
  if (posts.length === 0) {
    accountsContainer.innerHTML = '<div style="padding: 30px; color: var(--text-muted); text-align: center;">전날 00시 이후 올라온 릴스가 없습니다.</div>';
    return;
  }
  accountsContainer.innerHTML = posts.map(p => {
    const titleText = cleanDisplayTitle(p.caption);
    return `
      <div class="feed-card" onclick="selectPost('${p.id}', 'account')">
        <div>
          <div class="card-top-meta">
            <div class="card-top-left">
              <span class="card-tag" style="background: var(--accent-blue-soft); color: var(--accent-blue);">${p.hookType || '최신릴스'}</span>
              <span class="media-badge reel">🎬 릴스</span>
            </div>
            <a href="${p.url}" target="_blank" class="origin-link" onclick="event.stopPropagation();">🔗 원본 릴스 ↗</a>
          </div>
          <div class="card-title" title="${p.caption.replace(/"/g, '&quot;')}">${titleText}</div>
          <div class="card-snippet">👁️ 조회수 ${p.viewsCount.toLocaleString()}회 · 좋아요 ${p.likesCount.toLocaleString()}개</div>
        </div>
        <div class="card-footer-meta">
          <span style="color: var(--accent-orange); font-weight: 700;">❤️ ${p.likesCount.toLocaleString()}</span>
          <span style="font-size: 11px; color: var(--text-muted);">${p.accountName}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 3. [탭 3] 네이버 실시간 핫이슈 뉴스 (부동산·정책·정치) 자동 수집
async function collectEstateData() {
  if (isGlobalBusy) return;
  isGlobalBusy = true;

  const btn = document.getElementById('btn-collect-estate');
  const originalHtml = '<span>⚡</span> 최신 핫이슈 자동 수집';

  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> 실시간 핫이슈 뉴스 수집 중...';
  estateContainer.innerHTML = '<div style="padding: 30px; color: var(--text-muted); text-align: center;">네이버 실시간 부동산·정책·정치 핫이슈 속보 수집 중...</div>';

  try {
    const res = await fetch('/api/collect/estate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    estateNewsList = data.data || [];
    renderEstateCards(estateNewsList);
  } catch (err) {
    estateContainer.innerHTML = '<div style="padding: 30px; color: #EF4444; text-align: center;">핫이슈 뉴스 수집 실패</div>';
  } finally {
    startCooldown(btn, originalHtml, 3);
  }
}

function renderEstateCards(list) {
  if (list.length === 0) {
    estateContainer.innerHTML = '<div style="padding: 30px; color: var(--text-muted); text-align: center;">수집된 데이터가 없습니다.</div>';
    return;
  }
  estateContainer.innerHTML = list.map(item => `
    <div class="feed-card" onclick="selectPost('${item.id}', 'estate')">
      <div>
        <div class="card-top-meta">
          <div class="card-top-left">
            <span class="card-tag" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-green);">${item.tag || item.source}</span>
            <span class="media-badge" style="background: rgba(16, 185, 129, 0.2); color: #6EE7B7; border: 1px solid rgba(16, 185, 129, 0.3);">⚡ 팩트이슈</span>
          </div>
          <a href="${item.url}" target="_blank" class="origin-link" onclick="event.stopPropagation();">🔗 원문 기사 ↗</a>
        </div>
        <div class="card-title">${item.title}</div>
        <div class="card-snippet">${item.summary || ''}</div>
      </div>
      <div class="card-footer-meta">
        <span style="color: var(--accent-orange); font-weight: 700;">${item.importance || '최신 브리핑'}</span>
        <span style="font-size: 11px; color: var(--text-muted);">${item.source}</span>
      </div>
    </div>
  `).join('');
}

// 4. [탭 4] 릴스 URL 역분석
async function analyzeReelsUrl() {
  if (isGlobalBusy) return;
  isGlobalBusy = true;

  const url = document.getElementById('reels-url-input').value.trim();
  if (!url) {
    isGlobalBusy = false;
    return alert('릴스 URL을 입력해주세요.');
  }

  const btn = document.getElementById('btn-analyze-reels');
  const originalHtml = '<span>🔍</span> 구조 역분석';

  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> 역분석 중...';

  try {
    const res = await fetch('/api/analyze-reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (data.success) {
      const resBox = document.getElementById('reels-analysis-result');
      const content = document.getElementById('reels-analysis-content');
      const post = data.postData || {};
      const actualCaption = post.caption || data.analysis.caption || data.analysis.advice;
      const authorText = post.author || '@instagram_creator';
      const statsText = post.viewsCount ? `👁️ 조회수 ${post.viewsCount.toLocaleString()}회 · ❤️ 좋아요 ${post.likesCount.toLocaleString()}개` : '실시간 릴스 분석 완료';

      resBox.style.display = 'flex';
      content.innerHTML = `
        <div style="background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;">
          <div style="font-size: 12px; color: var(--accent-orange); font-weight: 800;">${authorText} · ${statsText}</div>
          <div style="font-size: 13px; color: var(--text-main); margin-top: 4px; line-height: 1.4;">${actualCaption.slice(0, 150)}${actualCaption.length > 150 ? '...' : ''}</div>
        </div>
        <div><strong>🎯 추출된 1장 후킹 공식:</strong> ${data.analysis.extractedHook}</div>
        <div><strong>⏱️ 정보 전개 호흡 (Pacing):</strong> ${data.analysis.pacing}</div>
        <div><strong>💡 재해석 가이드:</strong> ${data.analysis.advice}</div>
        <div><strong>🔗 원본 릴스:</strong> <a href="${url}" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">${url}</a></div>
      `;

      document.getElementById('apply-reels-btn').onclick = () => {
        const hasImages = post.imageUrls && post.imageUrls.length > 0;
        const isReelVideo = post.isVideo || (post.videoUrl && !hasImages);

        selectedTopicData = {
          topic: `[인스타 분석] ${actualCaption.slice(0, 30).replace(/\n/g, ' ')}...`,
          caption: actualCaption,
          summary: actualCaption.slice(0, 200).replace(/\n/g, ' '),
          source: `${authorText} (인스타그램)`,
          url: url,
          videoUrl: post.videoUrl || (isReelVideo ? url : null),
          imageUrls: post.imageUrls || [],
          likesCount: post.likesCount || 0,
          viewsCount: post.viewsCount || 0,
          mediaType: isReelVideo ? 'reel' : (hasImages ? 'cardnews' : 'reel')
        };
        updateStudioStep1();
      };
    }
  } catch (e) {
    alert('릴스 역분석 실패');
  } finally {
    startCooldown(btn, originalHtml, 3);
  }
}

// State Management for 4-Step Interactive Studio
let multimodalAnalysisData = null;
let selectedAngleId = 'angle_warning';
let generatedCardScript = null;

// DOM Elements for 4-Step Studio
const sttStatusBadge = document.getElementById('stt-status-badge');
const btnDeepAnalyze = document.getElementById('btn-deep-analyze');
const deepAnalysisBox = document.getElementById('deep-analysis-box');
const deepAnalysisSummary = document.getElementById('deep-analysis-summary');
const sttTextPreview = document.getElementById('stt-text-preview');
const sectionAngles = document.getElementById('section-angles');
const anglesGrid = document.getElementById('angles-grid');
const sectionFeedback = document.getElementById('section-feedback');
const slideCountSelect = document.getElementById('slide-count-select');
const userFeedbackInput = document.getElementById('user-feedback-input');
const btnGenerateScript = document.getElementById('btn-generate-script');
const scriptPreviewBox = document.getElementById('script-preview-box');
const scriptPreviewContent = document.getElementById('script-preview-content');
const scriptSlidesBadge = document.getElementById('script-slides-badge');
const sectionRender = document.getElementById('section-render');
const btnSaveReport = document.getElementById('btn-save-report');
const savedFolderBadge = document.getElementById('saved-folder-badge');
const savedFilePath = document.getElementById('saved-file-path');
const reportMarkdownPreview = document.getElementById('report-markdown-preview');

// 1. 피드 아이템 선택 (Step 1 활성화 및 미디어 유형 정밀 매핑)
window.selectPost = function(id, type) {
  let target = null;
  if (type === 'topic') {
    target = topicPosts.find(p => p.id === id) || best5Posts.find(p => p.id === id);
    if (target) {
      const isReel = target.isVideo || !!target.videoUrl;
      selectedTopicData = {
        topic: cleanDisplayTitle(target.caption),
        caption: target.caption,
        summary: target.whyHot,
        source: target.author,
        url: target.url,
        videoUrl: target.videoUrl || null,
        imageUrls: target.imageUrls || [],
        likesCount: target.likesCount || 0,
        viewsCount: target.viewsCount || 0,
        mediaType: isReel ? 'reel' : 'cardnews'
      };
    }
  } else if (type === 'account') {
    target = accountPosts.find(p => p.id === id);
    if (target) {
      const isReel = target.isVideo || !!target.videoUrl;
      selectedTopicData = {
        topic: cleanDisplayTitle(target.caption),
        caption: target.caption,
        summary: `조회수 ${target.viewsCount?.toLocaleString() || 0}회 · 좋아요 ${target.likesCount?.toLocaleString() || 0}개`,
        source: target.accountName,
        url: target.url,
        videoUrl: target.videoUrl || null,
        imageUrls: target.imageUrls || [],
        likesCount: target.likesCount || 0,
        viewsCount: target.viewsCount || 0,
        mediaType: isReel ? 'reel' : 'cardnews'
      };
    }
  } else if (type === 'estate') {
    target = estateNewsList.find(n => n.id === id);
    if (target) {
      selectedTopicData = {
        topic: target.title,
        caption: target.summary || target.title,
        summary: target.summary,
        source: target.source,
        url: target.url,
        likesCount: 500,
        viewsCount: 15000,
        mediaType: 'estate'
      };
    }
  }

  updateStudioStep1();
};

function updateStudioStep1() {
  if (!selectedTopicData) return;

  const isReel = selectedTopicData.mediaType === 'reel' || !!selectedTopicData.videoUrl;
  const isCardNews = selectedTopicData.mediaType === 'cardnews';

  let mediaBadgeHtml = '';
  let btnAnalyzeText = '';
  let badgeStatusText = '';

  if (isReel) {
    mediaBadgeHtml = '<span class="media-badge reel" style="margin-left: 6px;">🎬 인스타 릴스 영상</span>';
    btnAnalyzeText = '<span>🎙️</span> 릴스 음성 STT & 4대 심층 분석 시작';
    badgeStatusText = '릴스 음성 STT 분석 대기';
  } else if (isCardNews) {
    mediaBadgeHtml = '<span class="media-badge cardnews" style="margin-left: 6px;">📑 카드뉴스 이미지</span>';
    btnAnalyzeText = '<span>👁️</span> 카드 슬라이드 Vision & 4대 심층 분석 시작';
    badgeStatusText = '카드 이미지 Vision 분석 대기';
  } else {
    mediaBadgeHtml = '<span class="media-badge" style="background: rgba(16, 185, 129, 0.2); color: #6EE7B7; border: 1px solid rgba(16, 185, 129, 0.3); margin-left: 6px;">⚡ 부동산 팩트 브리핑</span>';
    btnAnalyzeText = '<span>⚡</span> 팩트 데이터 & 4대 심층 분석 시작';
    badgeStatusText = '팩트 데이터 분석 대기';
  }

  selectedTopicBox.classList.add('has-content');
  selectedTopicBox.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
      <div style="font-weight: 800; font-size: 14px; color: var(--text-main); line-height: 1.3;">
        ${selectedTopicData.topic}
      </div>
      ${mediaBadgeHtml}
    </div>
    <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4; margin-bottom: 6px;">
      ${selectedTopicData.summary}
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding-top: 6px; border-top: 1px dashed var(--border-subtle);">
      <span style="color: var(--accent-orange); font-weight: 700;">출처: ${selectedTopicData.source}</span>
      ${selectedTopicData.url ? `<a href="${selectedTopicData.url}" target="_blank" class="origin-link">🔗 원본 보기 ↗</a>` : ''}
    </div>
  `;

  btnDeepAnalyze.style.display = 'block';
  btnDeepAnalyze.innerHTML = btnAnalyzeText;
  sttStatusBadge.innerText = badgeStatusText;
  sttStatusBadge.style.color = 'var(--accent-blue)';

  // Reset Sub-steps
  deepAnalysisBox.style.display = 'none';
  sectionAngles.style.display = 'none';
  sectionFeedback.style.display = 'none';
  sectionRender.style.display = 'none';
  resultZone.style.display = 'none';
}

// 2. Step 1: 멀티모달 딥분석 & 4대 심층 리포트 (원문/떡상요인/업그레이드/TOP3선발)
btnDeepAnalyze.addEventListener('click', async () => {
  if (!selectedTopicData || isGlobalBusy) return;
  isGlobalBusy = true;

  const isReel = selectedTopicData.mediaType === 'reel' || !!selectedTopicData.videoUrl;
  const isCardNews = selectedTopicData.mediaType === 'cardnews';

  btnDeepAnalyze.disabled = true;
  btnDeepAnalyze.innerHTML = isReel 
    ? '<span>⏳</span> Whisper STT 음성 전사 & 4대 심층 분석 중...'
    : isCardNews 
      ? '<span>⏳</span> Vision AI 슬라이드 해체 & 4대 심층 분석 중...'
      : '<span>⏳</span> 부동산 팩트 데이터 4대 심층 분석 중...';
      
  sttStatusBadge.innerText = '심층 딥분석 진행 중...';

  try {
    const res = await fetch('/api/analyze-multimodal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: selectedTopicData.topic,
        caption: selectedTopicData.caption,
        videoUrl: selectedTopicData.videoUrl,
        imageUrls: selectedTopicData.imageUrls,
        likesCount: selectedTopicData.likesCount,
        viewsCount: selectedTopicData.viewsCount
      })
    });
    const data = await res.json();
    multimodalAnalysisData = data;

    // Show Deep Analysis Result (4대 핵심 분석)
    deepAnalysisBox.style.display = 'block';
    
    const orig = data.originalContent || {};
    const viral = data.viralReason || {};
    const upg = data.upgradeStrategy || {};
    
    deepAnalysisSummary.innerHTML = `
      <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
        <div style="color: #60A5FA; font-weight: 800; margin-bottom: 2px;">1️⃣ 원문 상세 내용 분석:</div>
        <div style="color: var(--text-main); font-size: 12px; margin-bottom: 4px; line-height: 1.4;">${orig.summary || selectedTopicData.caption}</div>
        ${orig.keyFacts ? `<div style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">${orig.keyFacts.map(f => `• ${f}`).join('<br>')}</div>` : ''}
      </div>

      <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
        <div style="color: #F87171; font-weight: 800; margin-bottom: 2px;">2️⃣ 원문 떡상 요인 심층 해체:</div>
        <div style="color: #FCA5A5; font-size: 11px; font-weight: 700;">🎯 핵심 심리 트리거: ${viral.trigger || '손실 회피 & 정보 비대칭'}</div>
        <div style="color: var(--text-muted); font-size: 11px; margin-top: 2px; line-height: 1.4;">${viral.analysis || ''}</div>
      </div>

      <div>
        <div style="color: #34D399; font-weight: 800; margin-bottom: 2px;">3️⃣ 차별화 업그레이드 접근법:</div>
        <div style="color: var(--text-muted); font-size: 11px; line-height: 1.4;"><span style="color: #FBBF24; font-weight: 700;">[원본 한계]</span> ${upg.weakness || '단순 텍스트 나열로 가독성 및 소장 가치 부족'}</div>
        <div style="color: var(--text-main); font-size: 11px; margin-top: 2px; line-height: 1.4;"><span style="color: #34D399; font-weight: 700;">[차별화 전략]</span> ${upg.approach || '정밀 인포그래픽과 3단계 실천 가이드로 저장률 극대화'}</div>
      </div>
    `;

    if (data.audioText) {
      sttTextPreview.style.display = 'block';
      sttTextPreview.innerHTML = `<strong>🎙️ 릴스 음성 전사 (Whisper STT):</strong><br>${data.audioText}`;
    } else if (data.imageText) {
      sttTextPreview.style.display = 'block';
      sttTextPreview.innerHTML = `<strong>👁️ 카드 슬라이드 추출 텍스트 (Vision AI):</strong><br><div style="white-space: pre-wrap; font-size: 11px; margin-top: 4px;">${data.imageText}</div>`;
    } else {
      sttTextPreview.style.display = 'none';
    }

    sttStatusBadge.innerText = '4대 심층 분석 완료';
    sttStatusBadge.style.color = 'var(--accent-green)';

    // Step 2: Render TOP 3 Selection with Detailed Storyline
    renderTop3Angles(data.top3Angles || [], data.selectionCriteria, data.remainingAngles || []);

    // Step 3 & 4 Visible
    sectionAngles.style.display = 'block';
    sectionFeedback.style.display = 'block';

  } catch (err) {
    console.error('딥분석 오류:', err);
    alert('딥분석 중 오류가 발생했습니다.');
  } finally {
    startCooldown(btnDeepAnalyze, isReel ? '<span>🎙️</span> 다시 딥분석하기' : '<span>⚡</span> 다시 딥분석하기', 3);
  }
});

// Render TOP 3 Angles Cards with Explicit Selection Reason, 1st Hook & Detailed Storyline
function renderTop3Angles(top3, criteria, remaining) {
  if (top3.length > 0) {
    selectedAngleId = top3[0].id;
  }

  const top3Html = top3.map((a, idx) => {
    // 스토리라인 단계별 HTML 포맷팅
    const storylineSteps = (a.storyline || []).map(s => `
      <div class="storyline-step-item">
        <span class="storyline-step-badge">Slide ${s.slide} (${s.role})</span>
        <span class="storyline-step-detail">${s.detail}</span>
      </div>
    `).join('');

    return `
      <div class="angle-card ${a.id === selectedAngleId ? 'active' : ''}" data-angle="${a.id}" onclick="selectAngle('${a.id}')" style="border-left: 4px solid var(--accent-orange);">
        <div class="angle-card-top">
          <span class="angle-card-title">${a.title}</span>
          <span class="angle-card-tag" style="${idx === 0 ? 'background: #EF4444;' : 'background: var(--accent-blue);'}">${a.tag}</span>
        </div>
        
        <div style="font-size: 11px; color: #FBBF24; line-height: 1.4;">
          💡 <strong>선발 근거:</strong> ${a.selectionReason}
        </div>

        <div class="angle-card-hook">
          🎯 <strong>1장 킬러 카피:</strong> "${a.customHook}"
        </div>

        ${a.approach ? `<div style="font-size: 11px; color: #60A5FA; margin-top: 2px;">⚡ <strong>전개 전략:</strong> ${a.approach}</div>` : ''}

        <div style="font-size: 11px; font-weight: 700; color: var(--text-main); margin-top: 4px;">📋 카드별 상세 전개 시나리오:</div>
        <div class="angle-storyline-container">
          ${storylineSteps || `<div style="color: var(--text-muted); font-size: 11px;">${a.plot || '단계별 전개 시나리오 준비 완료'}</div>`}
        </div>
      </div>
    `;
  }).join('');

  anglesGrid.innerHTML = `
    <div style="font-size: 12px; color: var(--text-main); margin-bottom: 10px; padding: 8px 12px; background: rgba(217, 83, 47, 0.1); border: 1px solid var(--border-subtle); border-radius: 6px;">
      🎯 <strong>7대 관점 중 엄선 기준:</strong> ${criteria || '투자자의 손실 불안 해소 및 인스타그램 실전 저장/공유 잠재력 극대화'}
    </div>
    ${top3Html}
  `;
}

window.selectAngle = function(angleId) {
  selectedAngleId = angleId;
  document.querySelectorAll('.angle-card').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-angle') === angleId);
  });
};

// 3. Step 3: 사용자 피드백 & AI 슬라이드별 대본 생성
btnGenerateScript.addEventListener('click', async () => {
  if (!selectedTopicData || isGlobalBusy) return;
  isGlobalBusy = true;

  const originalHtml = '<span>✨</span> AI 슬라이드별 대본 생성 & 확정';
  btnGenerateScript.disabled = true;
  btnGenerateScript.innerHTML = '<span>⏳</span> AI 슬라이드별 대본 기획 중...';

  const slideCount = slideCountSelect.value;
  const userFeedback = userFeedbackInput.value.trim();
  const selectedAngleObj = (multimodalAnalysisData?.angles || []).find(a => a.id === selectedAngleId);

  try {
    const res = await fetch('/api/generate-advanced-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: selectedTopicData.topic,
        angleId: selectedAngleId,
        slideCount: slideCount,
        userFeedback: userFeedback,
        customHook: selectedAngleObj?.customHook || '',
        coreContext: {
          caption: selectedTopicData.caption,
          audioText: multimodalAnalysisData?.audioText,
          imageText: multimodalAnalysisData?.imageText
        }
      })
    });
    const data = await res.json();
    generatedCardScript = data.script;

    // Show Script Preview
    scriptPreviewBox.style.display = 'block';
    scriptSlidesBadge.innerText = `총 ${generatedCardScript.slides.length}장 구성`;
    
    scriptPreviewContent.innerHTML = generatedCardScript.slides.map(s => `
      <div class="script-slide-item">
        <strong>[${s.slide_number}/${s.total_slides}장 ${s.type.toUpperCase()}]</strong>
        ${s.type === 'cover' ? ` ${s.headline_prefix} <span style="color: var(--accent-orange); font-weight: 800;">${s.headline_highlight}</span> ${s.headline_suffix}` : ''}
        ${s.type === 'body_list' || s.type === 'body_visual' ? ` <strong>${s.title}</strong><br><small style="color: var(--text-muted);">${(s.points || []).map(p => `• ${p.heading}: ${p.desc}`).join('<br>')}</small>` : ''}
        ${s.type === 'cta' ? ` <strong>${s.summary_title}</strong>: ${(s.summary_items || []).join(' / ')}` : ''}
      </div>
    `).join('');

    // Step 4 Render Section Enable
    sectionRender.style.display = 'block';

  } catch (err) {
    console.error('대본 생성 오류:', err);
    alert('대본 생성 중 오류가 발생했습니다.');
  } finally {
    startCooldown(btnGenerateScript, originalHtml, 3);
  }
});

// 4. Step 4: 자료수집 완료 및 종합 Markdown 리포트 파일 저장
btnSaveReport.addEventListener('click', async () => {
  if (!generatedCardScript || !selectedTopicData || isGlobalBusy) return;
  isGlobalBusy = true;

  const originalHtml = '<span>📁</span> 자료수집 완료 및 종합 리포트 저장';
  btnSaveReport.disabled = true;
  btnSaveReport.innerHTML = '<span>⏳</span> 리포트 및 대본 파일 생성 중...';

  const selectedAngleObj = (multimodalAnalysisData?.allAngles || multimodalAnalysisData?.top3Angles || []).find(a => a.id === selectedAngleId);

  try {
    const saveRes = await fetch('/api/save-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicData: selectedTopicData,
        multimodalData: multimodalAnalysisData,
        selectedAngle: selectedAngleObj,
        script: generatedCardScript
      })
    });
    const saveData = await saveRes.json();

    if (saveData.success) {
      resultZone.style.display = 'flex';
      savedFolderBadge.innerText = saveData.folderName;
      savedFilePath.innerHTML = `
        <div><strong>📄 생성된 리포트:</strong> <code style="background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 4px; color: #6EE7B7; font-weight: 700;">${saveData.reportPath}</code></div>
      `;
      reportMarkdownPreview.innerText = saveData.markdownSummary;

      alert(`🎉 [${saveData.folderName}] 자료수집 완료!\n'${saveData.reportPath}' 파일에 원본 정보, 음성 STT, 4대 심층 분석 및 대본이 완벽하게 저장되었습니다.`);
    } else {
      alert(`저장 실패: ${saveData.error}`);
    }
  } catch (err) {
    console.error('리포트 저장 오류:', err);
    alert('리포트 저장 중 오류가 발생했습니다.');
  } finally {
    startCooldown(btnSaveReport, originalHtml, 3);
  }
});

// Event Listeners for Left Tabs
document.getElementById('btn-collect-topic').addEventListener('click', collectTopicTrends);
document.getElementById('btn-collect-accounts').addEventListener('click', collectAccountReels);
document.getElementById('btn-collect-estate').addEventListener('click', collectEstateData);
document.getElementById('btn-analyze-reels').addEventListener('click', analyzeReelsUrl);


