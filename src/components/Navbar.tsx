"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-black/5 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-black/5">
            <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-1.5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-black">Children Gate</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="#features" className="hover:text-primary transition-colors text-black/70">{t.nav.features}</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors text-black/70">{t.nav.howItWorks}</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors text-black/70">{t.nav.pricing}</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 text-xs font-bold hover:bg-black/5 transition-all"
          >
            <Globe size={14} className="text-primary" />
            {language === "ko" ? "EN" : "KO"}
          </button>
          
          <Link href="/login" className="text-sm font-semibold text-black/70 hover:text-black transition-colors hidden md:block">{t.common.login}</Link>
          <Link 
            href="/signup" 
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black/80 transition-all shadow-lg shadow-black/10"
          >
            {t.common.signup}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
