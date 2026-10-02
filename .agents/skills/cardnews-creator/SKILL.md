---
name: cardnews-creator
description: Automatically generates high-quality 1080x1350 Pinterest-style Instagram card news images from report.md using Antigravity image generation and Pretendard design system. Supports dynamic slide expansion (4 to 10 slides) with zero information loss.
---

# 🎨 CardNews Creator Skill (`cardnews-creator`)

이 스킬은 `outputs/YYMMDD_HHMM/report.md` (또는 인풋으로 전달된 리포트 파일)을 파싱하여, [DESIGN.md](file:///Users/gwn/antigravity/15_card_new_1/DESIGN.md) 규격에 맞는 **인스타그램 1080x1350 초고화질 무손실 카드뉴스 세트**를 원스톱으로 제작하는 스킬입니다.

---

## 🚨 핵심 원칙: 정보 누락 제로 & 가변 슬라이드 확장 (Zero Loss & Dynamic Expansion)

1. **기본 4장 + 정보량에 따른 무제한 가변 확장 (4~10장):**
   - **기본 장수 (4장):** 단순 요약, 단일 이슈, 단일 리스크형 콘텐츠는 **4장** (Cover ➔ Problem ➔ Solution ➔ CTA)을 기본으로 합니다.
   - **가변 확장 (5~10장):** 원본 데이터에 리스트 항목(예: *24가지 확장팩*, *10대 체크리스트*, *8대 수혜 단지* 등)이 다수 포함되어 있을 경우, **정보를 임의로 3개로 축약하거나 생략하는 것을 절대 금지**합니다. 원본의 모든 항목이 100% 온전히 수록되도록 슬라이드를 5장~10장까지 동적으로 늘립니다.
2. **슬라이드 수 산정 공식 (Dynamic Paging Formula):**
   - $\text{본문 슬라이드 수} = \lceil \frac{\text{총 항목 수}}{3 \sim 4} \rceil$
   - $\text{총 슬라이드 수} = 1(\text{표지}) + \text{개념/서론}(0 \sim 1) + \text{본문 슬라이드 수} + 1(\text{최종 요약 및 CTA})$
3. **24가지 확장팩 콘텐츠 예시 (총 6~7장 전수 수록):**
   - `Slide 1`: 표지 (24개 필수 도구 총정리 킬러 헤드라인)
   - `Slide 2`: 핵심 분류 개념 (플러그인 vs 스킬 vs MCP 차이점 요약)
   - `Slide 3`: **8대 필수 플러그인 전수 수록** (1번~8번 이름 + 핵심 역할)
   - `Slide 4`: **8대 필수 스킬 전수 수록** (9번~16번 이름 + 핵심 역할)
   - `Slide 5`: **8대 필수 MCP 서버 전수 수록** (17번~24번 이름 + 핵심 역할)
   - `Slide 6`: 한눈에 보는 3줄 핵심 요약 & 소장 유도 북마크 CTA

---

## 🛠️ 카드뉴스 제작 파이프라인 (5단계)

### [Step 1] `report.md` 분석 & 슬라이드 데이터 추출
1. 지정된 `report.md`를 읽어 다음 정보를 구조화합니다:
   - **카테고리 / 주제:** 메타 정보 및 2번 원본 추출 데이터 분석
   - **총 슬라이드 장수 결정:** 원본 데이터의 항목 수에 맞춰 최적 장수(4~10장) 결정
   - **슬라이드별 대본 (총 N장):**
     - 각 슬라이드의 `slide_number`, `total_slides`, `type` (cover / body_list / body_visual / cta)
     - `headline` / `title` / `points` (소제목 및 설명) / `cta_summary`

---

### [Step 2] 슬라이드별 맞춤 이미지 생성 (Antigravity AI)
[DESIGN.md](file:///Users/gwn/antigravity/15_card_new_1/DESIGN.md) 가이드라인에 따라 각 슬라이드 내용과 1:1 결합되는 고유 프롬프트를 작성하고, `generate_image` 도구를 호출하여 생성합니다.

- **규격:** `AspectRatio: '4:3'` 또는 `'1:1'`
- **저장 위치:** 해당 리포트 폴더 내 `assets/slide_01.png`, `assets/slide_02.png`, ...
- **프롬프트 규칙:**
  - **1장 표지:** 주제의 핵심 욕망/불안을 대변하는 웅장하고 감각적인 건축/인물/도심/워크스페이스 메인 샷
  - **본문 목록/분류:** 주제에 맞는 세련된 데스크탑 셋업, 문서, 다이어그램, 모던 테크 비주얼
  - **해결책/치트키:** 밝은 햇살이 드는 모던 워크스페이스, 정돈된 체크리스트, 생산성 툴 대시보드
  - **엔딩 CTA:** 스마트폰 북마크/공유 감성 샷

---

### [Step 3] 5대 레이아웃 템플릿 매칭 & HTML 렌더링
각 슬라이드의 역할에 맞춰 [DESIGN.md](file:///Users/gwn/antigravity/15_card_new_1/DESIGN.md)의 5대 레이아웃을 매칭하며, **1.5배 강화된 타이포그래피 스케일**을 적용합니다:

- **타이포그래피 표준 (Enhanced Scale):**
  - **표지 메인 헤드라인 (Hero Title):** `86px` (`font-weight: 900`, `line-height: 1.18`, 자간 `-0.04em`)
  - **본문 슬라이드 제목 (Slide Title):** `82px` (`font-weight: 900`, `line-height: 1.18`, 자간 `-0.04em`)
  - **엔딩 요약/CTA 제목 (CTA Title):** `76px` (`font-weight: 900`, `line-height: 1.2`)
  - **리스트 소제목 (Point Title):** `26px ~ 32px` (`font-weight: 800`)

1. **Cover Slide:** `Layout 1 (핀터레스트 매거진 커버형)` ➔ 86px 볼드 타이포 + 570px 와이드 이미지 카드 + 스와이프 유도
2. **Body List Slide:** `Layout 2 (3~4단 넘버링 카드형)` ➔ 82px 제목 + 넘버링 글래스모피즘 박스 + 미니 비주얼
3. **Comparison Slide:** `Layout 3 (A vs B 2열 스플릿형)` ➔ 82px 제목 + 대조형 레이아웃
4. **Metric Slide:** `Layout 4 (빅 넘버 & 데이터 강조형)` ➔ 82px 제목 + 120px 거대 수치 + SVG 비교 바
5. **CTA Slide:** `Layout 5 (1줄 요약 & 북마크형)` ➔ 76px 요약 제목 + 체크리스트 박스 + 북마크 유도 뱃지

---

### [Step 4] 무손실 레티나 1080x1350 이미지 캡처 (Playwright)
- **뷰포트:** `1080px` × `1350px`, `deviceScaleFactor: 2`
- **폰트:** `Pretendard (Black, ExtraBold, Bold, Medium)` 로드 대기
- **저장 경로:** `outputs/YYMMDD_HHMM/cards/slide_01.png` ~ `slide_0N.png`

---

### [Step 5] 최종 결과 안내 & 갤러리 뷰 제공
- 완성된 카드뉴스 파일들의 경로를 사용자에게 마크다운 링크 및 이미지 임베드로 제공합니다.
- 총 장수, 적용된 관점, 저장 폴더를 요약 보고합니다.

