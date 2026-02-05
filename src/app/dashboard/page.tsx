"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LayoutGrid, Trophy, User as UserIcon, LogOut, ArrowRight, Zap, Database, Globe, Star, Sparkles, ChevronLeft, Hexagon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ALL_PATHS } from "@/lib/data/paths";

export default function PathSelectionPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/auth");
            return;
        }
        fetchProfile();
    }, [user]);

    async function fetchProfile() {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
            if (data) setUserProfile(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Zap className="text-orange-500 w-12 h-12" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-orange-100">
            <Navbar />

            <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16 px-2 md:px-4">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl text-orange-600 font-black text-[10px] uppercase tracking-widest border border-orange-100">
                            Welcome back, {userProfile?.username || "Hero"}
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                            Select Your <br />
                            <span className="text-byjus bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E29] to-[#FF4D00]">Skill Path.</span>
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-sm">
                        Every path is architected by senior leads to take you from a curious learner to an elite system engineer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                    {ALL_PATHS.map((path, idx) => (
                        <motion.div
                            key={path.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => router.push(`/path/${path.slug}`)}
                            className="group relative cursor-pointer"
                        >
                            <div className="bg-white rounded-[3.5rem] p-10 h-full border-2 border-slate-100 shadow-premium hover:shadow-hero hover:border-orange-500/20 transition-all space-y-8 flex flex-col relative z-10 overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 -z-10 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />

                                <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform" style={{ backgroundColor: path.color }}>
                                    {path.icon === 'Zap' && <Zap size={40} className="text-white fill-white" />}
                                    {path.icon === 'Database' && <Database size={40} className="text-white fill-white" />}
                                    {path.icon === 'Globe' && <Globe size={40} className="text-white fill-white" />}
                                </div>

                                <div className="space-y-4 flex-1">
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{path.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{path.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">Advanced</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                            <Hexagon size={14} className="text-orange-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">12 Units</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
