# 🍅 Cool Tomato - Pomodoro Timer

**[한국어](#-멋쟁이-토마토-pomodoro-timer) | English**

A Pomodoro Timer & Task Manager app to help you stay focused and achieve your goals!

## ✨ Features

### ⏱️ Pomodoro Timer
- 25 min focus → 5 min short break → 20 min long break after 4 rounds
- Visual circular progress bar
- Start/Pause/Skip timer controls
- Customizable focus/break durations
- Auto-start options

### ✅ Task Management
- Add/Delete/Complete tasks
- Priority levels (High/Medium/Low)
- Estimated pomodoros per task
- Auto-count completed pomodoros
- Filter by Active/Completed

### 📊 Stats & Reports
- Today's pomodoro count
- Total focus time
- Tasks completed
- Weekly statistics chart

### ⚙️ Settings
- Customizable timer durations
- Notification settings
- Sound settings
- 3 themes (Light/Dark/Tomato)
- Multi-language support (Korean/English)

## 🌍 Language Support
- Korean users: Automatically displays in Korean
- Other regions: Automatically displays in English
- Can be changed in Settings
- Preferences saved to localStorage

## 🚀 How to Use the Pomodoro Technique

1. **Select a task**: Choose a task to focus on
2. **Focus for 25 min**: Start the timer and work without interruptions
3. **Take a 5 min break**: Rest when the timer ends
4. **Repeat**: Continue steps 2-3
5. **Long break**: Take a 20 min break after 4 pomodoros

## 💻 Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
```

## 🔧 Chrome Extension Installation

1. Run `npm run build`
2. Go to `chrome://extensions` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

## 🔒 Privacy Policy

[View Privacy Policy](https://patiencendiligence.github.io/cool-tomato-pomodoro/PRIVACY_POLICY.html)

## ☕ Support

If you enjoy this app, consider supporting me on [Ko-fi](https://ko-fi.com/patiencendiligence)! ☕

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/patiencendiligence)

---

# 🍅 멋쟁이 토마토 (Pomodoro Timer)

**한국어 | [English](#-cool-tomato---pomodoro-timer)**

목표달성을 위해 집중하는 멋쟁이 토마토! 포모도로 타이머와 업무 관리 기능을 합친 앱입니다.

## ✨ 주요 기능

### ⏱️ 포모도로 타이머
- 25분 집중 → 5분 짧은 휴식 → 4회 후 20분 긴 휴식
- 시각적 원형 프로그레스바
- 타이머 시작/일시정지/건너뛰기
- 집중/휴식 시간 커스터마이징
- 자동 시작 옵션

### ✅ 업무 관리
- 업무 추가/삭제/완료
- 우선순위 설정 (높음/보통/낮음)
- 예상 포모도로 수 설정
- 완료된 포모도로 자동 카운트
- 진행중/완료 필터

### 📊 통계 & 리포트
- 오늘의 포모도로 수
- 총 집중 시간
- 완료한 업무 수
- 주간 통계 차트

### ⚙️ 설정
- 타이머 시간 커스터마이징 (집중/짧은휴식/긴휴식)
- 알림 설정
- 소리 설정
- 3가지 테마 (라이트/다크/토마토)
- 다국어 지원 (한국어/영어)

## 🌍 다국어 지원
- 한국 접속자: 자동으로 한글 표시
- 그 외 지역: 자동으로 영어 표시
- 설정에서 언어 변경 가능
- localStorage에 설정 저장

## 🚀 포모도로 기법 사용법

1. **업무 선택**: 집중할 업무를 선택하세요
2. **25분 집중**: 타이머를 시작하고 방해받지 않고 집중하세요
3. **5분 휴식**: 타이머가 끝나면 짧은 휴식을 취하세요
4. **반복**: 2-3단계를 반복하세요
5. **긴 휴식**: 4번의 포모도로 후 20분 긴 휴식을 취하세요

## 💻 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 🔧 Chrome 확장프로그램 설치

1. `npm run build` 실행
2. Chrome에서 `chrome://extensions` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist` 폴더 선택

## 🔒 개인정보처리방침

[개인정보처리방침 보기](https://patiencendiligence.github.io/cool-tomato-pomodoro/PRIVACY_POLICY.html)

## ☕ 후원하기

이 앱이 마음에 드셨다면, [Ko-fi](https://ko-fi.com/patiencendiligence)에서 저를 후원해 주세요! ☕

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/patiencendiligence)

---

## 📁 Project Structure / 프로젝트 구조

```
src/
├── components/     # UI Components
│   ├── Timer.tsx       # Pomodoro Timer
│   ├── TaskList.tsx    # Task List
│   ├── Stats.tsx       # Statistics
│   ├── Settings.tsx    # Settings
│   └── Navigation.tsx  # Bottom Navigation
├── hooks/          # Custom Hooks
│   ├── useTimer.ts     # Timer Logic
│   ├── useTasks.ts     # Task Management
│   ├── useStats.ts     # Statistics
│   ├── useTheme.ts     # Theme Management
│   └── useLanguage.ts  # i18n Support
├── types/          # TypeScript Types
└── App.tsx         # Main App
```

## 🛠️ Tech Stack / 기술 스택

- React 19
- TypeScript
- Vite
- Chrome Extension Manifest V3

## 📄 License / 라이선스

MIT License
