/**
 * 5대 떡상 카드뉴스 공식 기반 자동 대본 생성기 & 릴스 URL 역분석 엔진
 */

// 5대 떡상 공식 템플릿 정의
const VIRAL_FORMULAS = {
  warning: {
    name: "반전/경고형 (손실회피)",
    description: "불안감 자극 ➔ 90%가 놓치는 치명적 실수 ➔ 팩트 ➔ 명쾌한 해결책",
    build: (topic, details) => ({
      formula: "warning",
      tagline: "🚨 긴급 점검 · 손실 방지 가이드",
      headline_prefix: "모르면 수천만 원 날립니다!",
      headline_highlight: `${topic}`,
      headline_suffix: "숨은 함정과 대처법",
      slides: [
        {
          slide_number: 1,
          total_slides: 4,
          type: "cover",
          tagline: "🚨 긴급 점검 · 손실 방지",
          headline_prefix: "모르면 수천만 원 날립니다!",
          headline_highlight: `${topic}`,
          headline_suffix: "숨은 함정 총정리",
          image_path: "../assets/cover_sample.jpg",
          image_caption: "지금 당장 확인해야 할 필수 체크포인트",
          swipe_text: "밀어서 피해 예방하기"
        },
        {
          slide_number: 2,
          total_slides: 4,
          type: "body_list",
          step_badge: "CRITICAL 01",
          title: "많은 분들이 착각하는 치명적 오류 3가지",
          points: [
            {
              number: "01",
              heading: "기존 규정만 믿고 방심하는 경우",
              desc: `${details.point1 || '바뀐 최신 기준을 확인하지 않아 청약 자격이 박탈되거나 대출이 거절될 수 있습니다.'}`
            },
            {
              number: "02",
              heading: "서류 및 소득 요건 산정 기준 오류",
              desc: `${details.point2 || '맞벌이 및 부채 산정 시 새로운 스트레스 금리가 적용되어 한도가 축소됩니다.'}`
            },
            {
              number: "03",
              heading: "신청 일정 및 유예 기간 마감",
              desc: `${details.point3 || '이번 달 내로 신청하지 않으면 강화된 규제를 그대로 적용받게 됩니다.'}`
            }
          ]
        },
        {
          slide_number: 3,
          total_slides: 4,
          type: "body_visual",
          step_badge: "SOLUTION 02",
          title: "전문가가 권장하는 안전 대처 솔루션",
          image_path: "../assets/doc_sample.jpg",
          points: [
            {
              number: "KEY",
              heading: "사전 모의계산 및 특약 문구 필수 기재",
              desc: "계약서 작성 전 대출 사전 심사를 완료하고, 대출 불가 시 계약금 반환 특약을 반드시 명시하세요."
            }
          ]
        },
        {
          slide_number: 4,
          total_slides: 4,
          type: "cta",
          summary_title: "오늘의 핵심 안전 수칙 3가지",
          summary_items: [
            "달라진 최신 산정 기준 반드시 사전 점검",
            "대출 한도 감소분 미리 계산하여 자금 계획 수립",
            "계약서 작성 시 계약금 보호 안전 특약 명시"
          ],
          action_title: "손해보지 않는 부동산 재테크",
          action_desc: "매일 아침 가장 빠르고 정확한 팩트를 전해드립니다.",
          icons: ["게시물 저장하기", "가족/지인에게 공유"]
        }
      ]
    })
  },

  listicle: {
    name: "요약/리스트형 (소장가치)",
    description: "바쁜 현대인을 위한 핵심 3줄 요약 ➔ 저장 및 스크랩 극대화",
    build: (topic, details) => ({
      formula: "listicle",
      tagline: "📋 핵심 요약 · 3분 브리핑",
      headline_prefix: "이번 주 공식 발표!",
      headline_highlight: `${topic}`,
      headline_suffix: "딱 3가지만 기억하세요",
      slides: [
        {
          slide_number: 1,
          total_slides: 4,
          type: "cover",
          tagline: "📋 핵심 요약 · 3분 브리핑",
          headline_prefix: "이번 주 공식 발표!",
          headline_highlight: `${topic}`,
          headline_suffix: "핵심 총정리",
          image_path: "../assets/cover_sample.jpg",
          image_caption: "시간 아껴주는 3분 완벽 가이드",
          swipe_text: "밀어서 3분 요약 보기"
        },
        {
          slide_number: 2,
          total_slides: 4,
          type: "body_list",
          step_badge: "SUMMARY 01",
          title: `${topic} 주요 변동 사항`,
          points: [
            {
              number: "01",
              heading: "적용 대상 및 자격 기준 확대",
              desc: `${details.point1 || '실수요자 중심의 진입 문턱이 낮아져 기회가 대폭 증가했습니다.'}`
            },
            {
              number: "02",
              heading: "지원 혜택 및 인정 한도 상향",
              desc: `${details.point2 || '월 인정 금액 및 금리 우대 폭이 기존 대비 크게 유리해졌습니다.'}`
            },
            {
              number: "03",
              heading: "시행 일정 및 신청 프로세스 간소화",
              desc: `${details.point3 || '온라인 간편 접수가 도입되어 서류 제출 절차가 대폭 줄어들었습니다.'}`
            }
          ]
        },
        {
          slide_number: 3,
          total_slides: 4,
          type: "body_visual",
          step_badge: "ACTION 02",
          title: "실전 적용: 오늘 당장 해야 할 행동",
          image_path: "../assets/doc_sample.jpg",
          points: [
            {
              number: "TIP",
              heading: "공식 플랫폼에서 본인 자격 사전 조회",
              desc: "청약홈 또는 은행 앱에서 완화된 자격 조건을 미리 등록해 두면 오픈 즉시 접수 가능합니다."
            }
          ]
        },
        {
          slide_number: 4,
          total_slides: 4,
          type: "cta",
          summary_title: "오늘의 핵심 포인트 3줄 요약",
          summary_items: [
            "자격 요건 완화로 수혜 대상 대폭 확대",
            "인정 한도 증가로 조기 준비자에게 유리",
            "사전 자격 확인 후 즉시 접수 준비 필수"
          ],
          action_title: "놓치면 아쉬운 알짜 재테크 정보",
          action_desc: "유익하셨다면 팔로우하고 매일 새로운 소식을 받아보세요!",
          icons: ["나중에 보려고 저장", "친구 태그하기"]
        }
      ]
    })
  }
};

/**
 * 7대 떡상 관점 + 사용자 인터랙티브 피드백 기반 고급 카드뉴스 대본 생성기
 */
async function generateAdvancedCardScript({
  topic,
  angleId = 'angle_warning',
  slideCount = 4,
  userFeedback = '',
  customHook = '',
  coreContext = {}
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  // 슬라이드 수는 기본 4장이되, 사용자가 지정하거나 원본 항목 수에 따라 최대 10장까지 가변 지원
  const count = Math.min(10, Math.max(4, parseInt(slideCount) || 4));

  const ANGLE_META = {
    angle_warning: { name: "반전/폭로/경고형 (손실 회피)", tag: "🚨 긴급 점검 · 손실 방지" },
    angle_cheat: { name: "치트키/체크리스트형 (소장 가치)", tag: "📋 핵심 치트키 · 소장 가치" },
    angle_easy: { name: "초등학생 눈높이 3분 쉬운 요약형 (대중성)", tag: "💡 3분 컷 · 쉬운 해설" },
    angle_vs: { name: "극단적 VS 비교형 (댓글 토론)", tag: "⚖️ 데이터 검증 · 극단 비교" },
    angle_story: { name: "성공/실패 실화 스토리텔링형 (공감/몰입)", tag: "📈 실화 로드맵 · 실전 사례" },
    angle_target: { name: "초개인화 타겟팅형 (클릭률 극대화)", tag: "🎯 타겟 맞춤 · 필수 혜택" },
    angle_calc: { name: "1분 계산기/수치 공식형 (스크랩 유도)", tag: "🔢 1분 계산기 · 수치 공식" }
  };

  const selectedMeta = ANGLE_META[angleId] || ANGLE_META.angle_warning;

  if (apiKey && apiKey.trim() && !apiKey.includes('your_openai_api_key')) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: apiKey.trim() });

      console.log(`[AI 대본 생성] 주제: '${topic}' | 관점: '${selectedMeta.name}' | 슬라이드 수: ${count}장`);

      const systemPrompt = `
당신은 인스타그램에서 수십만 팔로워를 보유한 최정상급 카드뉴스 수석 에디터입니다.
주어진 주제, 원본 맥락(캡션, 음성 STT, 이미지 OCR 텍스트), 선택된 떡상 관점을 기반으로 총 ${count}장의 핀터레스트풍(1080x1350) 카드뉴스 대본을 JSON으로 작성해주세요.

[🚨 정보 누락 제로 & 전수 수록 절대 원칙]
- 원본 맥락에 구체적인 리스트 항목(예: '24가지 필수 확장팩', '10대 체크리스트', '8개 플러그인/8개 스킬/8개 MCP' 등)이 있는 경우:
  1. 절대로 '대표 3개'만 뽑고 나머지를 생략하지 마십시오.
  2. 원본에 명시된 모든 고유 명칭과 역할을 본문 슬라이드(Slide 2 ~ ${count - 1})들에 분류별로 나누어 100% 온전히 전수 수록하십시오.
  3. 한 슬라이드당 3~4개씩 상세히 배치하거나, 슬라이드 내 리스트(points)에 빠짐없이 나열하여 원본의 가치를 100% 보존하십시오.

[슬라이드 구조 규칙]
- 슬라이드 1 (type: "cover"): 스크롤을 멈추게 하는 강력한 후킹 표지. tagline, headline_prefix, headline_highlight, headline_suffix, image_caption, swipe_text 작성.
- 슬라이드 2 ~ ${count - 1} (type: "body_list" 또는 "body_visual"): 각 장마다 명확한 step_badge(예: "PART 01", "PLUGINS 02", "SKILLS 03", "MCP 04"), 제목(title), 그리고 핵심 포인트 목록(points: [{ number, heading, desc }]). 문장은 모바일에서 읽기 편하게 가독성 높게 작성.
- 마지막 슬라이드 ${count} (type: "cta"): summary_title, summary_items (핵심 요약 3줄), action_title, action_desc, icons (예: ["게시물 저장하고 두고두고 보기", "필요한 동료에게 공유하기"]).

다음 JSON 형식으로만 엄격하게 응답해주세요:
{
  "category": "트렌드 · 심층 분석",
  "tagline": "${selectedMeta.tag}",
  "slides": [
    {
      "slide_number": 1,
      "total_slides": ${count},
      "type": "cover",
      "tagline": "${selectedMeta.tag}",
      "headline_prefix": "앞부분 문구",
      "headline_highlight": "${topic}",
      "headline_suffix": "뒷부분 문구",
      "image_caption": "표지 보조 설명 1줄",
      "swipe_text": "밀어서 전체 리스트 확인"
    },
    ... (중간 본문 슬라이드들: body_list 또는 body_visual) ...
    {
      "slide_number": ${count},
      "total_slides": ${count},
      "type": "cta",
      "summary_title": "오늘의 핵심 포인트 3줄 요약",
      "summary_items": ["요약 1", "요약 2", "요약 3"],
      "action_title": "더 많은 꿀팁이 궁금하다면?",
      "action_desc": "저장하고 매일 새로운 인사이트를 받아보세요!",
      "icons": ["저장하기", "공유하기"]
    }
  ]
}
`;

      const userPrompt = `
[주제]: ${topic}
[선택된 떡상 관점]: ${selectedMeta.name}
[추천/지정 후킹 문구]: ${customHook || '(AI가 최적화)'}
[사용자 피드백 / 추가 지시사항]: ${userFeedback || '(기본 최고 퀄리티로 작성)'}
[참고 원본 텍스트 및 STT 음성]:
- 캡션: ${coreContext.caption || ''}
- 음성/STT: ${coreContext.audioText || ''}
- 이미지분석: ${coreContext.imageText || ''}
`.trim();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      if (parsed && parsed.slides && parsed.slides.length > 0) {
        return {
          project_title: `${topic} 카드뉴스`,
          category: parsed.category || "부동산 핫이슈 · 분석",
          date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
          author: {
            name: "@realestate_insights",
            avatar_letter: "R"
          },
          ...parsed
        };
      }
    } catch (err) {
      console.error(`[AI 대본 생성 실패, Fallback 전환]`, err.message);
    }
  }

  // Fallback 템플릿 생성기
  const slides = [];
  slides.push({
    slide_number: 1,
    total_slides: count,
    type: "cover",
    tagline: selectedMeta.tag,
    headline_prefix: "모르면 손해보는",
    headline_highlight: `${topic}`,
    headline_suffix: "핵심 팩트 체크",
    image_path: "../assets/cover_sample.jpg",
    image_caption: customHook || "지금 당장 확인해야 할 필수 체크포인트",
    swipe_text: "밀어서 3분 확인"
  });

  for (let i = 2; i < count; i++) {
    const isVisual = i % 2 === 1;
    if (isVisual) {
      slides.push({
        slide_number: i,
        total_slides: count,
        type: "body_visual",
        step_badge: `CHECK 0${i - 1}`,
        title: `${topic} 핵심 체크포인트 0${i - 1}`,
        image_path: "../assets/doc_sample.jpg",
        points: [
          {
            number: `0${i - 1}`,
            heading: `${topic} 실전 적용 가이드`,
            desc: userFeedback ? `사용자 요청 반영: ${userFeedback}` : "최신 정책 및 시장 데이터에 맞추어 사전에 철저한 준비가 필요합니다."
          }
        ]
      });
    } else {
      slides.push({
        slide_number: i,
        total_slides: count,
        type: "body_list",
        step_badge: `POINT 0${i - 1}`,
        title: `${topic} 주요 변동 사항 및 주의점`,
        points: [
          {
            number: "A",
            heading: "반드시 확인해야 할 필수 요건",
            desc: "새롭게 개편된 기준과 일정을 체크하지 않으면 기회를 놓칠 수 있습니다."
          },
          {
            number: "B",
            heading: "실전 대처 및 리스크 방지책",
            desc: "자금 계획을 보수적으로 수립하고 사전에 모의 계산을 완료하세요."
          }
        ]
      });
    }
  }

  slides.push({
    slide_number: count,
    total_slides: count,
    type: "cta",
    summary_title: "오늘의 핵심 포인트 3줄 요약",
    summary_items: [
      `${topic} 관련 최신 변동 사항 확인`,
      "본인 조건에 맞는 자격 및 혜택 사전 점검",
      "안전한 자금 조달 계획 및 특약 기재 필수"
    ],
    action_title: "놓치면 아쉬운 실전 부동산 정보",
    action_desc: "유익하셨다면 게시물을 저장하고 지인에게 공유해보세요!",
    icons: ["나중에 보려고 저장", "친구 태그하기"]
  });

  return {
    project_title: `${topic} 카드뉴스`,
    category: "부동산 핫이슈 · 분석",
    date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
    author: {
      name: "@realestate_insights",
      avatar_letter: "R"
    },
    formula: angleId,
    tagline: selectedMeta.tag,
    slides
  };
}

/**
 * 하위 호환성을 위한 기본 대본 생성기
 */
function generateCardNewsScript(topic, summary, formulaType = 'warning', customDetails = {}) {
  const formula = VIRAL_FORMULAS[formulaType] || VIRAL_FORMULAS.warning;
  const built = formula.build(topic, {
    point1: summary,
    ...customDetails
  });

  return {
    project_title: `${topic} 카드뉴스`,
    category: "부동산 핫이슈 · 분석",
    date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
    author: {
      name: "@realestate_insights",
      avatar_letter: "R"
    },
    ...built
  };
}

/**
 * 레퍼런스 릴스 URL 역분석기
 */
function analyzeReelsUrl(reelsUrl) {
  return {
    targetUrl: reelsUrl,
    extractedHook: "의문형 + 손실회피 ('아직도 ~하고 계신가요?')",
    pacing: "4장 구성 (표지 ➔ 문제 3가지 ➔ 해결책 1가지 ➔ 저장 유도 CTA)",
    recommendedFormula: "angle_warning",
    advice: "표지에서 질문을 던지고 2번째 장에서 구체적 수치(금액/퍼센트)를 제시하는 호흡이 좋습니다."
  };
}

module.exports = {
  VIRAL_FORMULAS,
  generateCardNewsScript,
  generateAdvancedCardScript,
  analyzeReelsUrl
};

