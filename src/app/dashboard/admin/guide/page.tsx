"use client";

import { useState } from "react";
import { 
  BookOpen, 
  PlayCircle, 
  HelpCircle, 
  CheckCircle2, 
  Car, 
  Users, 
  Calendar as CalendarIcon, 
  Printer, 
  QrCode,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function GuidePage() {
  const sections = [
    {
      title: "기본 시작하기",
      icon: PlayCircle,
      steps: [
        "기관 회원가입 후 5자리 기관 코드를 받으세요.",
        "학부모에게 기관 코드를 공유하여 자녀 등록을 안내합니다.",
        "학생 관리 탭에서 등록된 아이들의 정보를 확인하고 수정할 수 있습니다."
      ]
    },
    {
      title: "등하교(픽업) 관리 시스템",
      icon: Car,
      steps: [
        "학부모가 앱에서 '픽업 요청'을 하면 '등하교 관리' 탭에 실시간으로 나타납니다.",
        "아이를 보호자에게 인계한 후 '아이 인계하기' 버튼을 누르세요.",
        "학년/반별로 필터링하여 복잡한 하교 시간을 효율적으로 관리할 수 있습니다."
      ]
    },
    {
      title: "이벤트 및 일정 관리",
      icon: CalendarIcon,
      steps: [
        "이벤트 탭에서 새로운 학교 행사나 일정을 등록하세요.",
        "구글 캘린더와 연동하여 실시간으로 일정을 동기화할 수 있습니다.",
        "일정 등록 시 학부모 앱에 즉시 공지사항으로 노출됩니다."
      ]
    },
    {
      title: "라벨 및 프린터 설정",
      icon: Printer,
      steps: [
        "기관 설정 -> 프린터 설정에서 사용할 라벨 형식을 선택하세요.",
        "아이 이름, 반, 보호자 번호 등 라벨에 포함될 항목을 지정할 수 있습니다.",
        "블루투스 또는 Wi-Fi 연결을 통해 호환되는 라벨 프린터로 즉시 출력하세요."
      ]
    }
  ];

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-black mb-3 flex items-center gap-3">
           Children Gate 사용 가이드
           <HelpCircle className="text-primary" size={32} />
        </h1>
        <p className="text-black/50 font-bold text-lg">칠드런 게이트의 모든 기능을 완벽하게 활용하는 방법입니다.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.section 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[40px] border border-black/5 shadow-sm p-10 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <section.icon size={28} />
              </div>
              <h2 className="text-2xl font-black text-black">{section.title}</h2>
            </div>
            
            <ul className="space-y-6">
              {section.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-black/70 font-bold leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>

      <section className="mt-12 bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-black mb-4">도움이 더 필요하신가요?</h2>
            <p className="text-white/60 font-bold">Children Gate 고객 지원팀이 24시간 대기하고 있습니다.</p>
          </div>
          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform">
             1:1 실시간 문의하기 <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </main>
  );
}
