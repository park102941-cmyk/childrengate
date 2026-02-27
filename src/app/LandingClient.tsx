"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  Car,
  CheckCircle2,
  FileText,
  Printer,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UserPlus,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
              {t.hero.badge}
            </span>
            <h1 className="hero-text text-black drop-shadow-sm text-balance">
              {t.hero.title1} <br className="hidden md:block" />
              {t.hero.title2} <span className="text-primary">Children Gate</span>
            </h1>
            <p className="sub-text text-black/70">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto text-center px-8 py-4 apple-button-primary shadow-xl shadow-primary/30 flex items-center justify-center gap-2 text-lg">
                <ShieldCheck size={20} />
                {t.common.login}
              </Link>
              <Link href="/signup" className="w-full sm:w-auto text-center px-8 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 text-lg">
                <Smartphone size={20} />
                {t.common.signup}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 relative max-w-5xl mx-auto rounded-[48px] overflow-hidden shadow-2xl border border-black/5"
          >
            <Image 
              src="/hero-image.png" 
              alt="Children Gate Hero" 
              width={1200} 
              height={800} 
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section-padding bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mt-20 -mr-20"></div>
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t.howItWorks?.title || "스마트한 작동 원리"}</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.howItWorks?.subtitle || "3단계로 끝나는 가장 완벽하고 쉬운 출결 시스템"}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 px-6">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
             <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 relative z-10 border border-white/20 shadow-2xl backdrop-blur-md">
                <Smartphone size={40} className="text-primary" />
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center font-black text-white">1</div>
             </div>
             <h3 className="text-2xl font-bold mb-4">{t.howItWorks?.step1?.title || "1. 등하교 요청"}</h3>
             <p className="text-white/50 leading-relaxed font-medium">{t.howItWorks?.step1?.desc || "학부모가 스마트폰으로 앱에 접속하여 버튼 하나로 아이의 하교를 요청합니다."}</p>
             {/* Connector line for desktop */}
             <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-white/20"></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center">
             <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 relative z-10 border border-white/20 shadow-2xl backdrop-blur-md">
                <RefreshCw size={40} className="text-blue-400" />
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-black text-white">2</div>
             </div>
             <h3 className="text-2xl font-bold mb-4">{t.howItWorks?.step2?.title || "2. 안전 데이터 동기화"}</h3>
             <p className="text-white/50 leading-relaxed font-medium">{t.howItWorks?.step2?.desc || "정보가 즉시 클라우드와 구글 시트에 안전하게 암호화되어 기록됩니다."}</p>
             {/* Connector line for desktop */}
             <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-white/20"></div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center">
             <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 relative z-10 border border-white/20 shadow-2xl backdrop-blur-md">
                <BellRing size={40} className="text-emerald-400" />
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-black text-white">3</div>
             </div>
             <h3 className="text-2xl font-bold mb-4">{t.howItWorks?.step3?.title || "3. 선생님 확인 및 알림"}</h3>
             <p className="text-white/50 leading-relaxed font-medium">{t.howItWorks?.step3?.desc || "선생님 대시보드에 즉각 알림이 울리며, 선생님 확인 시 최종 하교 처리됩니다."}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section-padding">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">{t.features.title}</h2>
          <p className="text-black/60 mt-4 text-lg max-w-2xl mx-auto">{t.features.subtitle}</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            { icon: QrCode, title: t.features.item1.title, desc: t.features.item1.desc },
            { icon: FileText, title: t.features.item2.title, desc: t.features.item2.desc },
            { icon: Bell, title: t.features.item3.title, desc: t.features.item3.desc },
            { icon: Car, title: t.features.item4.title, desc: t.features.item4.desc },
            { icon: Printer, title: t.features.item5.title, desc: t.features.item5.desc },
            { icon: ShieldCheck, title: t.features.item6.title, desc: t.features.item6.desc },
            { icon: Smartphone, title: t.features.item7.title, desc: t.features.item7.desc },
            { icon: Users, title: t.features.item8.title, desc: t.features.item8.desc },
            { icon: CheckCircle2, title: t.features.item9.title, desc: t.features.item9.desc }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="p-8 rounded-[32px] bg-white border border-black/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group shadow-sm"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all border border-black/5 shadow-inner">
                <feature.icon size={28} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">{feature.title}</h3>
              <p className="text-black/60 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Section / Tech Stack */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              {t.trust.title}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t.trust.item1.title}</h4>
                  <p className="text-gray-400">{t.trust.item1.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t.trust.item2.title}</h4>
                  <p className="text-gray-400">{t.trust.item2.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t.trust.item3.title}</h4>
                  <p className="text-gray-400">{t.trust.item3.desc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-400 text-sm italic">Service Uptime</div>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
              <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
              <div className="text-gray-400 text-sm italic">Notification Speed</div>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center col-span-2">
              <div className="text-2xl font-bold mb-2">Cloud-Native Architecture</div>
              <div className="text-gray-400 text-sm">Scalable solutions for any size of institution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-gray-50/50">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">{t.pricing.title}</h2>
          <p className="text-black/60 mt-4 text-lg max-w-2xl mx-auto">{t.pricing.subtitle}</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {/* Basic Plan */}
          <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-lg relative overflow-hidden flex flex-col">
            <h3 className="text-2xl font-black mb-2 text-black">{t.pricing.basic.name}</h3>
            <p className="text-black/50 font-bold mb-6 text-sm">{t.pricing.basic.desc}</p>
            <div className="mb-8">
               <span className="text-4xl font-black">{t.pricing.basic.price}</span>
               <span className="text-black/40 font-bold text-lg">{t.pricing.monthly}</span>
            </div>
            <ul className="space-y-4 flex-1 mb-10">
              {t.pricing.basic.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-primary" />
                  </div>
                  <span className="text-sm font-bold text-black/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="apple-button-secondary w-full text-center py-4 bg-gray-100 hover:bg-gray-200">
               {t.pricing.btnStart}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary rounded-[40px] p-10 border border-transparent shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col text-white">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-white text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Popular</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{t.pricing.pro.name}</h3>
            <p className="text-white/70 font-bold mb-6 text-sm">{t.pricing.pro.desc}</p>
            <div className="mb-8">
               <span className="text-4xl font-black">{t.pricing.pro.price}</span>
               <span className="text-white/60 font-bold text-lg">{t.pricing.monthly}</span>
            </div>
            <ul className="space-y-4 flex-1 mb-10">
              {t.pricing.pro.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="apple-button-primary w-full text-center py-4 bg-white text-primary hover:bg-gray-50 border-none">
               {t.pricing.btnSelect}
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center">
        <div className="bg-primary/5 rounded-[48px] py-20 px-6 md:px-20 overflow-hidden relative border border-primary/10">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-black">
              {t.cta.title}
            </h2>
            <p className="text-xl text-black/80 mb-12 max-w-2xl mx-auto font-bold">
              {t.cta.subtitle}
            </p>
            <Link href="/signup" className="apple-button-primary inline-block px-12 py-5 text-lg shadow-2xl shadow-primary/30">
              {t.common.start}
            </Link>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm">
                  <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-1.5" />
                </div>
                <span className="font-bold text-xl tracking-tight">Children Gate</span>
              </div>
              <p className="text-black/50 font-medium max-w-sm">
                Smart and Safe Attendance System. Providing the most reliable bridge between institutions and parents.
              </p>
              <div className="text-sm text-black/40 font-medium space-y-1">
                <p>{t.common.representative} | {t.common.email}</p>
                <p>Address: [기본 주소 설정 전]</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-black/30">Legal</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="/privacy" className="text-black/60 hover:text-primary transition-colors">{t.common.privacy}</Link></li>
                <li><Link href="/terms" className="text-black/60 hover:text-primary transition-colors">{t.common.terms}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-black/30">Support</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="mailto:onchurchtx@gmail.com" className="text-black/60 hover:text-primary transition-colors">{t.common.contact}</a></li>
                <li><Link href="/dashboard/admin/guide" className="text-black/60 hover:text-primary transition-colors">Admin Guide</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-black/30 font-medium">
              {t.common.copyright}
            </p>
            <div className="flex gap-6 text-black/30">
              {/* Optional: Social Icons */}
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
