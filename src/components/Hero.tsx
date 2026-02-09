"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PlayCircle, Trophy, Users } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-slate-950">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm text-indigo-400 mb-6 uppercase tracking-widest font-bold">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span>Global Master Access</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">
                            Master Any Skill with <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                Gamified Paths.
                            </span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
                            Create, share, and follow structured learning journeys. Turn passive watching into active mastery with interactive evaluations and global certifications.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/auth">
                            <button className="h-14 px-10 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/20 flex items-center gap-2">
                                Start Learning <ArrowRight size={18} />
                            </button>
                        </Link>
                        <button className="h-14 px-10 bg-white/5 text-white border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                            <PlayCircle size={18} /> Watch Demo
                        </button>
                    </motion.div>

                    {/* Stats / Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/10 pt-8"
                    >
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-xl md:text-2xl font-black text-white italic">
                                <span>10K+</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Learners</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-xl md:text-2xl font-black text-indigo-400 italic">
                                <span>500+</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mastery Paths</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-xl md:text-2xl font-black text-white italic">
                                <span>95%</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Success Rate</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
