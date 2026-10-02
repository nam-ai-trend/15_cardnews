require('dotenv').config();
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim() || apiKey.includes('your_openai_api_key')) {
    return null;
  }
  return new OpenAI({ apiKey: apiKey.trim() });
}

/**
 * 1. 릴스 영상 오디오 다운로드 & OpenAI Whisper STT 전사
 */
async function transcribeReelsAudio(videoUrl) {
  const openai = getOpenAIClient();
  if (!openai) {
    console.warn('[STT] OpenAI API Key가 설정되지 않았습니다.');
    return {
      success: false,
      text: null,
      message: '.env 파일에 OPENAI_API_KEY를 입력해주세요.'
    };
  }

  if (!videoUrl) {
    return { success: false, text: null, message: '영상 URL이 제공되지 않았습니다.' };
  }

  const tempFilePath = path.join(os.tmpdir(), `reels_${Date.now()}.mp4`);

  try {
    console.log(`[STT] 릴스 오디오 다운로드 시작: ${videoUrl.slice(0, 60)}...`);
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000
    });

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`[STT] 다운로드 완료, Whisper API 호출 중...`);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: 'ko'
    });

    console.log(`[STT] 음성 전사 완료! 내용: ${transcription.text.slice(0, 80)}...`);
    return {
      success: true,
      text: transcription.text
    };
  } catch (err) {
    console.error(`[STT 오류]`, err.message);
    return {
      success: false,
      text: null,
      message: `음성 전사 실패: ${err.message}`
    };
  } finally {
    if (fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }
  }
}

/**
 * 2. 카드뉴스 이미지 Vision AI 텍스트/표 분석 (Base64 인코딩 지원으로 403 방지)
 */
async function analyzeCardImages(imageUrls = []) {
  const openai = getOpenAIClient();
  if (!openai || !imageUrls || imageUrls.length === 0) {
    return { success: false, text: null };
  }

  try {
    console.log(`[Vision] 카드뉴스 이미지 ${imageUrls.length}장 다운로드 및 Base64 인코딩 시작...`);
    const contentPayload = [
      {
        type: "text",
        text: "이 카드뉴스 이미지들에 적힌 핵심 텍스트, 목차, 수치 데이터, 표, 체크포인트를 누락 없이 슬라이드별로 상세하게 한글로 꼼꼼하게 추출하고 정리해줘."
      }
    ];

    // 최대 7장까지 다운로드 및 Base64 변환
    const targetUrls = imageUrls.slice(0, 7);
    for (const url of targetUrls) {
      try {
        const imgRes = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          },
          timeout: 10000
        });
        const b64 = Buffer.from(imgRes.data).toString('base64');
        contentPayload.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${b64}` }
        });
      } catch (dlErr) {
        console.warn(`[Vision 이미지 다운로드 실패 건너뜀]`, dlErr.message);
      }
    }

    if (contentPayload.length <= 1) {
      return { success: false, text: null, message: "이미지를 다운로드할 수 없습니다." };
    }

    console.log(`[Vision] ${contentPayload.length - 1}장 이미지 GPT-4o-mini Vision 분석 호출 중...`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: contentPayload }],
      max_tokens: 1500
    });

    const extractedText = response.choices[0]?.message?.content || "";
    console.log(`[Vision] 카드뉴스 이미지 텍스트 추출 완료! (글자 수: ${extractedText.length}자)`);
    return { success: true, text: extractedText };
  } catch (err) {
    console.error(`[Vision 오류]`, err.message);
    return { success: false, text: null, message: err.message };
  }
}

/**
 * 3. 4대 핵심 분석 & 7대 관점 중 TOP 3 엄선 리포트 생성
 */
async function generateMultimodalInsight({ topic, caption, audioText, imageText, metrics = {} }) {
  const openai = getOpenAIClient();

  const fullContext = `
[주제/키워드]: ${topic || '부동산/재테크 핫이슈'}
[인스타 원문 캡션]: ${caption || '(캡션 없음)'}
[릴스 음성 전사본 (Whisper STT)]: ${audioText || '(음성 텍스트 없음)'}
[카드뉴스 이미지 추출 텍스트 (Vision)]: ${imageText || '(이미지 분석 없음)'}
[성과 지표]: 좋아요 ${metrics.likesCount || 0}개, 조회수 ${metrics.viewsCount || 0}회
`.trim();

  // 7대 관점 기본 메타
  const SEVEN_ANGLES_MASTER = [
    { id: "angle_warning", title: "🚨 1. 반전/폭로/경고형 (손실 회피)", tag: "손실회피 1위" },
    { id: "angle_cheat", title: "📋 2. 치트키/체크리스트형 (소장 가치)", tag: "저장률 1위" },
    { id: "angle_easy", title: "💡 3. 초등학생 눈높이 3분 쉬운 요약형 (대중성)", tag: "이해도 1위" },
    { id: "angle_vs", title: "⚖️ 4. 극단적 VS 비교형 (댓글 토론)", tag: "댓글 반응 1위" },
    { id: "angle_story", title: "📈 5. 성공/실패 실화 스토리텔링형 (공감/몰입)", tag: "몰입도 1위" },
    { id: "angle_target", title: "🎯 6. 초개인화 타겟팅형 (클릭률 극대화)", tag: "클릭률 1위" },
    { id: "angle_calc", title: "🔢 7. 1분 계산기/수치 공식형 (스크랩 유도)", tag: "공유율 1위" }
  ];

  if (openai) {
    try {
      console.log(`[Analyzer] OpenAI GPT 기반 4대 심층 분석 및 TOP 3 떡상 관점 선발 중...`);
      const prompt = `
당신은 인스타그램에서 수백만 조회수를 기록한 1티어 콘텐츠 기획자이자 부동산/재테크 수석 에디터입니다.
아래 수집된 원본 콘텐츠(캡션, 음성 STT, 이미지 텍스트)를 바탕으로, 다음 4가지 핵심 항목을 상세하고 전문적으로 분석하여 JSON으로 출력해주세요.

${fullContext}

[필수 분석 항목]
1. 원문 상세 내용 분석 (originalContent): 원문이 실제로 어떤 핵심 팩트와 수치, 팁을 담고 있는지 꼼꼼하게 정리.
2. 원문 떡상 요인 심층 해체 (viralReason): 이 콘텐츠가 사람들의 어떤 심리(손실회피, 불안, 호기심, 욕망 등)를 자극하여 터졌는지 분석.
3. 차별화 업그레이드 접근법 (upgradeStrategy): 원본을 그대로 베끼지 않고, 동일한 주제를 훨씬 더 신뢰성 있고 매력적인 카드뉴스로 업그레이드하기 위한 구체적 기획 전략 (원본의 한계점과 우리의 차별화 포인트).
4. 7대 관점 중 최적의 TOP 3 선발 (top3Angles):
   - 선발 기준 (selectionCriteria): 원본 내용과의 시너지, 인스타그램 저장/공유 잠재력, 독자 반응성.
   - 7가지 관점 중 가장 효과적인 3개를 엄선하고, 각각에 대해 다음을 상세히 작성:
     * 선발 사유 (selectionReason): 왜 이 관점이 최적인지 구체적 근거.
     * 1장 킬러 카피 (customHook): 스크롤을 멈추게 할 강력한 메인 헤드라인.
     * 핵심 전개 방향 (approach): 독자의 호기심을 유지하며 메시지를 전달하는 핵심 방향.
     * 슬라이드별 상세 전개 시나리오 (storyline): 1번 표지부터 마지막 CTA까지 각 슬라이드에서 어떤 내용을 어떻게 풀어나갈지 구체적으로 서술 (예: Slide 1, Slide 2, Slide 3, Slide 4, Slide 5).
5. 나머지 관점들 (remainingAngles): 간단한 맞춤 후킹과 1줄 설명.

다음 JSON 규격으로만 엄격하게 응답해주세요:
{
  "originalContent": {
    "summary": "원문의 핵심 내용을 담은 상세 요약 (2~3문장)",
    "keyFacts": ["핵심 팩트/수치 1", "핵심 팩트/수치 2", "핵심 팩트/수치 3"]
  },
  "viralReason": {
    "trigger": "핵심 후킹 심리 트리거 (예: 손실 회피, 정보 비대칭 해소)",
    "analysis": "왜 이 콘텐츠가 인스타에서 터졌는지 구체적 분석 (2~3줄)"
  },
  "upgradeStrategy": {
    "weakness": "원본의 아쉬운 점/부족한 점 (예: 구체적 실행 지침 부족, 시각화 부재)",
    "approach": "우리가 동일 주제를 압도하기 위한 업그레이드 방향 (2~3줄)"
  },
  "selectionCriteria": "TOP 3 선발 기준 (예: 투자자들의 손실 불안감 해소 및 실전 저장 가치 극대화)",
  "top3Angles": [
    {
      "rank": 1,
      "id": "angle_warning",
      "title": "🚨 1. 반전/폭로/경고형 (손실 회피)",
      "tag": "최우선 추천",
      "selectionReason": "이 관점을 1위로 선발한 명확한 근거",
      "customHook": "독자를 멈춰 세울 1장 킬러 카피",
      "approach": "어떤 심리와 논리로 풀어갈 것인지 핵심 전개 방향",
      "storyline": [
        { "slide": 1, "role": "후킹/표지", "detail": "손실 경고 및 호기심 자극 킬러 카피 제시" },
        { "slide": 2, "role": "문제 제기", "detail": "많은 사람들이 간과하는 치명적인 착각과 손실 사례 공개" },
        { "slide": 3, "role": "팩트/데이터", "detail": "원문 팩트를 기반으로 한 실제 손실 수치 및 핵심 비교" },
        { "slide": 4, "role": "해결책/치트키", "detail": "지금 당장 손해를 막는 3단계 실천 액션 플랜" },
        { "slide": 5, "role": "요약/CTA", "detail": "핵심 1줄 총정리 및 인스타그램 저장/공유 유도" }
      ]
    },
    {
      "rank": 2,
      "id": "angle_cheat",
      "title": "📋 2. 치트키/체크리스트형 (소장 가치)",
      "tag": "대안 추천 A",
      "selectionReason": "선발 사유",
      "customHook": "1장 킬러 카피",
      "approach": "핵심 전개 방향",
      "storyline": [
        { "slide": 1, "role": "후킹/표지", "detail": "..." },
        { "slide": 2, "role": "체크포인트 1", "detail": "..." },
        { "slide": 3, "role": "체크포인트 2", "detail": "..." },
        { "slide": 4, "role": "실전 가이드", "detail": "..." },
        { "slide": 5, "role": "요약/CTA", "detail": "..." }
      ]
    },
    {
      "rank": 3,
      "id": "angle_vs",
      "title": "⚖️ 4. 극단적 VS 비교형 (댓글 토론)",
      "tag": "대안 추천 B",
      "selectionReason": "선발 사유",
      "customHook": "1장 킬러 카피",
      "approach": "핵심 전개 방향",
      "storyline": [
        { "slide": 1, "role": "후킹/표지", "detail": "..." },
        { "slide": 2, "role": "A vs B 비교", "detail": "..." },
        { "slide": 3, "role": "핵심 반전", "detail": "..." },
        { "slide": 4, "role": "최종 판정", "detail": "..." },
        { "slide": 5, "role": "댓글 유도/CTA", "detail": "..." }
      ]
    }
  ],
  "remainingAngles": [
    {
      "id": "angle_easy",
      "title": "💡 3. 초등학생 눈높이 3분 쉬운 요약형 (대중성)",
      "tag": "대중성",
      "customHook": "맞춤 후킹 문구",
      "plot": "간단 전개 전략"
    }
  ]
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      return {
        success: true,
        originalContent: parsed.originalContent,
        viralReason: parsed.viralReason,
        upgradeStrategy: parsed.upgradeStrategy,
        selectionCriteria: parsed.selectionCriteria,
        top3Angles: parsed.top3Angles || [],
        remainingAngles: parsed.remainingAngles || [],
        allAngles: [...(parsed.top3Angles || []), ...(parsed.remainingAngles || [])]
      };
    } catch (err) {
      console.error(`[Analyzer GPT 분석 오류]`, err.message);
    }
  }

  // Fallback
  const fallbackTop3 = [
    {
      rank: 1,
      id: "angle_warning",
      title: "🚨 1. 반전/폭로/경고형 (손실 회피)",
      tag: "최우선 추천",
      selectionReason: "투자/부동산 분야에서 손실 회피 심리는 클릭률과 저장을 가장 강력하게 견인합니다.",
      customHook: `지금 모르면 매달 손해봅니다! ${topic} 숨은 진실`,
      approach: "독자가 평소 당연하게 여겼던 착각을 깨부수고 실전 손실을 방지하는 구조",
      storyline: [
        { slide: 1, role: "후킹/표지", detail: `지금 모르면 매달 손해봅니다! ${topic} 숨은 진실` },
        { slide: 2, role: "문제 폭로", detail: "대부분의 사람들이 놓치는 치명적인 비용 및 리스크 2가지" },
        { slide: 3, role: "팩트/데이터", detail: "실제 데이터로 계산해본 1년 누적 손실 금액 대공개" },
        { slide: 4, role: "해결 방안", detail: "내 손실을 0원으로 만드는 즉시 실천 체크리스트" },
        { slide: 5, role: "요약/CTA", detail: "핵심 1줄 요약 및 두고두고 볼 수 있도록 인스타 저장 유도" }
      ]
    },
    {
      rank: 2,
      id: "angle_cheat",
      title: "📋 2. 치트키/체크리스트형 (소장 가치)",
      tag: "대안 추천 A",
      selectionReason: "당장 써먹을 수 있는 체크리스트는 인스타 알고리즘이 가장 우대하는 '저장(Scrap)'을 유발합니다.",
      customHook: `이것만 캡처해두면 끝! ${topic} 필수 체크리스트 5`,
      plot: "1장: 총정리 표지 ➔ 2~3장: 핵심 체크리스트 ➔ 4장: 저장 유도 CTA"
    },
    {
      rank: 3,
      id: "angle_vs",
      title: "⚖️ 4. 극단적 VS 비교형 (댓글 토론)",
      tag: "대안 추천 B",
      selectionReason: "선택지 간의 데이터 비교는 댓글 창에서 활발한 토론을 일으켜 도달률을 폭발시킵니다.",
      customHook: `A vs B, 실제 데이터로 본 ${topic} 수익률 차이는?`,
      plot: "1장: 대결 구도 ➔ 2장: A 분석 ➔ 3장: B 분석 ➔ 4장: 결론 및 댓글 유도"
    }
  ];

  return {
    success: true,
    originalContent: {
      summary: caption ? caption.slice(0, 100) : `${topic} 관련 최신 시장 핫이슈`,
      keyFacts: [topic, "핵심 수치 데이터 및 동향", "실전 투자자 유의사항"]
    },
    viralReason: {
      trigger: "시의성 + 투자자 불안 심리 해소",
      analysis: "많은 사람들이 궁금해하지만 명확히 정리되지 않은 정보를 짚어주어 높은 관심을 받았습니다."
    },
    upgradeStrategy: {
      weakness: "일반적인 정보 나열 위주로 구성되어 직관적인 데이터 시각화가 부족함",
      approach: "최신 2026 팩트 데이터를 결합하고 1장의 후킹을 강화하여 소장 가치를 극대화합니다."
    },
    selectionCriteria: "독자의 손실 방지 및 소장 가치 극대화 기준",
    top3Angles: fallbackTop3,
    remainingAngles: SEVEN_ANGLES_MASTER.filter(m => !fallbackTop3.some(t => t.id === m.id)).map(m => ({
      ...m,
      customHook: `[${topic}] ${m.title}`,
      plot: "표지 ➔ 본문 핵심 ➔ 해결책 ➔ CTA"
    })),
    allAngles: SEVEN_ANGLES_MASTER
  };
}

module.exports = {
  transcribeReelsAudio,
  analyzeCardImages,
  generateMultimodalInsight
};
