const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderCardNews(reportDir) {
  console.log(`[Renderer] 카드뉴스 무손실 렌더링 시작: ${reportDir}`);
  const cardsDir = path.join(reportDir, 'cards');
  const assetsDir = path.join(reportDir, 'assets');
  fs.mkdirSync(cardsDir, { recursive: true });

  const coverImg = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'slide_01.jpg')).toString('base64')}`;
  const slide2Img = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'slide_02.jpg')).toString('base64')}`;
  const slide3Img = `data:image/jpeg;base64,${fs.readFileSync(path.join(assetsDir, 'slide_03.jpg')).toString('base64')}`;

  const slides = [
    // 1장: 표지 (Layout 1 - Pinterest Magazine Cover)
    {
      page: 1,
      total: 4,
      category: "📈 10월 2일 증시 예측",
      date: "2026.10.02",
      html: `
        <div class="slide-container cover-slide">
          <div class="top-meta">
            <span class="category-badge">📈 10월 2일 긴급 시황 · 코스피 전망</span>
            <span class="page-indicator">01 / 04</span>
          </div>

          <div class="hero-title-area">
            <div class="hero-sub">7천선까지 단 29pt! 저점 매수 기회일까?</div>
            <h1 class="hero-main">
              10월 2일 코스피 <br>
              <span class="text-highlight">오늘 어떻게 흘러갈까?</span>
            </h1>
          </div>

          <div class="visual-card">
            <img src="${coverImg}" alt="KOSPI Trading View" />
            <div class="visual-overlay">
              <span class="overlay-badge">🔥 7,050선 탈환 시도 & 외인 수급·환율 3대 체크포인트</span>
            </div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🎯</div>
              <span class="handle">@moneyhunter_kr</span>
            </div>
            <div class="swipe-hint">
              <span>밀어서 3대 상승 신호 확인</span>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `
    },
    // 2장: 본문 1 (Layout 2 - 코스피 상승 이끄는 3대 신호)
    {
      page: 2,
      total: 4,
      category: "PART 01 · 상승 견인 신호",
      date: "2026.10.02",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(59, 130, 246, 0.2); color: #60A5FA; border-color: rgba(59, 130, 246, 0.4);">PART 01</span>
            <span class="page-indicator">02 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">미국발 훈풍과 수급의 전환점</div>
            <h2 class="section-title">코스피 상승 이끄는 <span class="text-highlight">3대 핵심 신호</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card highlight-border">
              <div class="point-badge orange">01</div>
              <div class="point-content">
                <div class="point-title">미국 반도체 지수 +1.59% 급등</div>
                <div class="point-desc">마이크론 3%↑, SK하이닉스 ADR 5.08%↑ 상승으로 오늘 삼전·닉스 중심 반등 출발 유력!</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">02</div>
              <div class="point-content">
                <div class="point-title">외국인 6일 만의 순매수 전환 여부</div>
                <div class="point-desc">삼성전자 자사주 매입이 마무리되는 시점! 그 빈자리를 외국인이 채워주는지가 오늘 핵심 포인트.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">03</div>
              <div class="point-content">
                <div class="point-title">원·달러 환율 1,360원 돌파 영향</div>
                <div class="point-desc">환율 상승 시 환차손 우려로 외인 매수가 망설여질 수 있어 장중 환율 추이 체크 필수.</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide2Img}" alt="Forex & Semiconductor Analysis" />
            <div class="mini-visual-caption">💡 외국인 수급과 원달러 1,360선 방향이 오늘 장세 결정</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🎯</div>
              <span class="handle">@moneyhunter_kr</span>
            </div>
            <div class="swipe-hint">
              <span>시장을 흔들 3대 변수 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 3장: 본문 2 (Layout 2 - 시장을 흔드는 3대 변수)
    {
      page: 3,
      total: 4,
      category: "PART 02 · 주요 변수 분석",
      date: "2026.10.02",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(16, 185, 129, 0.2); color: #34D399; border-color: rgba(16, 185, 129, 0.4);">PART 02</span>
            <span class="page-indicator">03 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">금리 안정과 100달러 유가 리스크</div>
            <h2 class="section-title">장중 체크해야 할 <span class="text-highlight">3대 핵심 변수</span></h2>
          </div>

          <div class="points-list">
            <div class="point-card highlight-border">
              <div class="point-badge orange">📊</div>
              <div class="point-content">
                <div class="point-title">코스닥 900선 돌파 가능성</div>
                <div class="point-desc">중소형주 리포트 의무화(25%) 정책과 함께 돈이 반도체 밖 테마로 확산되는 신호 포착.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">🏦</div>
              <div class="point-content">
                <div class="point-title">미국 금리 5.34% 찍고 안정세</div>
                <div class="point-desc">연준 2인자의 신중 발언으로 금리 5.2%대로 진정, 추가 인상 우려가 크게 완화되었습니다.</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">🛢️</div>
              <div class="point-content">
                <div class="point-title">국제유가 100달러 돌파 (최대 복병)</div>
                <div class="point-desc">중국 석유 수출 중단으로 +4% 급등! 물가 자극 우려가 있어 오늘 장은 금리보다 유가 주시.</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card">
            <img src="${slide3Img}" alt="Crude Oil Price & Fed" />
            <div class="mini-visual-caption">📍 금리 안정 속 100달러 유가 급등과 3일 연휴 리스크 대비</div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">🎯</div>
              <span class="handle">@moneyhunter_kr</span>
            </div>
            <div class="swipe-hint">
              <span>최종 3줄 요약 보기 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 4장: CTA (Layout 5 - Ending 3줄 요약 + 북마크)
    {
      page: 4,
      total: 4,
      category: "SUMMARY · 실전 시나리오",
      date: "2026.10.02",
      html: `
        <div class="slide-container cta-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(239, 68, 68, 0.2); color: #F87171; border-color: rgba(239, 68, 68, 0.4);">SUMMARY</span>
            <span class="page-indicator">04 / 04</span>
          </div>

          <div class="section-title-area" style="text-align: center; margin-top: 15px; margin-bottom: 20px;">
            <div class="section-sub" style="font-size: 26px;">오늘 장 실전 대응 가이드</div>
            <h2 class="section-title" style="font-size: 78px; line-height: 1.2;">오늘의 코스피 <span class="text-highlight">3줄 핵심 총정리</span></h2>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>오전 7,050선 시도:</strong> 미국 반도체 훈풍으로 상승 출발, 7천선 안착 시도가 기본 시나리오</div>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>외국인 수급이 좌우:</strong> 외인 매수 시 7,100선 및 코스닥 900선, 매도 지속 시 6,950선 방어전</div>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>유가와 연휴 리스크:</strong> 100달러 유가 인플레 영향과 3일 연휴 앞둔 오후 차익 매물 주의</div>
            </div>
          </div>

          <div class="cta-action-card">
            <div class="cta-icon-wrap">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="#FF5A36"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="cta-title">오늘 장 마감 전 시나리오 확인하려면?</div>
            <div class="cta-desc">오른쪽 아래 <strong>[저장(북마크)]</strong> 눌러두고 오후 장 마감 때 꼭 맞춰보세요!</div>
          </div>

          <div class="disclaimer-text">
            ※ 본 자료는 주가 예측 및 시장 분석 참고용이며, 투자에 대한 책임은 본인에게 있습니다.
          </div>

          <div class="bottom-bar" style="margin-top: 15px; padding-top: 15px;">
            <div class="author-info">
              <div class="avatar" style="width: 50px; height: 50px; font-size: 24px;">🎯</div>
              <div>
                <div style="font-weight: 800; font-size: 22px; color: #fff;">@moneyhunter_kr</div>
                <div style="font-size: 15px; color: #9CA3AF;">매일 아침 7시 30분 무료 핵심 경제 시황</div>
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
            padding: 85px 75px 75px 75px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: radial-gradient(circle at 85% 15%, rgba(255, 90, 54, 0.08) 0%, transparent 60%),
                        radial-gradient(circle at 15% 85%, rgba(56, 189, 248, 0.06) 0%, transparent 60%),
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
            margin-top: 14px;
            margin-bottom: 14px;
          }
          .hero-sub {
            font-size: 28px;
            font-weight: 700;
            color: #9CA3AF;
            margin-bottom: 8px;
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
            height: 590px;
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
            padding: 24px;
            background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%);
          }
          .overlay-badge {
            font-size: 21px;
            font-weight: 800;
            color: #FFFFFF;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(8px);
            padding: 10px 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            display: inline-block;
          }

          /* Section Title */
          .section-title-area {
            margin-top: 4px;
            margin-bottom: 14px;
          }
          .section-sub {
            font-size: 24px;
            font-weight: 700;
            color: #9CA3AF;
            margin-bottom: 4px;
          }
          .section-title {
            font-size: 80px;
            font-weight: 900;
            line-height: 1.16;
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
            border-radius: 18px;
            padding: 16px 20px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }
          .point-card.highlight-border {
            border-color: rgba(255, 90, 54, 0.4);
            background: rgba(255, 90, 54, 0.06);
          }
          .point-badge {
            width: 44px;
            height: 44px;
            border-radius: 12px;
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
          .point-title { font-size: 27px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px; }
          .point-desc { font-size: 20px; font-weight: 500; color: #A1A7B5; line-height: 1.38; }

          /* Mini Visual Card */
          .mini-visual-card {
            width: 100%;
            height: 185px;
            border-radius: 18px;
            overflow: hidden;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 4px;
          }
          .mini-visual-card img { width: 100%; height: 100%; object-fit: cover; }
          .mini-visual-caption {
            position: absolute;
            bottom: 8px;
            left: 12px;
            font-size: 14px;
            font-weight: 700;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(6px);
            padding: 5px 12px;
            border-radius: 6px;
            color: #FFFFFF;
          }

          /* Summary Box (CTA) */
          .summary-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 22px;
            padding: 28px 26px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            margin-top: 10px;
          }
          .summary-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            font-size: 26px;
            font-weight: 500;
            color: #F3F4F6;
            line-height: 1.35;
          }
          .check-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #FF5A36;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 900;
            flex-shrink: 0;
            margin-top: 2px;
          }

          /* CTA Action Card */
          .cta-action-card {
            background: linear-gradient(135deg, rgba(255, 90, 54, 0.15) 0%, rgba(255, 90, 54, 0.05) 100%);
            border: 2px dashed #FF5A36;
            border-radius: 22px;
            padding: 30px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
          }
          .cta-title { font-size: 34px; font-weight: 900; color: #FFFFFF; }
          .cta-desc { font-size: 22px; color: #D1D5DB; }

          .disclaimer-text {
            font-size: 14px;
            color: #6B7280;
            text-align: center;
            margin-top: 12px;
          }

          /* Bottom Bar */
          .bottom-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
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

const targetReportDir = process.argv[2] || path.join(__dirname, '../outputs/261002_1718');
renderCardNews(targetReportDir)
  .then(files => {
    console.log(JSON.stringify({ success: true, files }, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('렌더링 에러:', err);
    process.exit(1);
  });
