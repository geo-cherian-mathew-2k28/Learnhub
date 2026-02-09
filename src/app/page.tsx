"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Sparkles, Brain, Rocket, Award } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/path/kafka");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* 🚀 Feature Grid: Mastery Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-20">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Academy Core</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
              Engineered for <span className="text-indigo-600">Mastery.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Brain className="text-indigo-600" size={32} />}
              title="Cognitive Paths"
              desc="Structured learning journeys designed for high-speed retention and architectural understanding."
            />
            <FeatureCard
              icon={<Rocket className="text-indigo-600" size={32} />}
              title="Tactical Execution"
              desc="Gamified evaluation stages that challenge your decision-making and technical execution."
            />
            <FeatureCard
              icon={<Award className="text-indigo-600" size={32} />}
              title="Expert Credentials"
              desc="Earn Sync-Verified certificates that prove your mastery in complex distributed systems."
            />
          </div>
        </div>
      </section>

      {/* 🏁 CTA Section */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10 text-center space-y-10 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1.1] md:leading-none">
              Ready to <br /> <span className="text-indigo-600">Authorize?</span>
            </h2>
            <p className="text-base md:text-xl text-slate-500 font-bold uppercase tracking-tight italic">
              Join the elite terminal of global engineering specialists.
            </p>
          </div>

          <Link href="/auth">
            <button className="h-16 md:h-20 px-8 md:px-12 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] text-lg md:text-xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-[0.98]">
              Initialize Entry
            </button>
          </Link>
        </div>
      </section>

      {/* 🏛️ Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">LearnHub</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architected by Geo Cherian Mathew</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 Academy Global Protocol. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 md:p-10 bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-600 transition-all group">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 italic uppercase tracking-tighter">{title}</h3>
      <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
