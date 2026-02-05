"use client";

import React, { useState, useEffect, use } from "react";
import { Module, LearningUnit, LearningPath } from "@/lib/data/types";
import { getPathBySlug } from "@/lib/data/paths";
import { PathNode } from "@/components/learning-path/PathNode";
import { UnitModal } from "@/components/learning-path/UnitModal";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    ChevronLeft, Sparkles, LayoutGrid,
    Trophy, User as UserIcon, Award,
    Loader2, X
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function DynamicPathDashboard({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [pathData, setPathData] = useState<LearningPath | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<LearningUnit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<"path" | "ranks" | "profile">("path");
    const [userProfile, setUserProfile] = useState<any>({ xp_points: 0, streak_count: 0 });
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        console.log("Dashboard State:", { authLoading, user: !!user, slug });
        if (authLoading) return;

        if (!user) {
            router.push("/auth");
            return;
        }

        const currentPath = getPathBySlug(slug);
        if (!currentPath) {
            router.push("/dashboard");
            return;
        }

        setPathData(currentPath);
        setModules(currentPath.modules);
        fetchUserData(currentPath);
        fetchLeaderboard();
    }, [user, authLoading, slug]);

    const fetchUserData = async (currentPath: LearningPath) => {
        setLoading(true);
        try {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
            if (profile) {
                setUserProfile(profile);
            } else if (user) {
                const newProfile = { id: user.id, username: user.user_metadata?.full_name || user.email?.split('@')[0], xp_points: 0, streak_count: 0 };
                await supabase.from('profiles').upsert(newProfile);
                setUserProfile(newProfile);
            }

            const { data: progress } = await supabase.from('user_progress').select('*').eq('user_id', user?.id);

            if (currentPath) {
                const updatedModules = JSON.parse(JSON.stringify(currentPath.modules));
                let nextUnlockFound = false;

                updatedModules.forEach((m: Module) => {
                    m.units.forEach((u: LearningUnit) => {
                        const p = progress?.find(prog => prog.unit_id === u.id);
                        if (p && p.status === 'completed') {
                            u.isCompleted = true;
                            u.isLocked = false;
                        } else if (!nextUnlockFound) {
                            u.isLocked = false;
                            nextUnlockFound = true;
                        } else {
                            u.isLocked = true;
                        }
                    });
                });

                if (updatedModules[0]?.units[0]) updatedModules[0].units[0].isLocked = false;
                setModules(updatedModules);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('id, username, xp_points')
            .order('xp_points', { ascending: false })
            .limit(10);
        if (data) setLeaderboard(data);
    };

    const handleUnitClick = (unit: LearningUnit) => {
        if (unit.isLocked) return;
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const handleComplete = async (unitId: string, earnedXp: number) => {
        if (!user) return;

        const newXp = (userProfile.xp_points || 0) + earnedXp;
        setUserProfile((prev: any) => ({ ...prev, xp_points: newXp }));

        await supabase.from('user_progress').upsert({
            user_id: user.id,
            unit_id: unitId,
            status: 'completed',
            completed_at: new Date().toISOString()
        });

        await supabase.from('profiles').update({ xp_points: newXp }).eq('id', user.id);

        setIsModalOpen(false);
        if (pathData) fetchUserData(pathData);
        fetchLeaderboard();
    };

    const allUnits = modules.flatMap(m => m.units);
    const completedCount = allUnits.filter(u => u.isCompleted).length;
    const progressPercent = allUnits.length > 0 ? Math.round((completedCount / allUnits.length) * 100) : 0;

    if (authLoading || loading || !pathData) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" strokeWidth={3} />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Hero Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 pb-40">
            <Navbar />

            <header className="fixed top-20 md:top-24 left-0 right-0 z-[30] bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <ChevronLeft size={20} className="md:size-6" />
                    </button>
                    <div>
                        <h1 className="font-black text-slate-800 text-base md:text-xl tracking-tight leading-none">{pathData.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 md:gap-2 bg-purple-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-purple-100">
                        <Sparkles size={14} className="text-purple-600 fill-purple-600 md:size-4" />
                        <span className="font-black text-purple-600 text-[10px] md:text-sm">{userProfile.xp_points} XP</span>
                    </div>
                </div>
            </header>

            <main className="pt-36 md:pt-52 px-4 md:px-6 max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeView === "path" && (
                        <motion.div key="path" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 md:space-y-16">
                            <section className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
                                    <div className="relative shrink-0">
                                        <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                                            <motion.circle
                                                cx="50%" cy="50%" r="45%" stroke="#FF7E29" strokeWidth="10" fill="transparent"
                                                strokeDasharray={283} // Fixed value for r=45%
                                                initial={{ strokeDashoffset: 283 }}
                                                animate={{ strokeDashoffset: 283 - (283 * (progressPercent || 0)) / 100 }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center font-black text-3xl md:text-4xl">{progressPercent}%</div>
                                    </div>
                                    <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
                                        <h2 className="text-2xl md:text-3xl font-black">Path Mastery</h2>
                                        <p className="text-slate-400 font-medium text-sm md:text-base">You've unlocked {completedCount} metrics. Reach 100% to earn your senior certification.</p>
                                        {progressPercent === 100 && (
                                            <Button onClick={() => setShowCertificate(true)} className="bg-byjus text-white border-none px-6 w-full md:w-auto mt-2 h-12">CLAIM CERTIFICATE</Button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col items-center gap-12 pb-20">
                                {modules.map((module, mIdx) => (
                                    <React.Fragment key={module.id}>
                                        <div className="w-full flex justify-center z-[25]">
                                            <div className="bg-white px-6 py-2 rounded-full border border-slate-200 font-black uppercase tracking-widest text-[9px] text-slate-400 shadow-sm mb-4">
                                                {module.title}
                                            </div>
                                        </div>
                                        {module.units.map((unit, uIdx) => (
                                            <PathNode
                                                key={unit.id}
                                                status={unit.isCompleted ? "completed" : unit.isLocked ? "locked" : "unlocked"}
                                                type={unit.type}
                                                title={unit.title}
                                                points={unit.xpPoints}
                                                index={uIdx}
                                                onClick={() => handleUnitClick(unit)}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeView === "ranks" && (
                        <motion.div key="ranks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <h2 className="text-4xl font-black text-center tracking-tight">Elite Leaderboard</h2>
                            <div className="max-w-xl mx-auto space-y-3">
                                {leaderboard.map((hero, idx) => (
                                    <div key={hero.id} className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${hero.id === user?.id ? "bg-orange-50 border-orange-200" : "bg-white border-slate-50"}`}>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-slate-300 w-6">#{idx + 1}</span>
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">{hero.username?.[0]?.toUpperCase()}</div>
                                            <span className="font-bold text-slate-800">{hero.username}</span>
                                        </div>
                                        <span className="font-black text-orange-600">{hero.xp_points} XP</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeView === "profile" && (
                        <motion.div key="profile" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-slate-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-32 bg-slate-900 -z-0" />

                                <div className="relative mt-12 flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-2xl border-4 border-white rotate-3">
                                        <div className="w-full h-full rounded-[1.5rem] bg-orange-50 overflow-hidden flex items-center justify-center">
                                            <UserIcon size={64} className="text-orange-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black mt-6 text-slate-900">{userProfile.username}</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{user?.email}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-10">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-white shadow-sm">
                                        <span className="block text-2xl font-black text-orange-600 font-mono mb-0.5">{userProfile.xp_points}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total XP</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-white shadow-sm">
                                        <span className="block text-2xl font-black text-purple-600 font-mono mb-0.5">{userProfile.streak_count || 0}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Day Streak</span>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-3">
                                    <Button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest">Edit Hero Profile</Button>
                                    <Button variant="outline" onClick={() => router.push("/")} className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-2">Switch Path</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] bg-white border border-slate-100 rounded-[2rem] p-2 flex gap-4 shadow-2xl">
                <button onClick={() => setActiveView("path")} className={`p-4 rounded-[1.5rem] transition-all ${activeView === 'path' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`}>
                    <LayoutGrid size={24} strokeWidth={3} />
                </button>
                <button onClick={() => setActiveView("ranks")} className={`p-4 rounded-[1.5rem] transition-all ${activeView === 'ranks' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`}>
                    <Trophy size={24} strokeWidth={3} />
                </button>
                <button onClick={() => setActiveView("profile")} className={`p-4 rounded-[1.5rem] transition-all ${activeView === 'profile' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`}>
                    <UserIcon size={24} strokeWidth={3} />
                </button>
            </nav>

            <UnitModal unit={selectedUnit} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onComplete={handleComplete} />

            <AnimatePresence>
                {showCertificate && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 max-w-xl w-full border-8 border-yellow-400 shadow-2xl text-center relative">
                            <button onClick={() => setShowCertificate(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500"><X /></button>
                            <Award size={64} className="mx-auto text-yellow-500 mb-6" />
                            <h2 className="text-4xl font-black mb-10">SENIOR CERTIFICATION</h2>
                            <div className="py-8 border-y border-slate-100 mb-8">
                                <p className="text-slate-400 font-medium mb-4 uppercase tracking-[0.2em] text-xs">This honors the mastery of</p>
                                <h3 className="text-4xl font-black text-slate-900">{userProfile.username}</h3>
                            </div>
                            <p className="font-bold text-slate-600 mb-10">for completing the {pathData.title} Academy Path with distinction.</p>
                            <Button className="w-full bg-slate-900 py-6 text-white rounded-2xl font-black">SAVE OFFICIAL RECORD</Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
