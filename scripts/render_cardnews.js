const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderCardNews(reportDir) {
  console.log(`[Renderer] 카드뉴스 무손실 렌더링 시작: ${reportDir}`);
  const cardsDir = path.join(reportDir, 'cards');
  const assetsDir = path.join(reportDir, 'assets');
  fs.mkdirSync(cardsDir, { recursive: true });

  const coverImg = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'cover.jpg')).toString('base64')}`;
  const slide2Img = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'slide2.jpg')).toString('base64')}`;
  const slide3Img = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'slide3.jpg')).toString('base64')}`;

  const slides = [
    // 1장: 표지 (Layout 1 - Pinterest Magazine Cover)
    {
      page: 1,
      total: 4,
      category: "🚨 긴급 점검 · 청년 주거 복지",
      date: "2026.09.22",
      html: `
        <div class="slide-container cover-slide">
          <div class="top-meta">
            <span class="category-badge">🚨 긴급 점검 · 청년 주거</span>
            <span class="page-indicator">01 / 04</span>
          </div>

          <div class="hero-title-area">
            <div class="hero-sub">자취방 & 내 집 마련 고민 끝!</div>
            <h1 class="hero-main">
              서울 2룸 보증금이 <br>
              <span class="text-highlight">단돈 200만원?</span>
            </h1>
          </div>

          <div class="visual-card">
            <img src="${coverImg}" alt="Cover Image" />
            <div class="visual-overlay">
              <span class="overlay-badge">총 420호 청년 매입임대주택 오픈</span>
            </div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">Z</div>
              <span class="handle">@zip__kok</span>
            </div>
            <div class="swipe-hint">
              <span>밀어서 3대 혜택 확인</span>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `
    },
    // 2장: 본문 1 (Layout 2 - 3단 넘버링 카드형)
    {
      page: 2,
      total: 4,
      category: "CHECK 01 · 3대 핵심 혜택",
      date: "2026.09.22",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(59, 130, 246, 0.2); color: #60A5FA;">CHECK 01</span>
            <span class="page-indicator">02 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">청년 매입임대주택을 주목해야 하는 이유</div>
            <h2 class="section-title">놓치면 후회하는 <span class="text-highlight">3대 핵심 혜택</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card">
              <div class="point-badge orange">01</div>
              <div class="point-content">
                <div class="point-title">파격적인 보증금 지원</div>
                <div class="point-desc">1순위 100만원, 2·3순위 200만원부터 입주 가능! 목돈 부담을 완벽하게 덜어줍니다.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">02</div>
              <div class="point-content">
                <div class="point-title">주변 시세 40~50% 반값 월세</div>
                <div class="point-desc">LH가 직접 매입하여 시세의 반값 이하로 공급해 매달 나가는 주거비를 절약할 수 있습니다.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">03</div>
              <div class="point-content">
                <div class="point-title">신축 오피스텔부터 2룸까지</div>
                <div class="point-desc">원룸뿐만 아니라 쾌적한 신축 2룸 구조까지 취향과 조건에 맞게 선택할 수 있습니다.</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide2Img}" alt="Interior Preview" />
            <div class="mini-visual-caption">✨ 실제 공급 예정 신축 인테리어 예시</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">Z</div>
              <span class="handle">@zip__kok</span>
            </div>
            <div class="swipe-hint">
              <span>일정 & 지역 확인 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 3장: 본문 2 (Layout 2 + Fact Focus)
    {
      page: 3,
      total: 4,
      category: "FACT 02 · 공급 지역 & 일정",
      date: "2026.09.22",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">FACT 02</span>
            <span class="page-indicator">03 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">서울 24개 자치구 총 420호 공급</div>
            <h2 class="section-title">청약 접수 일정 & <span class="text-highlight">필수 체크</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card highlight-border">
              <div class="point-badge orange">📅</div>
              <div class="point-content">
                <div class="point-title">청약 신청 기간 (단 3일간!)</div>
                <div class="point-desc" style="color: #FCA5A5; font-weight: 700; font-size: 24px;">9월 28일(월) ~ 9월 30일(수)</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">📍</div>
              <div class="point-content">
                <div class="point-title">서울 전역 24개 자치구 분산 공급</div>
                <div class="point-desc">직장·대학가 인근 역세권 중심 총 420호 대규모 공급 예정입니다.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">⚡</div>
              <div class="point-content">
                <div class="point-title">신청 전 사전 자격 검토 필수</div>
                <div class="point-desc">소득 및 자산 기준에 따라 순위가 갈리므로 사전 서류 준비가 당락을 결정합니다.</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide3Img}" alt="Schedule Preview" />
            <div class="mini-visual-caption">📍 서울 24개 자치구 청약 일정 체크</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">Z</div>
              <span class="handle">@zip__kok</span>
            </div>
            <div class="swipe-hint">
              <span>최종 요약 보기 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 4장: CTA (Layout 5 - Ending 1줄 요약 + 북마크)
    {
      page: 4,
      total: 4,
      category: "SUMMARY · 최종 요약",
      date: "2026.09.22",
      html: `
        <div class="slide-container cta-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(239, 68, 68, 0.2); color: #F87171;">SUMMARY</span>
            <span class="page-indicator">04 / 04</span>
          </div>

          <div class="section-title-area" style="text-align: center; margin-top: 20px; margin-bottom: 24px;">
            <div class="section-sub" style="font-size: 28px;">청약 놓치지 마세요!</div>
            <h2 class="section-title" style="font-size: 76px; line-height: 1.2;">오늘의 <span class="text-highlight">3줄 핵심 총정리</span></h2>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>보증금 100~200만원</strong>으로 서울 신축 2룸 입주 기회!</span>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>시세의 40~50%</strong> 반값 월세로 월 주거비 대폭 절감</span>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>9/28 ~ 9/30</strong> 딱 3일간 접수! 미리 서류 체크 필수</span>
            </div>
          </div>

          <div class="cta-action-card">
            <div class="cta-icon-wrap">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="#FF5A36"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="cta-title">청약 일정 까먹지 않으려면?</div>
            <div class="cta-desc">오른쪽 아래 <strong>[저장(북마크)]</strong> 눌러두고 접수 날 꼭 확인하세요!</div>
          </div>

          <div class="bottom-bar" style="margin-top: 20px;">
            <div class="author-info">
              <div class="avatar" style="width: 52px; height: 52px; font-size: 24px;">Z</div>
              <div>
                <div style="font-weight: 800; font-size: 22px; color: #fff;">@zip__kok</div>
                <div style="font-size: 16px; color: #9CA3AF;">매일 올라오는 내 집 마련 · 청약 정보</div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const generatedFiles = [];

  for (const slide of slides) {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1080px;
            height: 1350px;
            background-color: #0F1115;
            color: #FFFFFF;
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            letter-spacing: -0.03em;
            word-break: keep-all;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .slide-container {
            width: 1080px;
            height: 1350px;
            padding: 90px 80px 80px 80px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: radial-gradient(circle at 80% 20%, rgba(255, 90, 54, 0.08) 0%, transparent 60%),
                        radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 60%),
                        #0F1115;
          }
          .top-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .category-badge {
            font-size: 18px;
            font-weight: 800;
            padding: 8px 18px;
            border-radius: 30px;
            background: rgba(255, 90, 54, 0.15);
            color: #FF5A36;
            border: 1px solid rgba(255, 90, 54, 0.3);
          }
          .page-indicator {
            font-size: 20px;
            font-weight: 800;
            color: #6B7280;
            letter-spacing: 0.05em;
          }
          .text-highlight {
            color: #FF5A36;
            text-decoration: underline;
            text-underline-offset: 8px;
            text-decoration-thickness: 4px;
          }
          
          /* Hero Title */
          .hero-title-area {
            margin-top: 18px;
            margin-bottom: 18px;
          }
          .hero-sub {
            font-size: 28px;
            font-weight: 700;
            color: #9CA3AF;
            margin-bottom: 10px;
          }
          .hero-main {
            font-size: 86px;
            font-weight: 900;
            line-height: 1.18;
            color: #FFFFFF;
            letter-spacing: -0.04em;
          }

          /* Visual Card (Cover) */
          .visual-card {
            width: 100%;
            height: 570px;
            border-radius: 28px;
            overflow: hidden;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          }
          .visual-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .visual-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 26px;
            background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%);
          }
          .overlay-badge {
            font-size: 22px;
            font-weight: 800;
            color: #FFFFFF;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
            padding: 10px 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
          }

          /* Section Title */
          .section-title-area {
            margin-top: 6px;
            margin-bottom: 18px;
          }
          .section-sub {
            font-size: 26px;
            font-weight: 700;
            color: #9CA3AF;
            margin-bottom: 6px;
          }
          .section-title {
            font-size: 82px;
            font-weight: 900;
            line-height: 1.18;
            letter-spacing: -0.04em;
          }

          /* Points List */
          .points-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .point-card {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 18px 22px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }
          .point-card.highlight-border {
            border-color: rgba(255, 90, 54, 0.4);
            background: rgba(255, 90, 54, 0.06);
          }
          .point-badge {
            width: 46px;
            height: 46px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 900;
            flex-shrink: 0;
          }
          .point-badge.orange { background: rgba(255, 90, 54, 0.2); color: #FF5A36; }
          .point-badge.blue { background: rgba(56, 189, 248, 0.2); color: #38BDF8; }
          .point-badge.green { background: rgba(16, 185, 129, 0.2); color: #10B981; }
          
          .point-content { flex: 1; }
          .point-title { font-size: 28px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px; }
          .point-desc { font-size: 20px; font-weight: 500; color: #A1A7B5; line-height: 1.38; }

          /* Mini Visual Card */
          .mini-visual-card {
            width: 100%;
            height: 200px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 6px;
          }
          .mini-visual-card img { width: 100%; height: 100%; object-fit: cover; }
          .mini-visual-caption {
            position: absolute;
            bottom: 10px;
            left: 14px;
            font-size: 15px;
            font-weight: 700;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(6px);
            padding: 6px 14px;
            border-radius: 8px;
            color: #FFFFFF;
          }

          /* Summary Box (CTA) */
          .summary-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 32px 30px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 14px;
          }
          .summary-item {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 28px;
            font-weight: 600;
            color: #F3F4F6;
          }
          .check-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #FF5A36;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 900;
            flex-shrink: 0;
          }

          /* CTA Action Card */
          .cta-action-card {
            background: linear-gradient(135deg, rgba(255, 90, 54, 0.15) 0%, rgba(255, 90, 54, 0.05) 100%);
            border: 2px dashed #FF5A36;
            border-radius: 24px;
            padding: 36px 28px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-top: 18px;
          }
          .cta-title { font-size: 38px; font-weight: 900; color: #FFFFFF; }
          .cta-desc { font-size: 24px; color: #D1D5DB; }

          /* Bottom Bar */
          .bottom-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .author-info {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #FF5A36;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 20px;
          }
          .handle { font-size: 20px; font-weight: 800; color: #FFFFFF; }
          .swipe-hint {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 700;
            color: #FF5A36;
          }
        </style>
      </head>
      <body>
        ${slide.html}
      </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    // Font load wait
    await page.evaluate(() => document.fonts.ready);

    const outPath = path.join(cardsDir, `slide_0${slide.page}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`[Renderer] 슬라이드 0${slide.page} 렌더링 완료: ${outPath}`);
    generatedFiles.push(outPath);
  }

  await browser.close();
  console.log(`🎉 총 ${generatedFiles.length}장 카드뉴스 무손실 렌더링 완성!`);
  return generatedFiles;
}

const targetReportDir = process.argv[2] || path.join(__dirname, '../outputs/260922_2118');
renderCardNews(targetReportDir)
  .then(files => {
    console.log(JSON.stringify({ success: true, files }, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('렌더링 에러:', err);
    process.exit(1);
  });
