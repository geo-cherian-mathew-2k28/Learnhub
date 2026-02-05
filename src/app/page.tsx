"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Zap, Star, Layout, Users, ShieldCheck, ArrowUpRight, Globe } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">

          {/* Left Content */}
          <div className="w-full lg:w-3/5 space-y-10 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-premium border border-slate-100"
            >
              <div className="bg-orange-100 p-1.5 rounded-lg">
                <Sparkles size={16} className="text-orange-600" />
              </div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Next-Gen Learning Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-[100px] font-black text-slate-900 tracking-tight leading-[0.85] md:leading-[0.8]"
            >
              Master Tech.<br />
              <span className="text-byjus bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E29] to-[#FF4D00]">Build Futures.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed"
            >
              The world's most advanced learning path for junior engineers. Master <span className="text-slate-900 font-black decoration-orange-500/30 decoration-4 underline underline-offset-4">Kafka</span>, Architecture, and High-Scale Systems through immersive 3D simulations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-6"
            >
              <Link href={user ? "/path/kafka" : "/auth"} className="w-full sm:w-auto">
                <button className="w-full bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all text-lg flex items-center justify-center gap-3 group">
                  Get Started Free <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-white text-slate-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest border border-slate-200 hover:border-orange-500 transition-all text-lg flex items-center justify-center gap-3">
                Explore Paths <Globe size={20} className="text-slate-400" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-10 pt-8 border-t border-slate-200/60"
            >
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-800 tracking-tighter">150K+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-800 tracking-tighter">4.9/5</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual (Professional SaaS Design) */}
          <div className="w-full lg:w-2/5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {/* Abstract Premium Geometry */}
              <div className="relative aspect-square w-full bg-white rounded-[4rem] shadow-soft p-12 overflow-hidden border border-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-byjus opacity-[0.03]" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="w-full h-full border-[1.5px] border-orange-500/10 rounded-full flex items-center justify-center"
                >
                  <div className="w-3/4 h-3/4 border-[1.5px] border-orange-500/20 rounded-full flex items-center justify-center">
                    <div className="w-1/2 h-1/2 border-[1.5px] border-orange-500/40 rounded-full" />
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={140} className="text-orange-500 drop-shadow-2xl opacity-20" />
                </div>

                {/* Float Cards */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 -right-10 glass border-2 border-white p-6 rounded-3xl shadow-premium z-20 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Star fill="currentColor" size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mastery Level</p>
                    <p className="text-lg font-black text-slate-800">Elite Engineer</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-10 -left-10 glass border-2 border-white p-6 rounded-3xl shadow-premium z-20 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Users size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Learners</p>
                    <p className="text-lg font-black text-slate-800">12,410+</p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-200/20 rounded-full blur-[100px] -z-10" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="bg-slate-900 py-32 md:py-48 px-6 text-white overflow-hidden relative">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Layout className="text-orange-400" />, title: "3D Concept Discovery", desc: "Interact with real-world architecture diagrams in fully immersive 3D environments." },
              { icon: <Zap className="text-yellow-400" />, title: "Real-time Simulators", desc: "Launch real Kafka clusters and produce messages directly in your browser without install." },
              { icon: <ShieldCheck className="text-green-400" />, title: "Career Ready Certs", desc: "Earn enterprise-verified credentials that top tier tech firms recognize and trust." }
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] space-y-8 hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  {feat.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">{feat.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-4">
                  <button className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                    Learn More <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
