"use client";

import React, { useState, useEffect, use } from "react";
import { Module, LearningUnit, LearningPath } from "@/lib/data/types";
import { getPathBySlug } from "@/lib/data/paths";
import { UnitModal } from "@/components/learning-path/UnitModal";
import { CertificateModal } from "@/components/learning-path/CertificateModal";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    Trophy, User as UserIcon, Loader2, PlayCircle, ShieldCheck,
    Award, Zap, CheckCircle2, ChevronRight, Activity, Cpu,
    Globe, ArrowUpRight, LayoutDashboard, Layers, BookOpen,
    BarChart4, ArrowRight, Target, Sparkles, Star, TrendingUp
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
    const [isCertOpen, setIsCertOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastPosition, setLastPosition] = useState<string | null>(null);
    const [localCompletions, setLocalCompletions] = useState<Set<string>>(new Set());
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"journey" | "hall" | "stats">("journey");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/");
            return;
        }

        const currentPath = getPathBySlug(slug);
        if (!currentPath) {
            router.push("/");
            return;
        }

        setPathData(currentPath);
        fetchUserData(currentPath);
        fetchHallOfFame();
    }, [user, authLoading, slug]);

    const fetchUserData = async (currentPath: LearningPath) => {
        if (!user) return;
        try {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

            const profileData = {
                id: user.id,
                username: profile?.username || user.email?.split('@')[0] || "Scholar",
                xp_points: profile?.xp_points || 0
            };
            setUserProfile(profileData);

            const { data: progress } = await supabase.from('user_progress').select('unit_id, status').eq('user_id', user.id);
            const serverCompleted = progress?.filter(p => p.status === 'completed').map(p => p.unit_id) || [];

            const allCompleted = new Set([...serverCompleted, ...Array.from(localCompletions)]);

            if (currentPath) {
                const refreshedModules = JSON.parse(JSON.stringify(currentPath.modules));
                const flattened = refreshedModules.flatMap((m: any) => m.units);

                let foundNext = false;
                let resumeId = null;

                flattened.forEach((unit: LearningUnit) => {
                    const isDone = allCompleted.has(unit.id);
                    unit.isCompleted = isDone;

                    if (isDone) {
                        unit.isLocked = false;
                    } else if (!foundNext) {
                        unit.isLocked = false;
                        foundNext = true;
                        resumeId = unit.id;
                    } else {
                        unit.isLocked = true;
                    }
                });

                setModules(refreshedModules);
                setLastPosition(resumeId || (flattened.length > 0 ? "fully_completed" : null));
            }
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHallOfFame = async () => {
        const { data } = await supabase.from('profiles').select('id, username, xp_points').order('xp_points', { ascending: false }).limit(10);
        if (data) setLeaderboard(data);
    };

    const handleUnitClick = (unit: LearningUnit) => {
        if (unit.isLocked) return;
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const handleResume = () => {
        if (!lastPosition || lastPosition === "fully_completed") return;
        const unit = modules.flatMap(m => m.units).find(u => u.id === lastPosition);
        if (unit) handleUnitClick(unit);
    };

    const handleComplete = (unitId: string, earnedXp: number, score: number) => {
        if (!user) return;
        setLocalCompletions(prev => new Set(prev).add(unitId));
        setModules(prev => {
            const draft = JSON.parse(JSON.stringify(prev));
            const flattened = draft.flatMap((m: any) => m.units);
            let foundThis = false;
            flattened.forEach((u: any) => {
                if (u.id === unitId) {
                    u.isCompleted = true;
                    u.isLocked = false;
                    foundThis = true;
                } else if (foundThis) {
                    u.isLocked = false;
                    foundThis = false;
                }
            });
            return draft;
        });
        setIsModalOpen(false);
        const newXp = (userProfile?.xp_points || 0) + earnedXp;
        setUserProfile((p: any) => p ? { ...p, xp_points: newXp } : p);

        supabase.from('user_progress').upsert({
            user_id: user.id, unit_id: unitId, status: 'completed', score: score, completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,unit_id' }).then(() => {
            supabase.from('profiles').update({ xp_points: newXp }).eq('id', user.id).then(() => fetchHallOfFame());
        });
    };

    const allUnits = modules.flatMap(m => m.units);
    const completedCount = allUnits.filter(u => u.isCompleted).length;
    const progressPercent = allUnits.length > 0 ? Math.round((completedCount / allUnits.length) * 100) : 0;
    const isPathMastered = progressPercent === 100;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (authLoading || loading || !pathData || !userProfile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waking up the academy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />

            <div className="pt-16 flex min-h-[calc(100vh-64px)]">
                {/* 🏛️ Academy Sidebar */}
                <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-16 h-[calc(100vh-64px)]">
                    <div className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide">

                        {/* Summary Widget */}
                        <div className="p-5 bg-slate-900 rounded-2xl space-y-4 shadow-xl shadow-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <UserIcon size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tracking-tight text-white line-clamp-1">{userProfile.username}</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest italic">Scholar Status</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <span>Sync</span>
                                    <span className="text-white">{progressPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                </div>
                            </div>

                            <Button
                                onClick={handleResume}
                                disabled={isPathMastered}
                                className="w-full h-10 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                                {isPathMastered ? "Course Finalized" : "Resume Flow"}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Operations</p>
                            <nav className="space-y-1">
                                <SideLink active={activeTab === 'journey'} icon={<Layers size={18} />} label="Learning Journey" onClick={() => setActiveTab('journey')} />
                                <SideLink active={activeTab === 'hall'} icon={<Trophy size={18} />} label="Hall of Fame" onClick={() => setActiveTab('hall')} />
                                <SideLink active={activeTab === 'stats'} icon={<TrendingUp size={18} />} label="My Progress" onClick={() => setActiveTab('stats')} />
                            </nav>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Link</span>
                        </div>
                    </div>
                </aside>

                {/* 🚀 Main Platform Workspace */}
                <main className="flex-1 px-6 lg:px-16 py-12 lg:py-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'journey' && (
                            <motion.div key="journey" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-20">
                                <header className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px w-8 bg-indigo-200" />
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">
                                            {getGreeting()}, {userProfile.username}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-none">
                                            {pathData.title} <span className="text-indigo-600 uppercase italic font-black">Core.</span>
                                        </h1>
                                        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                                            {pathData.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 flex flex-wrap gap-4">
                                        <PathMetric icon={<Zap size={16} />} label="Energy Level" value={`${userProfile.xp_points} XP`} />
                                        <PathMetric icon={<BookOpen size={16} />} label="Knowledge Nodes" value={`${allUnits.length} Units`} />
                                        <PathMetric icon={<Target size={16} />} label="Global Rank" value="#241" />
                                    </div>
                                </header>

                                <div className="space-y-24">
                                    {modules.map((module, mIdx) => (
                                        <section key={module.id} className="space-y-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-sm font-black text-indigo-600">
                                                    0{mIdx + 1}
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{module.title}</h2>
                                                <div className="flex-1 h-px bg-slate-100" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {module.units.map((unit) => (
                                                    <div
                                                        key={unit.id}
                                                        onClick={() => handleUnitClick(unit)}
                                                        className={`group relative p-8 bg-white rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer ${unit.isCompleted
                                                            ? "border-green-100 bg-green-50/10"
                                                            : unit.isLocked
                                                                ? "opacity-50 grayscale pointer-events-none border-slate-100 bg-slate-50/50"
                                                                : "border-transparent shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-indigo-600 hover:shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] hover:scale-[1.02]"
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${unit.isCompleted
                                                                ? "bg-green-600 text-white"
                                                                : "bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
                                                                }`}>
                                                                {unit.isCompleted ? <ShieldCheck size={28} /> : <PlayCircle size={28} />}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-600">{unit.type}</span>
                                                                <span className="px-2 py-0.5 bg-slate-50 rounded text-[9px] font-bold text-slate-500">+{unit.xpPoints} XP</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{unit.title}</h3>
                                                            <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{unit.description}</p>
                                                        </div>

                                                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Execute Session</span>
                                                            <ArrowRight className="text-indigo-600" size={18} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ))}

                                    {isPathMastered && (
                                        <section className="pt-10">
                                            <div className="bg-slate-900 rounded-[3.5rem] p-16 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
                                                <div className="space-y-4 relative z-10">
                                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                                                        <Award size={48} className="text-indigo-600" />
                                                    </div>
                                                    <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Velocity Terminal Achieved.</h3>
                                                    <p className="text-slate-400 font-bold text-lg uppercase tracking-widest italic opacity-60">Synchronizing permanent credential record...</p>
                                                </div>
                                                <Button
                                                    onClick={() => setIsCertOpen(true)}
                                                    className="h-16 px-12 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl relative z-10"
                                                >
                                                    Sync Certificate
                                                </Button>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'hall' && (
                            <motion.div key="hall" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto space-y-16">
                                <header className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px w-8 bg-indigo-200" />
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Competitive Analytics</span>
                                    </div>
                                    <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Hall of <span className="text-indigo-600 uppercase italic font-black">Fame.</span></h2>
                                    <p className="text-lg text-slate-500 font-medium">Top performing scholars in the Academy.</p>
                                </header>

                                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-1 divide-y divide-slate-100">
                                        <div className="grid grid-cols-[80px_1fr_120px] p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                                            <span>Rank</span>
                                            <span>Student</span>
                                            <span className="text-right">Sync XP</span>
                                        </div>
                                        {leaderboard.map((scholar, idx) => (
                                            <div key={scholar.id} className="grid grid-cols-[80px_1fr_120px] items-center p-8 hover:bg-slate-50 transition-all group">
                                                <span className={`text-2xl font-black italic tracking-tighter ${idx < 3 ? 'text-indigo-600' : 'text-slate-300'}`}>0{idx + 1}</span>
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <UserIcon size={20} />
                                                    </div>
                                                    <span className="text-lg font-bold text-slate-900">{scholar.username}</span>
                                                </div>
                                                <span className="text-xl font-black italic text-right text-indigo-600">{scholar.xp_points}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'stats' && (
                            <motion.div key="stats" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto space-y-16">
                                <header className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px w-8 bg-indigo-200" />
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Personal Analytics</span>
                                    </div>
                                    <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Sync <span className="text-indigo-600 uppercase italic font-black">Report.</span></h2>
                                    <p className="text-lg text-slate-500 font-medium">Your cognitive synchronization status.</p>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <StatusTile icon={<Star className="text-yellow-500" />} label="Current Level" value="Pro Scholar" />
                                    <StatusTile icon={<TrendingUp className="text-green-500" />} label="Modules Sync'd" value={`${completedCount} Unit(s)`} />
                                    <StatusTile icon={<Zap className="text-indigo-600" />} label="Terminal XP" value={userProfile.xp_points} />
                                </div>

                                <div className="p-12 bg-white rounded-[3rem] border border-slate-200 space-y-8">
                                    <div className="flex items-baseline justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 uppercase italic italic">Knowledge Coverage</h3>
                                        <span className="text-4xl font-black italic text-indigo-600">{progressPercent}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-indigo-600" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-400">Master more units to unlock the path final synchronization certificate.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <UnitModal unit={selectedUnit} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onComplete={handleComplete} />
            <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} userData={userProfile} pathTitle={pathData.title} />
        </div>
    );
}

function SideLink({ active, icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all group ${active
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
        >
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            {label}
        </button>
    );
}

function PathMetric({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-600 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
                <span className="text-sm font-bold text-slate-900">{value}</span>
            </div>
        </div>
    );
}

function StatusTile({ icon, label, value }: any) {
    return (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black italic text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}
