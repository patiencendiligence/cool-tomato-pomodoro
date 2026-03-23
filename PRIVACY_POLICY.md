# 개인정보처리방침 (Privacy Policy)

**멋쟁이 토마토 - Pomodoro Timer** (이하 "확장 프로그램")

최종 수정일: 2026년 3월 23일

---

## 1. 개요

본 개인정보처리방침은 "멋쟁이 토마토 - Pomodoro Timer" Chrome 확장 프로그램이 수집하는 정보와 그 사용 방법에 대해 설명합니다.

저희는 사용자의 개인정보 보호를 매우 중요하게 생각하며, 최소한의 데이터만을 수집하고 이를 안전하게 관리합니다.

---

## 2. 수집하는 정보

### 2.1 자동으로 수집되는 정보

본 확장 프로그램은 **개인 식별 정보를 수집하지 않습니다**.

### 2.2 로컬에 저장되는 정보

다음 정보는 사용자의 브라우저에 **로컬로만** 저장되며, 외부 서버로 전송되지 않습니다:

- **타이머 설정**: 집중 시간, 휴식 시간, 긴 휴식 간격 등
- **업무 목록**: 사용자가 추가한 업무/태스크 정보
- **통계 데이터**: 완료한 포모도로 수, 집중 시간 등
- **앱 설정**: 테마, 언어, 알림 설정 등
- **위젯 위치**: 화면에서의 위젯 위치 좌표

---

## 3. 정보의 사용

저장된 모든 정보는 다음 목적으로만 사용됩니다:

- 사용자 경험 개선 (설정 및 진행 상황 유지)
- 통계 및 리포트 제공
- 앱 기능 정상 작동

---

## 4. 정보 공유

본 확장 프로그램은:

- ❌ 개인정보를 **제3자에게 판매하지 않습니다**
- ❌ 개인정보를 **외부 서버로 전송하지 않습니다**
- ❌ **분석 도구나 광고 네트워크를 사용하지 않습니다**
- ❌ **사용자 행동을 추적하지 않습니다**

---

## 5. 데이터 저장 및 보안

- 모든 데이터는 Chrome의 `chrome.storage.local` API를 통해 **사용자의 기기에만** 저장됩니다
- 데이터는 브라우저를 통해 암호화되어 저장됩니다
- 확장 프로그램을 제거하면 모든 데이터가 삭제됩니다

---

## 6. 사용자 권리

사용자는 언제든지:

- 브라우저 설정에서 확장 프로그램 데이터를 삭제할 수 있습니다
- 확장 프로그램을 제거하여 모든 데이터를 삭제할 수 있습니다
- 앱 내 설정에서 개별 데이터를 관리할 수 있습니다

---

## 7. 권한 설명

본 확장 프로그램이 요청하는 권한과 그 목적:

| 권한 | 목적 |
|------|------|
| `storage` | 타이머 설정, 업무 목록, 통계 데이터를 로컬에 저장 |
| `notifications` | 타이머 완료 시 알림 표시 |
| `alarms` | 백그라운드에서 타이머 관리 |
| `호스트 권한 (<all_urls>)` | 모든 웹페이지에서 플로팅 위젯 표시 |

---

## 7.1 호스트 권한 사용 근거 (Justification for Host Permissions)

### 왜 호스트 권한이 필요한가요?

본 확장 프로그램은 **플로팅 위젯** 형태로 동작하며, 사용자가 어떤 웹사이트를 방문하든 타이머를 사용할 수 있어야 합니다.

### 호스트 권한의 실제 사용 목적

| 기능 | 설명 |
|------|------|
| **플로팅 위젯 표시** | 모든 웹페이지 위에 포모도로 타이머 위젯을 오버레이로 표시 |
| **어디서든 사용 가능** | 사용자가 작업 중인 모든 사이트에서 타이머 접근 가능 |

### 호스트 권한이 하지 않는 것

- ❌ 웹페이지의 **콘텐츠를 읽지 않습니다**
- ❌ 사용자의 **브라우징 기록을 추적하지 않습니다**
- ❌ 페이지의 **데이터를 수집하거나 전송하지 않습니다**
- ❌ 웹페이지를 **수정하거나 변경하지 않습니다** (위젯 UI 오버레이 제외)

### 기술적 구현

```
content_scripts: {
  "matches": ["<all_urls>"],
  "js": ["content.js"],
  "css": ["content.css"]
}
```

이 설정은 단순히 타이머 위젯 UI를 페이지 위에 표시하기 위한 것이며, 페이지 내용과는 완전히 독립적으로 동작합니다.

---

## 7.2 Storage 권한 사용 근거 (Justification for Storage Permission)

### 왜 Storage 권한이 필요한가요?

본 확장 프로그램은 포모도로 타이머 기능을 제공하기 위해 `chrome.storage.local` API를 사용합니다. 이 권한은 다음과 같은 **핵심 기능**을 위해 반드시 필요합니다:

### 저장되는 데이터 상세 목록

| 데이터 | 목적 | 필요성 |
|--------|------|--------|
| **타이머 설정** | 집중 시간(기본 25분), 짧은 휴식(5분), 긴 휴식(20분), 긴 휴식 간격 설정 저장 | 사용자가 매번 설정을 다시 입력하지 않아도 되도록 함 |
| **업무/태스크 목록** | 사용자가 추가한 업무 제목, 예상 포모도로 수, 우선순위, 완료 상태 | 업무 관리 기능의 핵심. 브라우저를 닫아도 업무 목록 유지 |
| **완료된 포모도로 수** | 오늘/주간 완료한 포모도로 통계 | 생산성 추적 및 통계 리포트 제공 |
| **테마 설정** | 라이트/다크/토마토 테마 선택 | 사용자 UI 선호도 유지 |
| **언어 설정** | 한국어/영어 선택 | 다국어 지원을 위한 언어 선호도 저장 |
| **위젯 위치** | 화면에서 위젯의 X, Y 좌표 | 사용자가 배치한 위젯 위치를 기억하여 편의성 제공 |
| **알림 설정** | 알림 활성화 여부, 자동 시작 옵션 | 사용자 알림 선호도 유지 |

### Storage 권한 없이는 불가능한 이유

1. **세션 간 데이터 유지**: Storage 권한 없이는 브라우저를 닫으면 모든 설정과 업무 목록이 사라집니다.
2. **탭 간 데이터 동기화**: 여러 탭에서 동일한 타이머 상태를 유지하려면 storage가 필요합니다.
3. **사용자 경험**: 매번 처음부터 설정을 입력해야 한다면 앱의 실용성이 크게 저하됩니다.

### 데이터 보안

- ✅ 모든 데이터는 **사용자의 로컬 기기에만** 저장됩니다
- ✅ **외부 서버로 전송되지 않습니다**
- ✅ **제3자와 공유되지 않습니다**
- ✅ 확장 프로그램 삭제 시 **모든 데이터가 완전히 삭제**됩니다
- ✅ 다른 확장 프로그램이나 웹사이트에서 **접근할 수 없습니다**

### 대안 검토

| 대안 | 불가능한 이유 |
|------|---------------|
| localStorage | Content Script에서 웹페이지의 localStorage를 사용하면 사이트별로 데이터가 분리되어 일관된 경험 제공 불가 |
| 쿠키 | 용량 제한(4KB), 보안 문제, 사이트별 분리 문제 |
| 서버 저장 | 불필요한 개인정보 수집이 되며, 네트워크 의존성 발생 |

**결론**: `chrome.storage.local`은 사용자 개인정보를 외부로 전송하지 않으면서 핵심 기능을 제공하기 위한 **가장 안전하고 적절한 방법**입니다.

---

## 8. 아동 개인정보 보호

본 확장 프로그램은 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.

---

## 9. 개인정보처리방침 변경

본 방침이 변경될 경우, 확장 프로그램 업데이트를 통해 안내됩니다. 중요한 변경 사항은 사용자에게 별도로 공지됩니다.

---

## 10. 문의

개인정보처리방침에 관한 문의사항이 있으시면 아래로 연락해 주세요:

- **GitHub**: [https://github.com/patiencendiligence/cool-tomato-pomodoro](https://github.com/patiencendiligence/cool-tomato-pomodoro)
- **이슈 제기**: GitHub Issues를 통해 문의

---

## 11. 동의

본 확장 프로그램을 설치하고 사용함으로써, 사용자는 본 개인정보처리방침에 동의하는 것으로 간주됩니다.

---

# Privacy Policy (English)

**Cool Tomato - Pomodoro Timer** Chrome Extension

Last Updated: March 23, 2026

---

## 1. Overview

This Privacy Policy explains what information the "Cool Tomato - Pomodoro Timer" Chrome extension collects and how it is used.

We take user privacy very seriously and collect only minimal data necessary for the app to function.

---

## 2. Information We Collect

### 2.1 Automatically Collected Information

This extension **does NOT collect any personally identifiable information**.

### 2.2 Locally Stored Information

The following information is stored **locally only** in your browser and is never transmitted to external servers:

- **Timer Settings**: Focus time, break time, long break intervals
- **Task List**: Tasks added by the user
- **Statistics**: Completed pomodoros, focus time
- **App Settings**: Theme, language, notification preferences
- **Widget Position**: Widget coordinates on screen

---

## 3. Use of Information

All stored information is used solely for:

- Improving user experience (maintaining settings and progress)
- Providing statistics and reports
- Ensuring proper app functionality

---

## 4. Information Sharing

This extension:

- ❌ Does **NOT sell** personal information to third parties
- ❌ Does **NOT transmit** data to external servers
- ❌ Does **NOT use** analytics tools or advertising networks
- ❌ Does **NOT track** user behavior

---

## 5. Data Storage and Security

- All data is stored **only on your device** using Chrome's `chrome.storage.local` API
- Data is encrypted by the browser
- Uninstalling the extension deletes all data

---

## 6. User Rights

Users can at any time:

- Delete extension data through browser settings
- Uninstall the extension to remove all data
- Manage individual data within app settings

---

## 7. Permissions Explained

| Permission | Purpose |
|------------|---------|
| `storage` | Store timer settings, task list, and statistics locally |
| `notifications` | Display notifications when timer completes |
| `alarms` | Manage timer in background |
| `Host Permissions (<all_urls>)` | Display floating widget on all webpages |

---

## 7.1 Justification for Host Permissions

### Why are Host Permissions Required?

This extension operates as a **floating widget** that needs to be accessible on any website the user visits.

### Actual Use of Host Permissions

| Feature | Description |
|---------|-------------|
| **Floating Widget Display** | Show Pomodoro timer widget as an overlay on all webpages |
| **Universal Access** | Timer accessible on any site where the user is working |

### What Host Permissions Do NOT Do

- ❌ Does **NOT read** webpage content
- ❌ Does **NOT track** browsing history
- ❌ Does **NOT collect or transmit** page data
- ❌ Does **NOT modify** webpages (except for widget UI overlay)

### Technical Implementation

```
content_scripts: {
  "matches": ["<all_urls>"],
  "js": ["content.js"],
  "css": ["content.css"]
}
```

This configuration is solely for displaying the timer widget UI on top of pages and operates completely independently of page content.

---

## 7.2 Justification for Storage Permission

### Why is the Storage Permission Required?

This extension uses the `chrome.storage.local` API to provide Pomodoro timer functionality. This permission is **essential** for the following core features:

### Detailed List of Stored Data

| Data | Purpose | Necessity |
|------|---------|-----------|
| **Timer Settings** | Focus time (default 25min), short break (5min), long break (20min), interval settings | Users don't need to re-enter settings each time |
| **Task List** | Task titles, estimated pomodoros, priority, completion status | Core task management feature. Persists across browser sessions |
| **Completed Pomodoros** | Daily/weekly pomodoro statistics | Productivity tracking and reports |
| **Theme Settings** | Light/Dark/Tomato theme selection | Maintain user UI preferences |
| **Language Settings** | Korean/English selection | Store language preference for multilingual support |
| **Widget Position** | X, Y coordinates of widget on screen | Remember user's preferred widget placement |
| **Notification Settings** | Notification enabled, auto-start options | Maintain user notification preferences |

### Why It's Impossible Without Storage Permission

1. **Cross-session Data Persistence**: Without storage, all settings and tasks are lost when the browser closes.
2. **Cross-tab Data Sync**: Storage is needed to maintain consistent timer state across multiple tabs.
3. **User Experience**: Having to re-enter settings each time would severely impact app usability.

### Data Security

- ✅ All data is stored **only on the user's local device**
- ✅ **Never transmitted** to external servers
- ✅ **Never shared** with third parties
- ✅ **Completely deleted** when the extension is uninstalled
- ✅ **Cannot be accessed** by other extensions or websites

### Alternatives Considered

| Alternative | Why Not Viable |
|-------------|----------------|
| localStorage | In Content Scripts, using webpage localStorage would separate data per site, preventing consistent experience |
| Cookies | Size limits (4KB), security concerns, per-site isolation |
| Server Storage | Would require unnecessary personal data collection and network dependency |

**Conclusion**: `chrome.storage.local` is the **safest and most appropriate method** to provide core functionality without transmitting user data externally.

---

## 8. Children's Privacy

This extension does not knowingly collect personal information from children under 13 years of age.

---

## 9. Changes to Privacy Policy

If this policy changes, users will be notified through extension updates. Significant changes will be communicated separately.

---

## 10. Contact

For questions about this Privacy Policy:

- **GitHub**: [https://github.com/patiencendiligence/cool-tomato-pomodoro](https://github.com/patiencendiligence/cool-tomato-pomodoro)
- **Issues**: Submit via GitHub Issues

---

## 11. Consent

By installing and using this extension, you agree to this Privacy Policy.
