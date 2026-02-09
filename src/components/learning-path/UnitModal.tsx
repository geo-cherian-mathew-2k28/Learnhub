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
            <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none z-[10001] h-[75vh] min-h-[550px] overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-2xl relative h-full flex flex-col border border-slate-200"
                >
                    <div className="flex h-full overflow-hidden">
                        {/* 🔘 Professional Navigation Sidebar */}
                        <aside className="w-52 bg-slate-50 flex flex-col p-6 justify-between shrink-0 border-r border-slate-100">
                            <div className="space-y-8">
                                <div className="space-y-4 text-center">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mx-auto shadow-sm">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <DialogTitle className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase italic line-clamp-2">{unit.title}</DialogTitle>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    <NavLink active={activeTab === 'concept'} icon={<Terminal size={14} />} label="Theory Sync" onClick={() => setActiveTab('concept')} />
                                    <NavLink active={activeTab === 'video'} unlocked={unlockedTabs.has('video')} icon={<PlayCircle size={14} />} label="Visual Hub" onClick={() => setActiveTab('video')} />
                                    <NavLink active={activeTab === 'evaluation'} unlocked={unlockedTabs.has('evaluation')} icon={<Target size={14} />} label="Mastery Phase" onClick={() => setActiveTab('evaluation')} />
                                </nav>
                            </div>

                            <button onClick={onClose} className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[9px] font-black uppercase tracking-widest px-2 py-4 border border-slate-200 rounded-lg">
                                <X size={12} /> Exit Hub
                            </button>
                        </aside>

                        {/* ⚡ Workspace Arena */}
                        <main className="flex-1 bg-white relative flex flex-col items-center">
                            <AnimatePresence mode="wait">
                                {activeTab === "concept" && (
                                    <motion.div key="concept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 w-full max-w-2xl flex flex-col h-full overflow-y-auto scrollbar-hide">
                                        <div className="flex-1 space-y-10">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic border-l-4 border-indigo-600 pl-4">Architecture Briefing</h3>
                                                <p className="text-sm text-slate-500 font-bold leading-relaxed">{unit.conceptInfo?.description || unit.description}</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2.5">
                                                {unit.conceptInfo?.points?.map((p, i) => (
                                                    <div key={i} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-4">
                                                        <Check size={12} className="text-indigo-600" strokeWidth={4} />
                                                        <span className="font-black text-slate-700 text-[9px] uppercase tracking-tight">{p}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <Button onClick={() => handleNextTab("concept")} className="w-full h-12 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                                                Confirm Theory <ArrowRight size={14} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "video" && (
                                    <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
                                        <div className="w-full max-w-xl flex flex-col items-center gap-8">
                                            {/* 📺 Cinema-Grade Video Container: Properly Sized & Aligned */}
                                            <div className="w-full relative bg-slate-900 rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white aspect-video">
                                                {videoId ? (
                                                    <iframe
                                                        width="100%" height="100%"
                                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`}
                                                        allow="autoplay; encrypted-media"
                                                        allowFullScreen
                                                        className="w-full h-full border-0"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-indigo-400 font-black uppercase text-[10px]">
                                                        <Loader2 className="animate-spin" size={24} />
                                                        <span>Syncing Stream...</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center space-y-4 max-w-md">
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-black text-slate-900 tracking-tighter uppercase italic">Visual Sync Protocol</h4>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] opacity-80">Observe the architectural flow to authorize mastery phase.</p>
                                                </div>
                                                <Button
                                                    onClick={() => handleNextTab("video")}
                                                    className="h-11 px-10 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md"
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${active
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                    : unlocked
                        ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        : "text-slate-200 pointer-events-none opacity-30"
                }`}
        >
            <span className={active ? "text-indigo-600" : ""}>{icon}</span>
            {label}
        </button>
    );
}

/* 🎮 Elite Sync Evaluation: Balanced & Professional Intercept Game */
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
            speed: 0.1,
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
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#4f46e5', '#ffffff'] });
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
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Shield size={32} className="text-red-500" />
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-800">Protocol Breached</h3>
                <Button onClick={() => { setStep(0); setLives(3); setScore(0); setIsGameOver(false); }} className="h-9 px-6 bg-slate-900 text-white rounded text-[9px] font-black uppercase">Re-Initialise</Button>
            </div>
        );
    }

    if (isFinished) {
        const percent = Math.min(100, Math.round((score / (questions.length * 25)) * 100));
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
                <Trophy size={48} className="text-indigo-600 animate-bounce" />
                <div className="text-center space-y-0.5">
                    <h3 className="text-lg font-black uppercase italic tracking-tight">Sync Completed</h3>
                    <p className="text-sm font-black text-indigo-600 italic tracking-widest">{percent}% Efficiency</p>
                </div>
                <Button onClick={() => onComplete(percent)} className="h-11 px-10 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">Seal Session</Button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col bg-slate-50/20 overflow-hidden">
            <div className="flex justify-between p-6 z-30">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Phase</span>
                    <span className="text-sm font-black italic tabular-nums leading-none mt-1">{step + 1} / {questions.length}</span>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-right flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Sync XP</span>
                        <span className="text-sm font-black text-indigo-600 italic tabular-nums leading-none mt-1">{score}</span>
                    </div>
                </div>
            </div>

            <div className="px-10 z-20">
                <div className="max-w-xl mx-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-lg text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 opacity-20" />
                    <h3 className="text-sm font-black text-slate-900 uppercase italic leading-snug">
                        {q.question}
                    </h3>
                </div>
            </div>

            <div className="flex-1 w-full relative h-full">
                <AnimatePresence>
                    {nodes.map(n => (
                        <motion.button
                            key={`${step}-${n.id}`}
                            onClick={() => handleCatch(n)}
                            animate={{
                                scale: n.clicked ? 0 : 1,
                                opacity: n.clicked ? 0 : 1,
                                top: `${n.y}%`,
                                left: `${10 + (n.lane * 26.6)}%`
                            }}
                            className={`absolute translate-x-[-50%] flex items-center justify-center p-4 rounded-xl text-white shadow-xl bg-gradient-to-br ${n.color} border border-white/20 w-[170px] h-[75px] active:scale-90 transition-transform`}
                        >
                            <span className="text-[9px] font-black uppercase text-center leading-tight px-1">{n.text}</span>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/5 rounded-full blur-md" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 flex justify-center z-30">
                <div className="bg-white/90 backdrop-blur px-5 py-2 rounded-full border border-slate-100 shadow-md flex items-center gap-2">
                    <Rocket size={12} className="text-indigo-600" />
                    <span className="text-[8px] font-black text-slate-500 uppercase italic">Select valid Hub Node</span>
                </div>
            </div>
        </div>
    );
}
