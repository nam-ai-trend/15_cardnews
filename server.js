const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { fetchInstagramTopicTrends, fetchTargetAccountsReels, fetchSingleInstagramPost } = require('./collectors/apify_collector');
const { fetchAutoRealEstateNews } = require('./collectors/estate_collector');
const { generateCardNewsScript, generateAdvancedCardScript, analyzeReelsUrl } = require('./engine/analyzer');
const { transcribeReelsAudio, analyzeCardImages, generateMultimodalInsight } = require('./engine/multimodal_analyzer');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// 서버 단 동시 중복 요청 방지 락 (Task Locks)
const serverLocks = {
  topic: false,
  accounts: false,
  estate: false,
  multimodal: false,
  render: false
};

// 1. [Apify] 주제별 20개 핫트렌드 수집 API
app.post('/api/collect/topic', async (req, res) => {
  if (serverLocks.topic) {
    return res.status(429).json({ error: '이미 주제별 수집 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.' });
  }
  serverLocks.topic = true;

  try {
    const { topic } = req.body;
    const targetTopic = topic && topic.trim() ? topic.trim() : '부동산';
    console.log(`[API] Apify 주제별 20개 수집: ${targetTopic}`);
    const trends = await fetchInstagramTopicTrends(targetTopic);
    res.json({ success: true, topic: targetTopic, count: trends.length, data: trends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    serverLocks.topic = false;
  }
});

// 2. [Apify] 특정 계정 릴스 전수 수집 API
app.post('/api/collect/accounts', async (req, res) => {
  if (serverLocks.accounts) {
    return res.status(429).json({ error: '이미 계정 릴스 수집 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.' });
  }
  serverLocks.accounts = true;

  try {
    const { accounts } = req.body;
    const targetList = Array.isArray(accounts) && accounts.length > 0 
      ? accounts 
      : (accounts ? accounts.split(',').map(s => s.trim()) : ['@real_estate_king']);
    console.log(`[API] 특정 계정 릴스 전수 수집:`, targetList);
    const results = await fetchTargetAccountsReels(targetList);
    res.json({ success: true, accounts: targetList, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    serverLocks.accounts = false;
  }
});

// 3. [핫이슈 뉴스] 네이버 실시간 핫이슈 (부동산·정책·정치) 자동 수집 API
app.post('/api/collect/estate', async (req, res) => {
  if (serverLocks.estate) {
    return res.status(429).json({ error: '이미 핫이슈 뉴스 수집 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.' });
  }
  serverLocks.estate = true;

  try {
    console.log(`[API] 네이버 실시간 핫이슈 뉴스(부동산·정치) 자동 수집 요청`);
    const newsList = await fetchAutoRealEstateNews();
    res.json({ success: true, count: newsList.length, data: newsList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    serverLocks.estate = false;
  }
});

// 4. [멀티모달] 릴스 STT / 카드뉴스 이미지 분석 & 7대 관점 제안 API
app.post('/api/analyze-multimodal', async (req, res) => {
  const { topic, caption, videoUrl, imageUrls, likesCount, viewsCount } = req.body;
  console.log(`[API] 멀티모달 정밀 분석 요청: topic='${topic}' | video=${!!videoUrl} | images=${(imageUrls || []).length}장`);

  let audioText = null;
  if (videoUrl) {
    const sttRes = await transcribeReelsAudio(videoUrl);
    if (sttRes.success) audioText = sttRes.text;
  }

  let imageText = null;
  if (imageUrls && imageUrls.length > 0) {
    const visionRes = await analyzeCardImages(imageUrls);
    if (visionRes.success) imageText = visionRes.text;
  }

  const insight = await generateMultimodalInsight({
    topic,
    caption,
    audioText,
    imageText,
    metrics: { likesCount, viewsCount }
  });

  res.json({
    success: true,
    audioText,
    imageText,
    ...insight
  });
});

// 5. [AI 대본 생성] 7대 관점 + 사용자 인터랙티브 피드백 반영 슬라이드 대본 생성 API
app.post('/api/generate-advanced-script', async (req, res) => {
  const { topic, angleId, slideCount, userFeedback, customHook, coreContext } = req.body;
  if (!topic) {
    return res.status(400).json({ error: '주제를 입력해주세요.' });
  }

  console.log(`[API] 7대 관점 기반 카드뉴스 대본 생성: '${topic}' (관점: ${angleId}, 장수: ${slideCount}장)`);
  const script = await generateAdvancedCardScript({
    topic,
    angleId,
    slideCount,
    userFeedback,
    customHook,
    coreContext
  });

  res.json({ success: true, script });
});

// 6. [인스타 릴스] 릴스 URL 정밀 역분석 API (Apify 실시간 연동)
app.post('/api/analyze-reels', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: '릴스 URL을 입력해주세요.' });
  }
  console.log(`[API] 릴스 URL 떡상 역분석 (Apify 연동): ${url}`);

  try {
    // 1. Apify를 통해 실제 릴스 게시물 데이터 스크래핑
    const postData = await fetchSingleInstagramPost(url);
    
    // 2. 캡션 내용을 기반으로 한 역분석 수행
    const analysis = analyzeReelsUrl(url);

    // 3. 실제 캡션이 수집되었으면 분석 결과 보강
    if (postData && postData.caption && postData.caption !== "인스타그램 릴스 레퍼런스") {
      const firstLine = postData.caption.split('\n')[0].trim();
      if (firstLine.length > 5) {
        analysis.extractedHook = `실제 릴스 1장 후킹: "${firstLine.slice(0, 40)}..."`;
      }
      analysis.caption = postData.caption;
      analysis.author = postData.author;
      analysis.likesCount = postData.likesCount;
      analysis.viewsCount = postData.viewsCount;
    }

    res.json({ 
      success: true, 
      analysis, 
      postData 
    });
  } catch (err) {
    console.error('[API 릴스 역분석 오류]', err.message);
    const analysis = analyzeReelsUrl(url);
    res.json({ success: true, analysis, postData: null });
  }
});

/**
 * 한국 시간 기준 YYMMDD_HHMM 폴더명 생성 함수
 */
function getFormattedTimestampFolder() {
  const now = new Date();
  // 한국 표준시 (KST, UTC+9)
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);

  const yy = String(kstDate.getUTCFullYear()).slice(2);
  const mm = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getUTCDate()).padStart(2, '0');
  const hh = String(kstDate.getUTCHours()).padStart(2, '0');
  const min = String(kstDate.getUTCMinutes()).padStart(2, '0');

  const baseName = `${yy}${mm}${dd}_${hh}${min}`;
  let finalName = baseName;
  let counter = 1;

  // 동일한 분에 여러 번 저장할 경우 _1, _2 접미사
  while (fs.existsSync(path.join(__dirname, 'outputs', finalName))) {
    finalName = `${baseName}_${counter}`;
    counter++;
  }

  return finalName;
}

// 7. [자료수집 완료] 원본 + STT + 4대 분석 + 재해석 + 대본 종합 Markdown 저장 API
app.post('/api/save-report', async (req, res) => {
  try {
    const { topicData, multimodalData, selectedAngle, script } = req.body;
    if (!topicData || !script) {
      return res.status(400).json({ error: '필수 데이터(원본 정보 또는 대본)가 누락되었습니다.' });
    }

    const folderName = getFormattedTimestampFolder();
    const targetDir = path.join(__dirname, 'outputs', folderName);
    fs.mkdirSync(targetDir, { recursive: true });

    // 1. Markdown 리포트 내용 구성
    const orig = multimodalData?.originalContent || {};
    const viral = multimodalData?.viralReason || {};
    const upg = multimodalData?.upgradeStrategy || {};
    const angle = selectedAngle || {};

    let mdContent = `# 📑 [인스타/부동산 트렌드 분석 & 카드뉴스 기획 리포트]
> **생성 일시:** ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (KST)  
> **저장 폴더:** \`outputs/${folderName}/\`

---

## 1️⃣ 원본 콘텐츠 정보
- **주제 / 제목:** ${topicData.topic || '(제목 없음)'}
- **원문 캡션:**  
  ${topicData.caption ? topicData.caption.replace(/\n/g, '\n  ') : '(캡션 없음)'}
- **출처 / 계정:** ${topicData.source || '(미상)'}
- **미디어 유형:** ${topicData.mediaType === 'reel' ? '🎬 인스타 릴스 영상' : topicData.mediaType === 'cardnews' ? '📑 카드뉴스 이미지' : '⚡ 부동산 팩트 브리핑'}
- **성과 지표:** 좋아요 ${topicData.likesCount?.toLocaleString() || 0}개 / 조회수 ${topicData.viewsCount?.toLocaleString() || 0}회
- **원본 바로가기:** [인스타그램 원본 링크](${topicData.url || '#'})

---

## 2️⃣ 원본 추출 데이터 (STT 음성 전사 / Vision 이미지 텍스트)
${multimodalData?.audioText ? `### 🎙️ 릴스 음성 전사 전체 (Whisper STT)
\`\`\`text
${multimodalData.audioText}
\`\`\`
` : ''}
${multimodalData?.imageText ? `### 👁️ 카드뉴스 슬라이드 추출 텍스트 (Vision AI)
\`\`\`text
${multimodalData.imageText}
\`\`\`
` : ''}
${!multimodalData?.audioText && !multimodalData?.imageText ? `*(추가 음성/이미지 텍스트 없음 - 텍스트 원문 기반 분석)*\n` : ''}

---

## 3️⃣ 4대 심층 분석 인사이트
### 1. 원문 상세 내용 분석
- **요약:** ${orig.summary || topicData.summary || '원문 내용 요약 완료'}
${orig.keyFacts && orig.keyFacts.length > 0 ? `- **핵심 팩트 및 수치:**\n${orig.keyFacts.map(f => `  - ${f}`).join('\n')}` : ''}

### 2. 원문 떡상 요인 심층 해체
- **핵심 심리 트리거:** ${viral.trigger || '손실 회피 & 정보 비대칭'}
- **바이럴 성공 요인:** ${viral.analysis || '독자의 불안감 및 호기심 자극'}

### 3. 차별화 업그레이드 접근법
- **원본의 한계점:** ${upg.weakness || '단순 텍스트 나열로 가독성 및 소장 가치 부족'}
- **우리의 차별화 전략:** ${upg.approach || '정밀 인포그래픽과 3단계 실천 가이드로 저장률 극대화'}

### 4. 7대 관점 선발 기준
- **엄선 기준:** ${multimodalData?.selectionCriteria || '투자자의 손실 불안 해소 및 인스타그램 실전 저장/공유 잠재력 극대화'}

---

## 4️⃣ 선택된 떡상 재해석 관점 상세 분석
- **선택 관점:** **${angle.title || '🚨 1. 반전/폭로/경고형 (손실 회피)'}** [${angle.tag || '추천'}]
- **선발 근거:** ${angle.selectionReason || '소비자의 손실 회피 심리를 자극하여 저장률과 참여도를 극대화'}
- **🎯 1장 킬러 카피:** \`${angle.customHook || '지금 모르면 매달 손해봅니다!'}\`
- **⚡ 핵심 전개 전략:** ${angle.approach || '독자의 인식을 전환하고 즉시 실행 가능한 해결책 제시'}

### 📋 카드별 상세 전개 시나리오
${(angle.storyline || []).map(s => `- **Slide ${s.slide} (${s.role}):** ${s.detail}`).join('\n') || '- 전개 시나리오 완료'}

---

## 5️⃣ AI 기획 확정 카드뉴스 대본 (총 ${script.slides?.length || 0}장)

`;

    // 슬라이드별 대본 마크다운 포맷팅
    (script.slides || []).forEach(slide => {
      mdContent += `### 📄 Slide ${slide.slide_number} / ${slide.total_slides} [${slide.type.toUpperCase()}]\n`;
      if (slide.type === 'cover') {
        mdContent += `- **헤드라인:** ${slide.headline_prefix || ''} **${slide.headline_highlight || ''}** ${slide.headline_suffix || ''}\n`;
        mdContent += `- **태그라인:** ${slide.tagline || ''}\n`;
        mdContent += `- **시각 이미지 설명:** ${slide.image_caption || ''}\n`;
        mdContent += `- **스와이프 유도:** ${slide.swipe_text || '밀어서 계속 보기 ➔'}\n\n`;
      } else if (slide.type === 'body_list' || slide.type === 'body_visual') {
        mdContent += `- **슬라이드 제목:** [${slide.step_badge || 'POINT'}] **${slide.title}**\n`;
        if (slide.points && slide.points.length > 0) {
          mdContent += `- **핵심 내용:**\n`;
          slide.points.forEach(p => {
            mdContent += `  ${p.number}. **${p.heading}:** ${p.desc}\n`;
          });
        }
        mdContent += `\n`;
      } else if (slide.type === 'cta') {
        mdContent += `- **요약 타이틀:** **${slide.summary_title}**\n`;
        if (slide.summary_items && slide.summary_items.length > 0) {
          slide.summary_items.forEach(item => {
            mdContent += `  - ${item}\n`;
          });
        }
        mdContent += `- **CTA 행동 유도:** ${slide.cta_action || '이 글이 도움되셨다면 저장하고 공유해보세요!'}\n\n`;
      }
    });

    // 2. 파일 저장 (report.md 단일 파일 저장)
    const reportPath = path.join(targetDir, 'report.md');
    fs.writeFileSync(reportPath, mdContent, 'utf-8');

    console.log(`[API] 자료수집 완료 및 리포트 저장 성공: ${reportPath}`);

    res.json({
      success: true,
      folderName,
      reportPath: `outputs/${folderName}/report.md`,
      markdownSummary: mdContent
    });

  } catch (err) {
    console.error(`[API 저장 오류]`, err);
    res.status(500).json({ error: err.message });
  }
});

// 8. 카드뉴스 무손실 1080x1350 PNG 렌더링 API (기존 유지)
app.post('/api/render', async (req, res) => {
  const { script, folderName: customFolder } = req.body;
  if (!script || !script.slides) {
    return res.status(400).json({ error: '올바른 대본 데이터가 필요합니다.' });
  }

  const folderName = customFolder || getFormattedTimestampFolder();
  const targetOutputDir = path.join(__dirname, 'outputs', folderName);
  fs.mkdirSync(targetOutputDir, { recursive: true });

  const templatePath = path.resolve(__dirname, 'templates/card_template.html');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const generatedImages = [];

  for (const slide of script.slides) {
    const pageNum = String(slide.slide_number).padStart(2, '0');
    const totalPages = String(slide.total_slides).padStart(2, '0');

    await page.goto(`file://${templatePath}`);

    await page.evaluate(({ data, slide, pageNum, totalPages }) => {
      document.getElementById('category-text').innerText = data.category || '부동산 핫이슈';
      document.getElementById('date-text').innerText = data.date || '2026.09.21';
      document.getElementById('handle-text').innerText = data.author?.name || '@realestate_insights';
      document.getElementById('avatar-text').innerText = data.author?.avatar_letter || 'R';
      document.getElementById('page-text').innerText = `${pageNum} / ${totalPages}`;

      const container = document.getElementById('slide-content-container');
      container.innerHTML = '';

      if (slide.type === 'cover') {
        container.innerHTML = `
          <div class="content-cover">
            <div class="cover-tagline">${slide.tagline || ''}</div>
            <h1 class="cover-headline">
              ${slide.headline_prefix || ''} <br>
              <span class="highlight">${slide.headline_highlight || ''}</span> ${slide.headline_suffix || ''}
            </h1>
            <div class="cover-visual-card">
              <img src="${slide.image_path}" alt="Cover Visual">
              <div class="cover-visual-overlay">
                <div class="cover-visual-caption">${slide.image_caption || ''}</div>
              </div>
            </div>
            <div class="swipe-hint">
              <span>${slide.swipe_text || '밀어서 계속 보기'}</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        `;
      } else if (slide.type === 'body_list') {
        const pointsHtml = slide.points.map(p => `
          <div class="point-card">
            <div class="point-number">${p.number}</div>
            <div class="point-content">
              <div class="point-heading">${p.heading}</div>
              <div class="point-desc">${p.desc}</div>
            </div>
          </div>
        `).join('');

        container.innerHTML = `
          <div class="content-body">
            <div class="body-title-wrap">
              <div class="body-step-badge">${slide.step_badge || 'SUMMARY'}</div>
              <h2 class="body-title">${slide.title}</h2>
            </div>
            <div class="point-cards-list">
              ${pointsHtml}
            </div>
          </div>
        `;
      } else if (slide.type === 'body_visual') {
        const pointsHtml = slide.points ? slide.points.map(p => `
          <div class="point-card" style="padding: 22px 28px;">
            <div class="point-number" style="background: var(--accent-blue-soft); color: var(--accent-blue);">${p.number}</div>
            <div class="point-content">
              <div class="point-heading" style="font-size: 26px;">${p.heading}</div>
              <div class="point-desc" style="font-size: 22px;">${p.desc}</div>
            </div>
          </div>
        `).join('') : '';

        container.innerHTML = `
          <div class="content-body">
            <div class="body-title-wrap">
              <div class="body-step-badge">${slide.step_badge || 'ACTION'}</div>
              <h2 class="body-title">${slide.title}</h2>
            </div>
            <div class="cover-visual-card" style="height: 380px;">
              <img src="${slide.image_path}" alt="Visual">
            </div>
            <div class="point-cards-list">
              ${pointsHtml}
            </div>
          </div>
        `;
      } else if (slide.type === 'cta') {
        const listHtml = slide.summary_items.map(item => `<li>${item}</li>`).join('');
        const iconsHtml = slide.icons.map(icon => `<div class="cta-icon-item">💾 ${icon}</div>`).join('');

        container.innerHTML = `
          <div class="content-cta">
            <div class="cta-summary-box">
              <div class="cta-summary-title">📌 ${slide.summary_title}</div>
              <ul class="cta-summary-list">
                ${listHtml}
              </ul>
            </div>
            <div class="cta-action-box">
              <div class="cta-action-title">${slide.action_title}</div>
              <div class="cta-action-desc">${slide.action_desc}</div>
              <div class="cta-icons-row">
                ${iconsHtml}
              </div>
            </div>
          </div>
        `;
      }
    }, { data: script, slide, pageNum, totalPages });

    await page.waitForTimeout(400);

    const filename = `slide_${pageNum}.png`;
    const outputFilePath = path.join(targetOutputDir, filename);
    await page.screenshot({ path: outputFilePath, clip: { x: 0, y: 0, width: 1080, height: 1350 } });

    generatedImages.push(`/outputs/${folderName}/${filename}`);
  }

  await browser.close();

  fs.writeFileSync(path.join(targetOutputDir, 'script.json'), JSON.stringify(script, null, 2));

  res.json({
    success: true,
    folder: folderName,
    images: generatedImages
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [서버] 업데이트 완료: http://localhost:${PORT}`);
});
