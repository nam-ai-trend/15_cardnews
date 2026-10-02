const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderCardNews() {
  const reportDir = path.join(__dirname, '../outputs/260922_2232');
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
      category: "🚨 긴급 점검 · 손실 방지",
      html: `
        <div class="slide-container cover-slide">
          <div class="top-meta">
            <span class="category-badge">🚨 긴급 점검 · 손실 방지</span>
            <span class="page-indicator">01 / 04</span>
          </div>

          <div class="hero-title-area">
            <div class="hero-sub">부동산 시장 침체 & 경매 쇼크 비상!</div>
            <h1 class="hero-main">
              경매 넘어가도 <br>
              <span class="text-highlight">빚 안 갚아진다?</span>
            </h1>
          </div>

          <div class="visual-card">
            <img src="${coverImg}" alt="Cover Image" />
            <div class="visual-overlay">
              <span class="overlay-badge">⚠️ 영끌족 연체율 급증 · 잔여 채무 비상 경고</span>
            </div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🚨</div>
              <span class="handle">@estate_risk_alert</span>
            </div>
            <div class="swipe-hint">
              <span>밀어서 긴급 체크 ➔</span>
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
      category: "CHECK 01 · 연체율 급증 원인",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(239, 68, 68, 0.18); color: #F87171; border-color: rgba(239, 68, 68, 0.35);">CHECK 01</span>
            <span class="page-indicator">02 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">도대체 왜 이런 일이 벌어지고 있을까?</div>
            <h2 class="section-title">영끌족을 덮친 <span class="text-highlight">3대 위기 요인</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card highlight-border">
              <div class="point-badge orange">01</div>
              <div class="point-content">
                <div class="point-title">부동산 시장의 지속적 침체</div>
                <div class="point-desc">집값 하락세로 담보 가치가 급감하여 매매로 빚을 털 수 없는 깡통 상황 발생</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">02</div>
              <div class="point-content">
                <div class="point-title">고금리 누적 원리금 상환 부담</div>
                <div class="point-desc">높은 대출 금리로 매달 나가는 이자가 2배 이상 폭증해 가계 한계선 돌파</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">03</div>
              <div class="point-content">
                <div class="point-title">청년층 영끌족 연체율 폭증</div>
                <div class="point-desc">소득 대비 무리하게 대출받은 2030 차주들의 연체율이 가파르게 치솟는 중</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide2Img}" alt="Loan Stress" />
            <div class="mini-visual-caption">📊 누적된 대출 이자 부담과 자금 압박</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🚨</div>
              <span class="handle">@estate_risk_alert</span>
            </div>
            <div class="swipe-hint">
              <span>경매 후 잔여 빚 팩트 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 3장: 본문 2 (Layout 2 + Fact Focus)
    {
      page: 3,
      total: 4,
      category: "FACT 02 · 실제 사례 & 파장",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(56, 189, 248, 0.18); color: #38BDF8; border-color: rgba(56, 189, 248, 0.35);">FACT 02</span>
            <span class="page-indicator">03 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">집 뺏기고도 빚이 남는 충격적 진실</div>
            <h2 class="section-title">경매 후에도 남는 <span class="text-highlight">잔여 빚의 덫</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card highlight-border">
              <div class="point-badge orange">⚖️</div>
              <div class="point-content">
                <div class="point-title">낙찰가 폭락 ➔ 잔여 채무 존속</div>
                <div class="point-desc">유찰이 거듭되어 감정가보다 턱없이 낮게 낙찰되면 남은 빚은 고스란히 본인 몫</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">📉</div>
              <div class="point-content">
                <div class="point-title">신용등급 강등 및 금융거래 마비</div>
                <div class="point-desc">경매 후에도 잔여금을 갚지 못하면 채무불이행자로 등재되어 통장 압류 위험</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">🛡️</div>
              <div class="point-content">
                <div class="point-title">선제적 채무 조정 상담 필수</div>
                <div class="point-desc">경매가 개시되기 전 신속채무조정이나 개인회생 등 사전 구제 절차 확인 필요</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide3Img}" alt="Auction Documents" />
            <div class="mini-visual-caption">⚖️ 법원 경매 공고 및 권리 분석 서류</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🚨</div>
              <span class="handle">@estate_risk_alert</span>
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
      html: `
        <div class="slide-container cta-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(239, 68, 68, 0.2); color: #F87171; border-color: rgba(239, 68, 68, 0.4);">SUMMARY</span>
            <span class="page-indicator">04 / 04</span>
          </div>

          <div class="section-title-area" style="text-align: center; margin-top: 14px; margin-bottom: 20px;">
            <div class="section-sub" style="font-size: 26px;">절대 방심하면 안 되는 부동산 리스크</div>
            <h2 class="section-title" style="font-size: 76px; line-height: 1.2;">오늘의 <span class="text-highlight">3줄 핵심 총정리</span></h2>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>집값 하락 + 고금리</strong>로 영끌족 연체율이 역대급 폭증 중</span>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>경매로 집이 넘어가도</strong> 낙찰가 미달 시 잔여 빚은 남는다</span>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <span><strong>경매 전 사전 채무조정</strong> 및 프리워크아웃 제도 확인 필수!</span>
            </div>
          </div>

          <div class="cta-action-card">
            <div class="cta-icon-wrap">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="#FF5A36"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="cta-title">위기 상황 대비법 까먹지 않으려면?</div>
            <div class="cta-desc">오른쪽 아래 <strong>[저장(북마크)]</strong> 눌러두고 주변에도 꼭 공유하세요!</div>
          </div>

          <div class="bottom-bar" style="margin-top: 16px;">
            <div class="author-info">
              <div class="avatar" style="width: 52px; height: 52px; font-size: 24px;">🚨</div>
              <div>
                <div style="font-weight: 800; font-size: 22px; color: #fff;">@estate_risk_alert</div>
                <div style="font-size: 16px; color: #9CA3AF;">손실을 막아주는 실전 부동산 리스크 브리핑</div>
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
            background: rgba(0,0,0,0.65);
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

renderCardNews()
  .then(files => {
    console.log('RESULT:', JSON.stringify(files));
    process.exit(0);
  })
  .catch(err => {
    console.error('렌더링 에러:', err);
    process.exit(1);
  });
