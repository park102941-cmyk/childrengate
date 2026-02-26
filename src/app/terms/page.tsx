"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-black/40 hover:text-black font-medium mb-12 transition-colors">
          <ArrowLeft size={18} />
          <span>Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-black/5 border border-black/5"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary">
            <FileText size={32} />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-8">
            {t.legal.terms.title}
          </h1>

          <div className="space-y-12 text-black/70 leading-relaxed font-medium">
            <section className="space-y-4">
              <div className="whitespace-pre-wrap">
                {t.legal.terms.responsibility}
              </div>
            </section>

            <section className="space-y-4">
              <div className="whitespace-pre-wrap">
                {t.legal.terms.copyright}
              </div>
            </section>
          </div>
        </motion.div>
        
        <p className="text-center text-black/40 text-xs mt-12">
          &copy; 2026 Children Gate. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
