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
      category: "📊 10월 2일 증시 브리핑",
      date: "2026.10.02",
      html: `
        <div class="slide-container cover-slide">
          <div class="top-meta">
            <span class="category-badge">📊 10월 2일 긴급 시황 · 증시 브리핑</span>
            <span class="page-indicator">01 / 04</span>
          </div>

          <div class="hero-title-area">
            <div class="hero-sub">코스피 +0.46% 📈 외인·연기금 집중 매수</div>
            <h1 class="hero-main">
              연기금이 쓸어담은 <br>
              <span class="text-highlight">알짜 종목 TOP 5</span>
            </h1>
          </div>

          <div class="visual-card">
            <img src="${coverImg}" alt="Stock Trading Floor" />
            <div class="visual-overlay">
              <span class="overlay-badge">🔥 연기금 순매수 & 오늘의 3대 급등 테마주 총정리</span>
            </div>
          </div>

          <div class="bottom-bar">
            <div class="author-info">
              <div class="avatar">📈</div>
              <span class="handle">@letsgetit_stock</span>
            </div>
            <div class="swipe-hint">
              <span>밀어서 핵심 5종목 확인</span>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `
    },
    // 2장: 본문 1 (Layout 2 - 5개 컴팩트 글래스 카드형)
    {
      page: 2,
      total: 4,
      category: "PART 01 · 연기금 순매수",
      date: "2026.10.02",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(59, 130, 246, 0.2); color: #60A5FA; border-color: rgba(59, 130, 246, 0.4);">PART 01</span>
            <span class="page-indicator">02 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">기관·연기금이 집중 매수한 알짜 주도주</div>
            <h2 class="section-title">연기금 Pick <span class="text-highlight">핵심 5대 종목</span></h2>
          </div>

          <div class="points-list" style="gap: 10px;">
            <div class="point-card highlight-border">
              <div class="point-badge orange">01</div>
              <div class="point-content">
                <div class="point-title">SK하이닉스 <span class="stock-tag">반도체 대장주</span></div>
                <div class="point-desc">차세대 HBM 독점 공급 및 AI 반도체 실적 턴어라운드 강력 기대감</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">02</div>
              <div class="point-content">
                <div class="point-title">삼성전자 <span class="stock-tag">시총 1위</span></div>
                <div class="point-desc">저평가 밸류에이션 매력 및 안정적인 배당 수익률로 매수세 유입</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">03</div>
              <div class="point-content">
                <div class="point-title">SK스퀘어 <span class="stock-tag">ICT 지주사</span></div>
                <div class="point-desc">반도체 및 차세대 IT 자회사들의 가치 재평가 모멘텀</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">04</div>
              <div class="point-content">
                <div class="point-title">롯데에너지머티리얼즈 <span class="stock-tag">2차전지</span></div>
                <div class="point-desc">차세대 하이엔드 동박 공급 확대 및 신재생 에너지 부문 주목</div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">05</div>
              <div class="point-content">
                <div class="point-title">리노공업 <span class="stock-tag">반도체 소부장</span></div>
                <div class="point-desc">글로벌 반도체 테스트 소켓 1위의 높은 영업이익률과 독점적 경쟁력</div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card" style="height: 155px; margin-top: 4px;">
            <img src="${slide2Img}" alt="Semiconductor Wafer Tech" />
            <div class="mini-visual-caption">💡 반도체 및 신성장 섹터 중심 연기금 매수세 집중</div>
          </div>

          <div class="bottom-bar" style="padding-top: 14px;">
            <div class="author-info">
              <div class="avatar">📈</div>
              <span class="handle">@letsgetit_stock</span>
            </div>
            <div class="swipe-hint">
              <span>급등 특징주 확인 ➔</span>
            </div>
          </div>
        </div>
      `
    },
    // 3장: 본문 2 (Layout 2 - 오늘의 3대 급등 특징주)
    {
      page: 3,
      total: 4,
      category: "PART 02 · 섹터 테마 분석",
      date: "2026.10.02",
      html: `
        <div class="slide-container body-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(16, 185, 129, 0.2); color: #34D399; border-color: rgba(16, 185, 129, 0.4);">PART 02</span>
            <span class="page-indicator">03 / 04</span>
          </div>

          <div class="section-title-area">
            <div class="section-sub">마이크론 호실적 & 중동 이슈 수혜</div>
            <h2 class="section-title">오늘 시장 주도 <span class="text-highlight">3대 급등 섹터</span></h2>
          </div>

          <div class="points-list" style="gap: 14px;">
            <div class="point-card highlight-border">
              <div class="point-badge orange">📡</div>
              <div class="point-content">
                <div class="point-title">광통신 섹터 <span class="rate-badge red">상한가 랠리</span></div>
                <div class="point-desc">미국 마이크론 어닝 서프라이즈 및 AI 데이터센터 설비투자 확대 수혜</div>
                <div class="stock-detail-row">
                  <span class="stock-pill">티엠씨 <strong>+29.95%</strong> (18,440원)</span>
                  <span class="stock-pill">머큐리 <strong>+29.80%</strong> (6,250원)</span>
                </div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge blue">🛢️</div>
              <div class="point-content">
                <div class="point-title">정유·에너지 섹터 <span class="rate-badge red">유가 급등 수혜</span></div>
                <div class="point-desc">중국 석유제품 수출 중단 소식과 중동 지정학적 긴장감 고조로 국제유가 상승</div>
                <div class="stock-detail-row">
                  <span class="stock-pill">S-Oil <strong>+11.69%</strong> (166,200원)</span>
                  <span class="stock-pill">SK이노베이션 <strong>+10.32%</strong></span>
                  <span class="stock-pill">GS <strong>+4.11%</strong></span>
                </div>
              </div>
            </div>

            <div class="point-card">
              <div class="point-badge green">🚀</div>
              <div class="point-content">
                <div class="point-title">우주항공 섹터 <span class="rate-badge red">신성장 모멘텀</span></div>
                <div class="point-desc">스페이스X 우주선 ISS 도킹 성공 + 누리호 발사 기대감 동시 작용</div>
                <div class="stock-detail-row">
                  <span class="stock-pill">나라스페이스 <strong>+22.95%</strong> (17,410원)</span>
                  <span class="stock-pill">센서뷰 <strong>+9.95%</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="mini-visual-card" style="height: 155px; margin-top: 6px;">
            <img src="${slide3Img}" alt="Aerospace Optical Energy Infrastructure" />
            <div class="mini-visual-caption">📍 광통신 · 에너지 · 우주항공 섹터 동반 강세</div>
          </div>

          <div class="bottom-bar" style="padding-top: 14px;">
            <div class="author-info">
              <div class="avatar">📈</div>
              <span class="handle">@letsgetit_stock</span>
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
      category: "SUMMARY · 최종 요약",
      date: "2026.10.02",
      html: `
        <div class="slide-container cta-slide">
          <div class="top-meta">
            <span class="category-badge" style="background: rgba(239, 68, 68, 0.2); color: #F87171; border-color: rgba(239, 68, 68, 0.4);">SUMMARY</span>
            <span class="page-indicator">04 / 04</span>
          </div>

          <div class="section-title-area" style="text-align: center; margin-top: 15px; margin-bottom: 20px;">
            <div class="section-sub" style="font-size: 26px;">10월 2일 증시 핵심 요점정리</div>
            <h2 class="section-title" style="font-size: 78px; line-height: 1.2;">오늘의 <span class="text-highlight">3줄 핵심 총정리</span></h2>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>코스피 +0.46% 반등:</strong> 외인·연기금의 SK하이닉스, 삼전 등 대형 반도체 중심 순매수</div>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>3대 주도 테마:</strong> 마이크론 호실적 광통신(+29%), 유가상승 정유, 우주항공 급등</div>
            </div>
            <div class="summary-item">
              <span class="check-icon">✓</span>
              <div><strong>다음 주요일정 (10/5):</strong> 한국 증시 휴장 / 미국 CME GPU 선물계약 정식 출시</div>
            </div>
          </div>

          <div class="cta-action-card">
            <div class="cta-icon-wrap">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="#FF5A36"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="cta-title">다음 주 개장 전 복기하려면?</div>
            <div class="cta-desc">오른쪽 아래 <strong>[저장(북마크)]</strong> 눌러두고 월요일 장 시작 전 꼭 확인하세요!</div>
          </div>

          <div class="disclaimer-text">
            ※ 특정 종목 및 섹터에 대한 투자 권유가 아니며, 투자에 대한 책임은 본인에게 있습니다.
          </div>

          <div class="bottom-bar" style="margin-top: 15px; padding-top: 15px;">
            <div class="author-info">
              <div class="avatar" style="width: 50px; height: 50px; font-size: 24px;">📈</div>
              <div>
                <div style="font-weight: 800; font-size: 22px; color: #fff;">@letsgetit_stock</div>
                <div style="font-size: 15px; color: #9CA3AF;">매일 실시간으로 전달하는 핵심 증시 브리핑</div>
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
            gap: 10px;
          }
          .point-card {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 18px;
            padding: 14px 20px;
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
          .point-title { font-size: 26px; font-weight: 800; color: #FFFFFF; margin-bottom: 3px; display: flex; align-items: center; gap: 10px; }
          .point-desc { font-size: 19px; font-weight: 500; color: #A1A7B5; line-height: 1.35; }
          
          .stock-tag {
            font-size: 14px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            color: #E2E8F0;
          }
          .rate-badge {
            font-size: 15px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 6px;
          }
          .rate-badge.red {
            background: rgba(239, 68, 68, 0.2);
            color: #F87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
          }
          .stock-detail-row {
            display: flex;
            gap: 10px;
            margin-top: 6px;
          }
          .stock-pill {
            font-size: 15px;
            background: rgba(255, 255, 255, 0.07);
            padding: 4px 12px;
            border-radius: 8px;
            color: #E5E7EB;
          }
          .stock-pill strong {
            color: #F87171;
          }

          /* Mini Visual Card */
          .mini-visual-card {
            width: 100%;
            border-radius: 18px;
            overflow: hidden;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
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

const targetReportDir = process.argv[2] || path.join(__dirname, '../outputs/261002_1707');
renderCardNews(targetReportDir)
  .then(files => {
    console.log(JSON.stringify({ success: true, files }, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('렌더링 에러:', err);
    process.exit(1);
  });
