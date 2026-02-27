export const translations = {
  ko: {
    common: {
      start: "무료로 시작하기",
      demo: "데모 신청하기",
      login: "로그인",
      parentLogin: "학부모",
      signup: "시작하기",
      footer: "© 2026 Children Gate. 모든 권리 보유.",
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      contact: "문의하기",
      representative: "대표자: 심재성",
      email: "onchurchtx@gmail.com",
      copyright: "Copyright © 2026 Children Gate. All Rights Reserved."
    },
    legal: {
      privacy: {
        title: "개인정보 처리방침",
        items: "[개인정보 수집 및 이용 고지]\n* 수집 항목: 학생 성명, 소속 학급, 보호자 성명 및 연락처, 등하교 시간 기록.\n* 수집 목적: 실시간 등하교 알림 서비스 제공 및 안전 사고 예방.\n* 보유 기간: 서비스 이용 종료 시 혹은 기관 요청 시 즉시 파기.\n* 기술적 보호: 모든 데이터는 Google Firebase 인프라를 통해 암호화되어 관리됩니다.",
        protection: "기술적 보호: 모든 데이터는 Google Firebase 인프라를 통해 암호화되어 관리됩니다."
      },
      terms: {
        title: "이용약관",
        responsibility: "[책임 제한 고지]\n* 본 서비스는 하교 요청을 전달하는 보조 도구이며, 실제 학생의 인도 및 안전 확인의 최종 책임은 학교(기관) 및 보호자에게 있습니다.\n* 시스템 오류, 네트워크 장애로 인한 통지 지연에 대해 'Children Gate'는 직접적인 법적 책임을 지지 않으나, 신속한 복구를 위해 최선을 다합니다.",
        copyright: "[저작권 고지]\n* © 2026. Children Gate. All rights reserved.\n* 본 사이트에 게재된 소프트웨어 로직, QR 생성 시스템 및 로고 디자인은 저작권법의 보호를 받으며, 무단 복제 및 전재를 금합니다."
      }
    },
    nav: {
      features: "주요 기능",
      howItWorks: "작동 원리",
      pricing: "요금제"
    },
    pricing: {
      title: "합리적인 요금제",
      subtitle: "기관 규모에 맞는 최적의 플랜을 선택하세요.",
      monthly: "/월",
      btnStart: "무료로 시작하기",
      btnSelect: "선택하기",
      basic: {
        name: "Basic 플랜",
        desc: "소규모 학원/교회를 위한 실속형 출결 관리",
        price: "$9.99",
        features: ["학생 최대 50명 등록", "학부모 모바일 포털 (PWA)", "QR 출결 (수동 데스크 모드)", "구글 시트 실시간 연동"]
      },
      pro: {
        name: "Pro 플랜 (Best)",
        desc: "유치원/중대형 교회를 위한 가장 완벽한 픽업 시스템",
        price: "$19.99",
        features: ["학생 무제한 무한 등록", "스마트 다중 자녀 픽업 지원", "비대면 차량 번호 연동 시스템", "학부모 - 선생님 실시간 알림장", "최우선 고객 지원 (Priority Support)"]
      }
    },
    hero: {
      badge: "Safe & Smart Attendance System",
      title1: "학부모가 안심하고",
      title2: "아이를 맡기는",
      subtitle: "QR 스캔 한 번으로 시작되는 스마트한 출결 관리. 구글 시트 연동과 실시간 푸시 알림으로 완벽한 안전을 제공합니다."
    },
    features: {
      title: "혁신적인 20가지 기능",
      subtitle: "교회, 어린이집, 학교를 위한 가장 완벽한 솔루션",
      item1: { title: "동적 QR 시스템", desc: "각 기관별 고유 QR 코드를 자동 생성하고 관리합니다." },
      item2: { title: "구글 시트 연동", desc: "복잡한 DB 대신 익숙한 구글 시트로 실시간 관리하세요." },
      item3: { title: "실시간 푸시 알림", desc: "학부모 도착 시 선생님께 즉시 알림이 전송됩니다." },
      item4: { title: "차량 픽업 모드", desc: "차 안에서 스캔하면 모니터에 아이 이름이 자동 나열됩니다." },
      item5: { title: "스티커 자동 출력", desc: "스캔과 동시에 아이의 정보가 담긴 라벨이 출력됩니다." },
      item6: { title: "2단계 보안 승인", desc: "선생님의 최종 승인이 있어야 하교 처리가 완료됩니다." },
      item7: { title: "PWA 웹앱", desc: "설치 없이 앱처럼 편리하게 사용하는 웹앱을 제공합니다." },
      item8: { title: "다중 역할 관리", desc: "관리자, 선생님, 학부모별 맞춤형 화면을 제공합니다." },
      item9: { title: "방문자 로그 관리", desc: "외부 방문객의 출입 기록까지 완벽하게 관리하세요." }
    },
    howItWorks: {
      title: "스마트한 작동 원리",
      subtitle: "3단계로 끝나는 가장 완벽하고 쉬운 출결 시스템",
      step1: {
        title: "1. 등하교 요청 (스마트폰/QR)",
        desc: "학부모가 스마트폰으로 앱에 접속하여 버튼 하나로 아이의 하교를 요청하거나 QR 카드를 스캔합니다."
      },
      step2: {
        title: "2. 실시간 안전 데이터 동기화",
        desc: "요청된 정보가 즉시 클라우드와 기관의 구글 시트에 안전하게 암호화되어 전송 및 영구 기록됩니다."
      },
      step3: {
        title: "3. 선생님 확인 및 푸시 알림",
        desc: "담당 선생님의 교실 대시보드 화면에 즉각 알림이 울리며, 선생님의 인계 확인 시 최종 처리됩니다."
      }
    },
    trust: {
      title: "글로벌 기술력으로 아이들의 안전을 지킵니다.",
      item1: { title: "Firebase 기반 실시간 동기화", desc: "지연 없는 실시간 알림과 데이터 업데이트를 보장합니다." },
      item2: { title: "Google Sheets API 통합", desc: "데이터 소유권은 여러분에게. 엑셀처럼 쉬운 데이터 관리." },
      item3: { title: "강력한 PWA 기술", desc: "아이폰, 안드로이드 구분 없이 모든 기기에서 최적화된 경험." }
    },
    cta: {
      title: "지금 바로 가장 안전한 문을 열어보세요.",
      subtitle: "2주간의 무료 체험을 통해 Children Gate의 혁신을 경험해보세요. 추가 장비 없이 지금 바로 시작할 수 있습니다."
    },
    auth: {
      tabInstitution: "기관용",
      tabParent: "학부모용",
      signupTitle: "Children Gate 시작하기",
      signupSubtitle: "계정을 안전하게 생성하고 서비스를 시작하세요.",
      loginTitle: "환영합니다!",
      loginSubtitle: "Children Gate에 오신 것을 환영합니다.",
      name: "이름",
      parentName: "이름 (학부모 계정)",
      institution: "기관명",
      instType: "기관 유형 (선택)",
      studentCount: "학생 규모",
      address: "기관 주소",
      instCode: "기관 코드 (가입 안내문 참조)",
      childName: "자녀 이름",
      childClass: "반 이름",
      relationship: "자녀와의 관계 (예: 부, 모)",
      childrenCount: "자녀 수",
      contact: "휴대폰 번호",

      email: "이메일 주소",
      password: "비밀번호",
      rememberMe: "자동 로그인 (스마트폰 기억하기)",
      createAccount: "회원 가입하기",
      creating: "처리 중...",
      loggingIn: "로그인 중...",
      hasAccount: "이미 계정이 있으신가요?",
      noAccount: "계정이 없으신가요?",
      errorSignup: "가입 중 오류가 발생했습니다.",
      errorLogin: "이메일 또는 비밀번호가 올바르지 않습니다.",
      googleLogin: "Google 계정으로 계속하기",
      forgotPassword: "비밀번호를 잊으셨나요?",
      resetPasswordTitle: "비밀번호 재설정",
      resetPasswordSubtitle: "이메일 주소를 입력하시면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.",
      sendResetLink: "재설정 링크 보내기",
      resetLinkSent: "이메일이 전송되었습니다. 편지함을 확인해 주세요.",
      backToLogin: "로그인으로 돌아가기",
      errorReset: "이메일을 보내는 중 오류가 발생했습니다."
    },
    dashboard: {
      admin: {
        title: "학생 관리",
        subtitle: "실시간 데이터(Firestore) 기반 • 보고용 구글 시트 동기화 중",
        totalStudents: "총 학생 수",
        todayCheckin: "오늘 등교",
        todayCheckout: "오늘 하교",
        searchPlaceholder: "학생 이름 또는 반 검색...",
        openSheet: "구글 시트에서 직접 열기",
        downloadExcel: "엑셀 다운로드",
        addStudent: "학생 추가",
        table: {
          name: "아이 이름",
          class: "소속 반",
          parent: "보호자",
          contact: "연락처",
          action: "작업"
        },
        sidebar: {
          students: "학생 관리",
          dispatch: "등하교 관리",
          events: "이벤트 및 통계",
          qr: "QR 코드 관리",
          sheets: "구글 시트 연동",
          settings: "기관 설정"
        },
        widgets: {
          recentActivity: "최근 활동",
          upcomingBirthdays: "다가오는 생일",
          attendanceTrends: "출결 현황",
          quickActions: "빠른 메뉴",
          workflow: "오늘의 진행 상태",
          noActivity: "최근 활동이 없습니다.",
          noBirthdays: "이번 주에 생일인 아이가 없습니다.",
          viewAll: "전체 보기"
        }
      },
      teacher: {
        title: "선생님 대시보드",
        subtitle: "현재 하교 대기 중인 학생 현황입니다.",
        realtimeRequests: "실시간 요청",
        noRequests: "현재 대기 중인 요청이 없습니다.",
        approve: "하교 승인",
        sticker: "스티커 출력",
        guardian: "보호자"
      },
      parent: {
        title: "하교 요청",
        subtitle: "아이를 안전하게 맞이할 준비를 시작합니다.",
        studentName: "아이 이름",
        className: "소속 반",
        parentName: "신청자 성함",
        requestButton: "하교 요청하기",
        requesting: "전송 중...",
        completeTitle: "요청 완료!",
        completeSubtitle: "선생님께 요청이 전달되었습니다. 잠시만 기다려주세요.",
        safetyShield: "안전한 하교를 위해 선생님이 확인 중입니다."
      },
      qr: {
        title: "기관용 전용 QR 코드",
        subtitle: "현관이나 입구에 부착하여 학부모님이 스캔할 수 있게 합니다.",
        download: "포스터 다운로드",
        copy: "링크 복사",
        copied: "링크가 복사되었습니다!",
        instId: "기관 ID",
        studentQrTitle: "학생 개인별 QR 발급",
        studentQrSubtitle: "학생증에 부착할 수 있는 개인 QR 코드를 생성합니다.",
        generateIndividual: "개별 QR 생성 모드",
        printAll: "일괄 출력"
      },
      sheets: {
        title: "구글 시트 연동",
        subtitle: "저장된 데이터를 구글 시트와 실시간으로 동기화합니다.",
        connected: "연동 완료",
        notConnected: "연동되지 않음",
        syncData: "전체 데이터 동기화",
        pullData: "시트에서 불러오기",
        lastSync: "마지막 동기화",
        openSheet: "시트 열기",
        sheetIdPlaceholder: "구글 시트 ID를 입력하세요",
        saveConfig: "설정 저장"
      },
      settings: {
        title: "기관 설정",
        subtitle: "칠드런 게이트 시스템의 전반적인 환경을 설정합니다.",
        general: "기본 정보",
        institutionName: "기관 이름",
        contactEmail: "대표 이메일",
        phone: "연락처",
        notifications: "알림 설정",
        pushAlerts: "앱 푸시 알림",
        smsAlerts: "SMS 알림 (크레딧 필요)",
        security: "보안",
        twoFactor: "선생님용 2단계 인증",
        save: "변경사항 저장",
        saved: "저장되었습니다."
      },
      studentProfile: {
        backToList: "목록으로 돌아가기",
        editProfile: "정보 수정",
        attendanceHistory: "출결 활동 내역",
        recentActivity: "최근 30일 활동",
        date: "날짜",
        checkIn: "등교 시간",
        checkOut: "하교 시간",
        status: "상태",
        checkedInBy: "등교 확인",
        checkedOutBy: "하교 처리",
        present: "출석",
        absent: "결석",
        noHistory: "출결 기록이 없습니다.",
        medicalNotes: "의료/알러지 유의사항"
      }
    }
  },
  en: {
    common: {
      start: "Start for Free",
      demo: "Request Demo",
      login: "Login",
      parentLogin: "Parent",
      signup: "Get Started",
      footer: "© 2026 Children Gate. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      representative: "Representative: Jaesung Sim",
      email: "onchurchtx@gmail.com",
      copyright: "Copyright © 2026 Children Gate. All Rights Reserved."
    },
    legal: {
      privacy: {
        title: "Privacy Policy",
        items: "[Notice of Collection and Use of Personal Information]\n* Collected Items: Student name, class affiliation, parent name and contact information, attendance time records.\n* Collection Purpose: Providing real-time attendance notification services and preventing safety accidents.\n* Retention Period: Immediate destruction upon termination of service or request from the institution.\n* Technical Protection: All data is encrypted and managed through Google Firebase infrastructure.",
        protection: "Technical Protection: All data is encrypted and managed through Google Firebase infrastructure."
      },
      terms: {
        title: "Terms of Service",
        responsibility: "[Notice of Limitation of Liability]\n* This service is an auxiliary tool for transmitting dismissal requests, and the final responsibility for the actual delivery and safety verification of students lies with the school (institution) and guardians.\n* 'Children Gate' is not directly legally responsible for notification delays due to system errors or network failures, but will do its best for swift recovery.",
        copyright: "[Copyright Notice]\n* © 2026. Children Gate. All rights reserved.\n* The software logic, QR generation system, and logo design published on this site are protected by copyright law, and unauthorized reproduction or redistribution is prohibited."
      }
    },
    nav: {
      features: "Features",
      howItWorks: "How it Works",
      pricing: "Pricing"
    },
    pricing: {
      title: "Simple Pricing",
      subtitle: "Choose the best plan for your institution.",
      monthly: "/mo",
      btnStart: "Start for Free",
      btnSelect: "Select Plan",
      basic: {
        name: "Basic Plan",
        desc: "For small academies and churches. Fast and reliable.",
        price: "$9.99",
        features: ["Up to 50 students", "Parent Web App (PWA)", "QR Attendance", "Google Sheets Sync"]
      },
      pro: {
        name: "Pro Plan (Best)",
        desc: "For kindergartens and mid-large churches. Full system.",
        price: "$19.99",
        features: ["Unlimited students", "Smart multi-child pickup", "Contactless car plate system", "Parent-Teacher messages", "Priority Support"]
      }
    },
    hero: {
      badge: "Safe & Smart Attendance System",
      title1: "Trust the Safety of",
      title2: "Your Children with",
      subtitle: "Smart attendance management starting with a single QR scan. Perfect safety with Google Sheets integration and real-time push notifications."
    },
    features: {
      title: "20 Innovative Features",
      subtitle: "The most complete solution for churches, kindergartens, and schools",
      item1: { title: "Dynamic QR System", desc: "Automatically generate and manage unique QR codes for each institution." },
      item2: { title: "Google Sheets Sync", desc: "Manage in real-time with familiar Google Sheets instead of a complex database." },
      item3: { title: "Real-time Push", desc: "Instantly notify teachers when parents arrive." },
      item4: { title: "Vehicle Pickup Mode", desc: "Scanning from a car automatically lists children's names on the monitor." },
      item5: { title: "Auto Label Printing", desc: "Prints labels with child information simultaneously with the scan." },
      item6: { title: "Two-Step Security", desc: "Pickup is only completed after final approval from the teacher." },
      item7: { title: "PWA Web App", desc: "Provides a convenient mobile experience like an app without installation." },
      item8: { title: "Multi-Role Management", desc: "Tailored screens for admins, teachers, and parents." },
      item9: { title: "Visitor Log Management", desc: "Complete management of visitor entry and exit records." }
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "The easiest 3-step smart attendance system",
      step1: {
        title: "1. Request Drop-off/Pick-up",
        desc: "Parents use their smartphone app to request pickup with a single button or scan a QR card."
      },
      step2: {
        title: "2. Real-time Secure Sync",
        desc: "Requested data is instantly encrypted and permanently recorded in the cloud and Google Sheets."
      },
      step3: {
        title: "3. Teacher Approval & Alerts",
        desc: "The teacher's dashboard receives a real-time alert, and pickup is completed upon teacher confirmation."
      }
    },
    trust: {
      title: "Global technology protecting our children's safety.",
      item1: { title: "Firebase Real-time Sync", desc: "Guarantees zero-lag real-time notifications and updates." },
      item2: { title: "Google Sheets Integration", desc: "Own your data. Easy management just like Excel." },
      item3: { title: "Powerful PWA Technology", desc: "Optimized experience across all devices including iOS and Android." }
    },
    cta: {
      title: "Open the safest door right now.",
      subtitle: "Experience innovation with Children Gate through a 2-week free trial. Start now without extra equipment."
    },
    auth: {
      tabInstitution: "Institution",
      tabParent: "Parent",
      signupTitle: "Start Children Gate",
      signupSubtitle: "Create a secure account to get started.",
      loginTitle: "Welcome Back!",
      loginSubtitle: "Sign in to your Children Gate account.",
      name: "Full Name",
      parentName: "Your Full Name",
      institution: "Institution Name",
      instType: "Institution Type",
      studentCount: "Student Capacity",
      address: "Address",
      instCode: "Institution Code",
      childName: "Child's Name",
      childClass: "Class Name",
      relationship: "Relationship (e.g. Father, Mother)",
      childrenCount: "Number of Children",
      contact: "Phone Number",

      email: "Email Address",
      password: "Password",
      rememberMe: "Remember me (Auto-login)",
      createAccount: "Sign Up",
      creating: "Processing...",
      loggingIn: "Logging in...",
      hasAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      errorSignup: "An error occurred during signup.",
      errorLogin: "Incorrect email or password.",
      googleLogin: "Continue with Google",
      forgotPassword: "Forgot password?",
      resetPasswordTitle: "Reset Password",
      resetPasswordSubtitle: "Enter your email address to receive a password reset link.",
      sendResetLink: "Send Reset Link",
      resetLinkSent: "Reset email sent. Please check your inbox.",
      backToLogin: "Back to Login",
      errorReset: "Error sending password reset email."
    },
    dashboard: {
      admin: {
        title: "Student Management",
        subtitle: "Real-time data (Firestore) • Syncing with Google Sheets",
        totalStudents: "Total Students",
        todayCheckin: "Check-ins Today",
        todayCheckout: "Pickups Today",
        searchPlaceholder: "Search student or class...",
        openSheet: "Open Google Sheet",
        downloadExcel: "Download Excel",
        addStudent: "Add Student",
        table: {
          name: "Name",
          class: "Class",
          parent: "Guardian",
          contact: "Contact",
          action: "Action"
        },
        sidebar: {
          students: "Students",
          dispatch: "Dispatch",
          events: "Events & Stats",
          qr: "QR Management",
          sheets: "Google Sheets",
          settings: "Settings"
        },
        widgets: {
          recentActivity: "Recent Activity",
          upcomingBirthdays: "Upcoming Birthdays",
          attendanceTrends: "Attendance Trends",
          quickActions: "Quick Actions",
          workflow: "Daily Workflow",
          noActivity: "No recent activity.",
          noBirthdays: "No birthdays this week.",
          viewAll: "View All"
        }
      },
      teacher: {
        title: "Teacher Dashboard",
        subtitle: "Current pickup request status.",
        realtimeRequests: "Live Requests",
        noRequests: "No pending requests.",
        approve: "Approve Pickup",
        sticker: "Print Sticker",
        guardian: "Guardian"
      },
      parent: {
        title: "Pickup Request",
        subtitle: "Preparing to safely pick up your child.",
        studentName: "Child's Name",
        className: "Class",
        parentName: "Guardian Name",
        requestButton: "Request Pickup",
        requesting: "Sending...",
        completeTitle: "Request Sent!",
        completeSubtitle: "Your request has been sent to the teacher. Please wait.",
        safetyShield: "The teacher is verifying for a safe pickup."
      },
      qr: {
        title: "Institution QR Code",
        subtitle: "Place it at the entrance for parents to scan.",
        download: "Download Poster",
        copy: "Copy Link",
        copied: "Link copied!",
        instId: "Institution ID",
        studentQrTitle: "Individual Student QR",
        studentQrSubtitle: "Generate personal QR codes to attach to student IDs.",
        generateIndividual: "Generate Individual QR",
        printAll: "Print All"
      },
      sheets: {
        title: "Google Sheets Sync",
        subtitle: "Sync saved data with Google Sheets in real-time.",
        connected: "Connected",
        notConnected: "Not Connected",
        syncData: "Sync All Data",
        pullData: "Pull from Sheet",
        lastSync: "Last Sync",
        openSheet: "Open Sheet",
        sheetIdPlaceholder: "Enter Google Sheet ID",
        saveConfig: "Save Config"
      },
      settings: {
        title: "Institution Settings",
        subtitle: "Configure the overall environment of the Children Gate system.",
        general: "General Info",
        institutionName: "Institution Name",
        contactEmail: "Contact Email",
        phone: "Phone Number",
        notifications: "Notifications",
        pushAlerts: "App Push Alerts",
        smsAlerts: "SMS Alerts (Credits Required)",
        security: "Security",
        twoFactor: "Two-Factor Auth for Teachers",
        save: "Save Changes",
        saved: "Saved successfully."
      },
      studentProfile: {
        backToList: "Back to List",
        editProfile: "Edit Profile",
        attendanceHistory: "Attendance History",
        recentActivity: "Recent 30-Day Activity",
        date: "Date",
        checkIn: "Check-in Time",
        checkOut: "Check-out Time",
        status: "Status",
        checkedInBy: "Checked in by",
        checkedOutBy: "Checked out by",
        present: "Present",
        absent: "Absent",
        noHistory: "No activity records found.",
        medicalNotes: "Medical / Allergy Notes"
      }
    }
  }
};

export type Language = "ko" | "en";
export type TranslationKeys = typeof translations.ko;
