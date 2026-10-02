# 🎨 Pinterest-Style Card News Design System (DESIGN.md)

> **목적:** 인스타그램 4:5(1080x1350) 포맷에 최적화된 최고급 핀터레스트 스타일 카드뉴스 디자인 시스템 명세서.  
> **핵심 철학:** 압도적인 가독성(Pretendard), 슬라이드 맥락 기반 고품질 AI 이미지, 5대 템플릿 아키텍처, 무손실 순수 SVG 컴포넌트.

---

## 1. 캔버스 규격 (Canvas Specification)

- **해상도:** `1080px` × `1350px` (4:5 Ratio - 인스타그램 캐러셀 무손실 규격)
- **안전 여백 (Safe Area Padding):**
  - `Top: 100px`, `Bottom: 110px`, `Left: 80px`, `Right: 80px`
  - 인스타그램 UI(상단 계정바, 하단 북마크/좋아요 버튼)에 가려지지 않는 안전 영역 확보.
- **화면 배율 (Rendering):** `deviceScaleFactor: 2` (2160x2700 레티나급 무손실 렌더링)

---

## 2. 타이포그래피 시스템 (Typography Hierarchy)

한국어 가독성과 고급스러운 인스타그램 감성을 위해 **프리텐다드(Pretendard)**를 단독 메인 폰트로 채택합니다.

```html
<!-- CDN Import -->
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
```

### 폰트 설정 원칙
- **Font Family:** `'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- **단단한 자간 (Letter-spacing):** `-0.03em` (한글 특유의 헐거운 여백을 없애고 텍스트 응집도 극대화)
- **자연스러운 행간 (Line-height):**
  - 메인 헤드라인: `1.28 ~ 1.35`
  - 서브 카피 / 리스트 제목: `1.38 ~ 1.45`
  - 본문 설명 텍스트: `1.50 ~ 1.60`
- **단어 끊김 방지:** `word-break: keep-all; word-wrap: break-word;`

### 텍스트 계층 구조 (Typography Scale - 1.5x Enhanced)

| 분류 | 폰트 크기 | 굵기 (Weight) | 용도 및 위치 |
| :--- | :--- | :--- | :--- |
| **Hero Title** | `80px ~ 90px` (표준: `86px`) | `Black (900)` / `ExtraBold (800)` | 1장 표지 킬러 헤드라인 (1.5x 시선 집중) |
| **Headline Highlight** | `84px ~ 94px` (표준: `88px`) | `Black (900)` + Accent Color | 헤드라인 내 핵심 강조 단어 |
| **Slide Title** | `76px ~ 86px` (표준: `82px`) | `Black (900)` / `ExtraBold (800)` | 2~N장 본문 슬라이드 상단 제목 (1.2x 추가 확대) |
| **CTA Title** | `70px ~ 80px` (표준: `76px`) | `Black (900)` | 마지막 장 핵심 요약 및 행동 유도 타이틀 |
| **Big Number** | `110px ~ 140px` | `Black (900)` | 빅 넘버 / 수치 통계 강조 |
| **Point Title** | `28px ~ 32px` | `Bold (700)` | 본문 리스트 항목 소제목 |
| **Point Body** | `20px ~ 24px` | `Medium (500)` / `Regular (400)` | 본문 부연 설명 및 근거 팩트 |
| **Tagline / Badge** | `18px ~ 20px` | `Bold (700)` | 상단 카테고리 태그, 단계 뱃지 |
| **Meta / Footer** | `16px ~ 18px` | `SemiBold (600)` | 날짜, 페이지 번호, 계정 핸들 |

---

## 3. 컬러 시스템 (Color Palette)

### A. Dark Premium Theme (기본 테마 - 모던 흑백 & 오렌지/시안 포인트)
- **Canvas Background:** `#0F1115` (Deep Charcoal Obsidian)
- **Card / Surface Background:** `rgba(26, 30, 38, 0.75)` (Glassmorphism Surface)
- **Card Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Primary Text:** `#FFFFFF` (Pure Bright White)
- **Secondary Text:** `#A1A7B5` (Cool Slate Grey)
- **Accent Orange:** `#FF5A36` (Terracotta Fire - 시선 집중용)
- **Accent Blue / Cyan:** `#38BDF8` (Bright Tech Blue - 신뢰/데이터용)
- **Accent Green:** `#10B981` (Emerald Green - 팁/해결책용)

### B. Light Clean Theme (핀터레스트 웜 샌드 테마)
- **Canvas Background:** `#F8F7F4` (Warm Sand Linen)
- **Card / Surface Background:** `#FFFFFF` (Clean White)
- **Card Border:** `1px solid #E6E3DC`
- **Primary Text:** `#181A1F` (Dark Neutral)
- **Secondary Text:** `#616672` (Muted Graphite)
- **Accent Color:** `#D9532F` (Warm Brick Red)

---

## 4. 슬라이드별 맞춤 이미지 생성 전략 (Antigravity Image Pipeline)

카드뉴스의 모든 슬라이드는 텍스트와 1:1로 결합된 고유의 시각 이미지를 포함합니다. Antigravity의 자체 이미지 생성 역량을 활용하여 슬라이드의 맥락과 감정에 맞는 이미지를 자동 생성합니다.

### 이미지 생성 & 매칭 규칙
1. **표지 (Cover Slide):**
   - **프롬프트 전략:** 주제의 핵심 욕망/불안을 대변하는 웅장하고 미니멀한 메인 비주얼.
   - **예시:** `"A cinematic, modern architectural Korean luxury apartment building at twilight, moody dramatic lighting, 8k, minimal aesthetic"`
2. **문제 제기 & 리스크 (Problem / Risk):**
   - **프롬프트 전략:** 긴장감 있는 포커스 샷, 계약서, 계산기, 고민하는 실루엣.
   - **예시:** `"A person reviewing a real estate contract with a calculator, soft moody indoor lighting, shallow depth of field"`
3. **데이터 & 팩트 비교 (Comparison / Fact):**
   - **프롬프트 전략:** 도시 전경의 대비, 3D 차트 또는 대조되는 건축물.
   - **예시:** `"Split comparison visual between two modern cityscapes, minimalist architectural photography"`
4. **해결책 & 치트키 (Solution / Checklist):**
   - **프롬프트 전략:** 밝고 정돈된 모던 데스크, 체크리스트, 성공적인 분위기.
   - **예시:** `"A clean modern minimalist workspace with notebook, pen, and coffee, warm morning sunlight"`
5. **엔딩 & CTA (Summary / Action):**
   - **프롬프트 전략:** 스마트폰 화면의 북마크/공유, 감성적인 공간 샷.

---

## 5. 슬라이드 분할 및 가변 확장 아키텍처 (Dynamic Multi-Slide Paging)

카드뉴스는 **기본 4장을 기준**으로 하되, 원본 콘텐츠에 포함된 항목 수(24개 확장팩, 10대 체크리스트 등)에 따라 **슬라이드 수를 5~10장까지 동적으로 자동 확장**하여 **정보 누락 제로(Zero Information Loss)**를 실현합니다.

### 📄 장수 결정 공식 & 레이아웃 매핑
1. **단일 이슈 / 3대 포인트 요약 (기본 4장):**
   - `Slide 1`: 표지 (Layout 1)
   - `Slide 2`: 핵심 문제 3가지 (Layout 2)
   - `Slide 3`: 해결책 / 팩트 (Layout 2 or 3)
   - `Slide 4`: 3줄 요약 & 저장 CTA (Layout 5)

2. **다중 리스트 / 8~24개 항목 (6~8장 확장):**
   - **원칙:** 원본에 소개된 모든 항목(24가지면 24가지 전체)의 고유 명칭과 역할을 100% 수록합니다.
   - **배치 밀도:** 슬라이드 1장당 3~4개씩 상세 카드로 넣거나, 2열 컴팩트 그리드로 6~8개씩 분류별 전수 배치합니다.
   - **예시 (24개 도구 소개 시 총 6~7장 구성):**
     - `Slide 1`: 표지 (24개 필수 확장팩 총정리 후킹)
     - `Slide 2`: 3대 개념 구조도 (플러그인 vs 스킬 vs MCP)
     - `Slide 3`: **8대 플러그인 전수 목록** (1번~8번)
     - `Slide 4`: **8대 스킬 전수 목록** (9번~16번)
     - `Slide 5`: **8대 MCP 서버 전수 목록** (17번~24번)
     - `Slide 6`: 한눈에 보는 3줄 핵심 요약 & 소장 유도 북마크 CTA

---

## 6. 5대 레이아웃 템플릿 명세 (Layout Archetypes)

### 📌 Layout Type 1: [핀터레스트 매거진 표지형 (Cover)]
- **구성:** 상단 브랜드 메타 ➔ 3줄 볼드 킬러 타이포그래피 ➔ 중앙 하단 와이드 AI 비주얼 카드 ➔ 스와이프 유도 바
- **특징:** 인스타 피드 스크롤을 단번에 멈추게 하는 강력한 시각적 무게감.

### 📌 Layout Type 2: [3~4단 넘버링 카드형 (Body List)]
- **구성:** 섹션 라벨 ➔ 슬라이드 메인 타이틀 ➔ 3~4개 글래스모피즘 넘버링 카드 + 하단 미니 비주얼 썸네일
- **특징:** 넘버링 뱃지(`01`, `02`, `03` 또는 이모지)와 함께 핵심 소제목과 설명을 명확히 구분.

### 📌 Layout Type 3: [A vs B 2열 비교형 (Comparison Split)]
- **구성:** 슬라이드 타이틀 ➔ 좌우 2열 글래스 카드 (레드 vs 블루 하이라이트 테두리) ➔ 하단 결론
- **특징:** 기존 방식 vs 혁신 방식, 장점 vs 단점 등의 직관적 대비.

### 📌 Layout Type 4: [빅 넘버 & 데이터 강조형 (Metric Focus)]
- **구성:** 슬라이드 타이틀 ➔ 120px 거대 수치(`35%`, `200만원` 등) ➔ SVG 비교 바 차트 ➔ 팩트 설명
- **특징:** 수치 팩트와 통계를 시각적으로 압도적으로 전달.

### 📌 Layout Type 5: [1줄 요약 & 북마크 유도형 (CTA Ending)]
- **구성:** 3줄 체크리스트 요약 박스 ➔ 오렌지 점선 테두리 북마크 액션 카드 ➔ 계정 브랜딩 푸터
- **특징:** 인스타그램 알고리즘에서 가장 중요한 **[저장(Bookmark)]**과 **[공유]** 전환율 극대화.

---

## 7. 내장 컴포넌트 규격 (Embedded UI Components)

외부 무거운 라이브러리를 배제하고, 1080x1350 해상도에서 100% 무손실 렌더링을 보장하는 순수 SVG & CSS 컴포넌트를 사용합니다.

### 1. 아이콘 & 뱃지 (Lucide SVG Style)
- **스와이프 화살표:** `<svg class="swipe-icon">`
- **북마크 / 저장 아이콘:** `<svg class="save-icon">`
- **경고 / 팁 아이콘:** `<svg class="alert-icon">`

### 2. 글래스모피즘 카드 박스 (Glassmorphism Card)
```css
.point-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
```

### 3. 비교 프로그레스 바 & 미니 차트 (Pure SVG / CSS)
- 퍼센트 게이지 바, 비교 막대 그래프를 순수 CSS `width`와 그라디언트로 구현하여 렌더링 딜레이 0초 달성.

---

## 7. 렌더링 무결성 체크리스트 (Quality Checklist)
- [x] 모든 슬라이드에서 Pretendard 폰트가 정상 로드되었는가?
- [x] 텍스트가 캔버스 안전 여백(상하좌우 Safe Area)을 벗어나지 않는가?
- [x] 이미지는 슬라이드의 맥락과 완벽하게 일치하는가?
- [x] 1080x1350 해상도에서 글자가 깨짐 없이 선명한가 (`deviceScaleFactor: 2`)?
- [x] 마지막 슬라이드에 명확한 CTA(저장/공유 유도)가 배치되었는가?
