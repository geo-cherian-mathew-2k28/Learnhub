"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LearningUnit, QuizQuestion } from "@/lib/data/types";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, X, BookOpen, Activity, Target,
    ArrowRight, Trophy, Loader2, Heart,
    Zap, Shield, Terminal, Award,
    Sparkles, ChevronRight, PlayCircle, Eye, Rocket,
    Cpu, Star
} from "lucide-react";
import confetti from "canvas-confetti";

interface UnitModalProps {
    unit: LearningUnit | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (unitId: string, earnedXp: number, score: number) => void;
}

type TabType = "concept" | "video" | "evaluation";

export function UnitModal({ unit, isOpen, onClose, onComplete }: UnitModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("concept");
    const [unlockedTabs, setUnlockedTabs] = useState<Set<TabType>>(new Set(["concept"]));
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        if (isOpen && unit) {
            setActiveTab("concept");
            setUnlockedTabs(new Set(["concept"]));
            setStartTime(Date.now());
        }
    }, [isOpen, unit]);

    if (!unit) return null;

    const getVideoId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(unit.contentUrl || "");

    const handleNextTab = (current: TabType) => {
        if (current === "concept") {
            setUnlockedTabs(prev => new Set(prev).add("video"));
            setActiveTab("video");
        } else if (current === "video") {
            setUnlockedTabs(prev => new Set(prev).add("evaluation"));
            setActiveTab("evaluation");
        }
    };

    const handleFinalComplete = (score: number = 100) => {
        const timeSpentSeconds = (Date.now() - startTime) / 1000;
        const timeBonus = Math.min(20, Math.floor(timeSpentSeconds / 10));
        const finalXp = Math.floor(unit.xpPoints * (score / 100)) + timeBonus;
        onComplete(unit.id, finalXp, score);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl w-[95vw] md:w-full p-0 bg-transparent border-none shadow-none z-[10001] h-[95vh] md:h-[85vh] min-h-[500px] overflow-hidden no-print flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl md:rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.25)] relative h-full w-full flex flex-col border border-slate-200"
                >
                    <div className="flex flex-col md:flex-row h-full overflow-hidden">
                        {/* 🔘 Navigation Sidebar / TopBar */}
                        <aside className="w-full md:w-56 bg-slate-50 flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden">
                            {/* Header Info */}
                            <div className="p-4 md:p-8 space-y-4 md:space-y-6 flex md:flex-col items-center md:items-stretch justify-between md:justify-start border-b md:border-b-0 border-slate-100">
                                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-5">
                                    <div className="flex w-8 h-8 md:w-12 md:h-12 bg-indigo-600 rounded-xl items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                        <BookOpen size={20} className="md:size-24" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="hidden md:block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Learning Node</p>
                                        <DialogTitle className="text-sm md:text-base font-black text-slate-900 tracking-tight leading-tight uppercase italic line-clamp-1 md:line-clamp-2">{unit.title}</DialogTitle>
                                    </div>
                                </div>
                                <button onClick={onClose} className="md:hidden p-2 rounded-full bg-white border border-slate-200 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="flex flex-row md:flex-col p-2 md:p-4 gap-1 overflow-x-auto scrollbar-hide">
                                <NavLink active={activeTab === 'concept'} icon={<Terminal size={14} />} label="Theory" onClick={() => setActiveTab('concept')} />
                                <NavLink active={activeTab === 'video'} unlocked={unlockedTabs.has('video')} icon={<PlayCircle size={14} />} label="Visual" onClick={() => setActiveTab('video')} />
                                <NavLink active={activeTab === 'evaluation'} unlocked={unlockedTabs.has('evaluation')} icon={<Target size={14} />} label="Mastery" onClick={() => setActiveTab('evaluation')} />
                            </nav>

                            <div className="hidden md:mt-auto md:p-6 md:block">
                                <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest px-4 py-4 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm">
                                    <X size={14} /> Exit Session
                                </button>
                            </div>
                        </aside>

                        {/* ⚡ Content Workspace */}
                        <main className="flex-1 bg-white relative flex flex-col h-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeTab === "concept" && (
                                    <motion.div
                                        key="concept"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-6 md:p-16 w-full max-w-3xl mx-auto flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
                                    >
                                        <div className="flex-1 space-y-8 md:space-y-12 pb-10">
                                            <header className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-px w-8 bg-indigo-600" />
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Knowledge Base</span>
                                                </div>
                                                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Architecture <span className="text-indigo-600">Briefing.</span></h3>
                                                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">{unit.conceptInfo?.description || unit.description}</p>
                                            </header>

                                            <div className="grid grid-cols-1 gap-4">
                                                {unit.conceptInfo?.points?.map((p, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={i}
                                                        className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 transition-colors">
                                                            <Check size={14} className="text-indigo-600 group-hover:text-white" strokeWidth={4} />
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-sm md:text-base leading-snug">{p}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-white via-white to-transparent mt-auto">
                                            <Button onClick={() => handleNextTab("concept")} className="w-full h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl shadow-indigo-600/20">
                                                Confirm Theory <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "video" && (
                                    <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50/30">
                                        <div className="w-full max-w-2xl flex flex-col items-center gap-8 md:gap-12">
                                            <header className="text-center space-y-4">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Visual Synchronization</span>
                                                <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase italic">Media <span className="text-indigo-600">Protocol.</span></h3>
                                            </header>

                                            <div className="w-full relative bg-slate-900 rounded-3xl overflow-hidden shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4)] border-8 border-white aspect-video group">
                                                {videoId ? (
                                                    <iframe
                                                        width="100%" height="100%"
                                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`}
                                                        allow="autoplay; encrypted-media"
                                                        allowFullScreen
                                                        className="w-full h-full border-0"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-indigo-400">
                                                        <Loader2 className="animate-spin" size={32} />
                                                        <span className="font-black uppercase text-[10px] tracking-widest">Awaiting Signal...</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center space-y-6">
                                                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">Analyze the visual flow to unlock the mastery evaluation phase.</p>
                                                <Button
                                                    onClick={() => handleNextTab("video")}
                                                    className="h-14 px-12 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 shadow-indigo-600/20"
                                                >
                                                    Initiate Mastery
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "evaluation" && (
                                    <motion.div key="evaluation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col overflow-hidden">
                                        <EliteSyncGame questions={unit.quizQuestions || []} onComplete={handleFinalComplete} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

function NavLink({ active, unlocked = true, icon, label, onClick }: any) {
    return (
        <button
            disabled={!unlocked}
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3.5 md:py-4 rounded-xl md:rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-[120px] md:min-w-0 ${active
                ? "bg-white text-indigo-600 shadow-md border border-slate-100"
                : unlocked
                    ? "text-slate-400 hover:text-slate-900 hover:bg-white/50"
                    : "text-slate-200 pointer-events-none opacity-30"
                }`}
        >
            <span className={active ? "text-indigo-600 scale-110" : "transition-transform group-hover:scale-110"}>{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function EliteSyncGame({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isFinished, setIsFinished] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [nodes, setNodes] = useState<any[]>([]);

    const q = questions[step];

    useEffect(() => {
        if (!q || isFinished || isGameOver) return;

        const newNodes = q.options.map((opt, i) => ({
            id: i,
            text: opt,
            isCorrect: i === q.correctAnswer,
            lane: i,
            y: 110 + (i * 20),
            speed: 0.12,
            color: i === 0 ? "from-indigo-600 to-indigo-800" :
                i === 1 ? "from-slate-800 to-slate-900" :
                    i === 2 ? "from-blue-600 to-blue-800" : "from-purple-600 to-purple-800",
        }));

        setNodes(newNodes);
    }, [step, q, isFinished, isGameOver]);

    useEffect(() => {
        if (isFinished || isGameOver) return;
        const interval = setInterval(() => {
            setNodes(prev => prev.map(n => {
                const nextY = n.y - n.speed;
                return { ...n, y: nextY < -20 ? 110 : nextY };
            }));
        }, 16);
        return () => clearInterval(interval);
    }, [isFinished, isGameOver]);

    const handleCatch = (n: any) => {
        if (n.clicked) return;
        setNodes(prev => prev.map(node => node.id === n.id ? { ...node, clicked: true } : node));

        if (n.isCorrect) {
            setScore(p => p + 25);
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 }, colors: ['#4f46e5', '#ffffff', '#fbbf24'] });
            setTimeout(() => {
                if (step < questions.length - 1) setStep(p => p + 1);
                else setIsFinished(true);
            }, 600);
        } else {
            setLives(p => {
                if (p <= 1) { setIsGameOver(true); return 0; }
                return p - 1;
            });
            setScore(p => Math.max(0, p - 10));
        }
    };

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-8 bg-red-50/30 p-8">
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-2xl shadow-red-500/20">
                    <Shield size={40} />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Protocol Breached.</h3>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Cognitive synchronization failed.</p>
                </div>
                <Button onClick={() => { setStep(0); setLives(3); setScore(0); setIsGameOver(false); }} className="h-14 px-12 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl">Re-Initialise</Button>
            </div>
        );
    }

    if (isFinished) {
        const percent = Math.min(100, Math.round((score / (questions.length * 25)) * 100));
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-10 p-8 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
                    <Trophy size={80} className="text-indigo-600 relative z-10" />
                    <Sparkles className="absolute -top-4 -right-4 text-amber-500 animate-bounce" size={32} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter text-slate-900">Sync Mastered.</h3>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-slate-200" />
                        <p className="text-lg md:text-xl font-black text-indigo-600 italic tracking-[0.2em]">{percent}% Efficiency</p>
                        <div className="h-px w-8 bg-slate-200" />
                    </div>
                </div>
                <Button onClick={() => onComplete(percent)} className="w-full md:w-auto h-16 px-16 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-indigo-600/20">Seal Session Record</Button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col bg-slate-50/40 overflow-hidden">
            <div className="flex justify-between p-4 md:p-10 z-30 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200 shadow-xl flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Sync Phase</span>
                    <span className="text-sm md:text-lg font-black italic tabular-nums leading-none mt-1 text-slate-900">{step + 1} <span className="text-slate-300">/</span> {questions.length}</span>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200 shadow-xl text-right flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Potential XP</span>
                        <span className="text-sm md:text-lg font-black text-indigo-600 italic tabular-nums leading-none mt-1">+{score}</span>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-10 z-20">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
                    <h3 className="text-sm md:text-lg font-black text-slate-900 uppercase italic leading-tight md:leading-snug">
                        {q.question}
                    </h3>
                </motion.div>
            </div>

            <div className="flex-1 w-full relative h-full mt-10 md:mt-20">
                <AnimatePresence>
                    {nodes.map(n => (
                        <motion.button
                            key={`${step}-${n.id}`}
                            onClick={() => handleCatch(n)}
                            animate={{
                                scale: n.clicked ? 0 : 1,
                                opacity: n.clicked ? 0 : 1,
                                top: `${n.y}%`,
                                left: `${n.lane === 0 ? 18 : n.lane === 1 ? 39 : n.lane === 2 ? 61 : 82}%`
                            }}
                            transition={{ top: { duration: 0 } }}
                            className={`absolute translate-x-[-50%] flex items-center justify-center p-3 md:p-5 rounded-2xl text-white shadow-2xl bg-gradient-to-br ${n.color} border-2 border-white/20 w-[120px] md:w-[220px] min-h-[50px] md:min-h-[80px] active:scale-95 transition-all group`}
                        >
                            <span className="text-[10px] md:text-xs font-black uppercase text-center leading-tight px-1 drop-shadow-md">{n.text}</span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-8 md:p-12 mb-4 flex justify-center z-30">
                <div className="bg-slate-900/90 backdrop-blur px-6 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-3">
                    <Rocket size={16} className="text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-100 uppercase italic tracking-[0.2em]">Select the valid node to intercept</span>
                </div>
            </div>
        </div>
    );
}
