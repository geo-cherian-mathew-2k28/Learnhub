"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { LearningUnit, QuizQuestion } from "@/lib/data/types";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, PlayCircle, Star, Sparkles, ChevronRight, Layout, HelpCircle, Trophy, Loader2, BookOpen, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface UnitModalProps {
    unit: LearningUnit | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (unitId: string, earnedXp: number) => void;
}

type TabType = "concept" | "video" | "quiz";

export function UnitModal({ unit, isOpen, onClose, onComplete }: UnitModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("concept");
    const [videoLoading, setVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        if (isOpen && unit) {
            // Auto-select tab based on unit type
            if (unit.type === "video") setActiveTab("video");
            else if (unit.type === "quiz") setActiveTab("quiz");
            else setActiveTab("concept");

            setVideoLoading(true);
            setVideoError(false);
            setStartTime(Date.now());
        }
    }, [isOpen, unit]);

    if (!unit) return null;

    const getVideoId = (url: string) => {
        if (!url) return null;
        try {
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
            return match ? match[1] : null;
        } catch (e) {
            return null;
        }
    };

    const videoId = getVideoId(unit.contentUrl || "");

    const handleFinalComplete = (quizScore: number = 100) => {
        // Calculate dynamic XP based on time and score
        const timeSpentSeconds = (Date.now() - startTime) / 1000;
        const timeBonus = Math.min(20, Math.floor(timeSpentSeconds / 10)); // Max 20 XP bonus for engagement
        const finalXp = Math.floor(unit.xpPoints * (quizScore / 100)) + timeBonus;

        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#FF7E29', '#00C853', '#FFFFFF']
        });
        onComplete(unit.id, finalXp);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl w-full p-0 bg-transparent border-none shadow-none focus:outline-none z-[10001] h-[100dvh] sm:h-[90vh] overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative sm:mx-4 border-2 md:border-4 border-white h-full flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-slate-900 p-5 md:p-8 text-white relative flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 active:scale-95"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        <div className="flex flex-col gap-4 mr-8">
                            <DialogHeader>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 block">Elite Learning Path</span>
                                    <DialogTitle className="text-xl md:text-3xl font-black tracking-tight leading-tight">{unit.title}</DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Details about {unit.title} including lessons, video, and assessment.
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10 w-fit">
                                {(["concept", "video", "quiz"] as const).map(tab => {
                                    const isAvailable = (tab === 'concept' && unit.conceptInfo) ||
                                        (tab === 'video' && unit.contentUrl) ||
                                        (tab === 'quiz' && (unit.quizQuestions || unit.type === 'quiz'));

                                    if (!isAvailable) return null;

                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 md:px-6 md:py-2.5 rounded-lg text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                                ? "bg-byjus text-white shadow-lg"
                                                : "text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 md:p-12 bg-[#FDFCFB]">
                        <AnimatePresence mode="wait">
                            {activeTab === "concept" && (
                                <motion.div key="concept" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                                    <div className="space-y-3">
                                        <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">{unit.conceptInfo?.title || "Overview"}</h3>
                                        <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">{unit.conceptInfo?.description || unit.description}</p>
                                    </div>

                                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-premium group overflow-hidden">
                                        {/* Architecture Visual */}
                                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-center py-6">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl md:rounded-3xl border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 text-base md:text-xl shadow-inner group-hover:border-orange-200 transition-colors">PRODUCER</div>
                                            </div>

                                            <div className="flex md:flex-col items-center gap-2">
                                                <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-orange-500">
                                                    <ChevronRight size={32} strokeWidth={3} className="md:rotate-0 rotate-90" />
                                                </motion.div>
                                            </div>

                                            <div className="w-28 h-28 md:w-40 md:h-40 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-4 border-white flex flex-col items-center justify-center text-white relative">
                                                <Layout size={32} strokeWidth={2.5} className="md:size-12 text-orange-500 mb-1" />
                                                <span className="text-[9px] md:text-sm font-black tracking-[0.2em]">{unit.title.split(' ')[0].toUpperCase()}</span>
                                            </div>

                                            <div className="flex md:flex-col items-center gap-2">
                                                <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} className="text-green-500">
                                                    <ChevronRight size={32} strokeWidth={3} className="md:rotate-0 rotate-90" />
                                                </motion.div>
                                            </div>

                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl md:rounded-3xl border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 text-base md:text-xl shadow-inner group-hover:border-green-200 transition-colors">CONSUMER</div>
                                            </div>
                                        </div>
                                    </div>

                                    {unit.conceptInfo?.points && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {unit.conceptInfo.points.map((p, i) => (
                                                <div key={i} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 rounded-lg md:rounded-xl flex items-center justify-center text-orange-500 shrink-0"><BookOpen size={18} strokeWidth={2.5} /></div>
                                                    <span className="text-sm md:text-[15px] font-bold text-slate-600 leading-relaxed pt-0.5">{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => {
                                            if (unit.contentUrl) setActiveTab("video");
                                            else if (unit.quizQuestions) setActiveTab("quiz");
                                            else handleFinalComplete();
                                        }}
                                        className="w-full bg-slate-900 text-white h-16 md:h-24 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-byjus transition-all text-base md:text-xl mt-6"
                                    >
                                        Next Phase <ChevronRight className="ml-2" size={20} />
                                    </Button>
                                </motion.div>
                            )}

                            {activeTab === "video" && (
                                <motion.div key="video" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-10">
                                    <div className="aspect-video bg-black rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative border-[4px] md:border-[12px] border-white group/video">
                                        {videoId ? (
                                            <>
                                                {videoLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10 transition-opacity">
                                                        <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col md:flex-row items-end justify-between gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="text-white">
                                                        <h4 className="font-black text-sm md:text-lg tracking-tight">System Concept: {unit.title}</h4>
                                                        <p className="text-xs text-white/60 font-medium tracking-widest uppercase">Elite Academy Source</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                                                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 font-black text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-md"
                                                    >
                                                        Watch on YouTube <PlayCircle className="ml-2" size={16} />
                                                    </Button>
                                                </div>

                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                                                    title="Academy Session"
                                                    onLoad={() => {
                                                        console.log("Video Frame Loaded:", videoId);
                                                        setVideoLoading(false);
                                                    }}
                                                    onError={() => {
                                                        console.error("Video Frame Error:", videoId);
                                                        setVideoError(true);
                                                    }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full relative z-0"
                                                ></iframe>

                                                {/* Fallback Link for restricted environments */}
                                                <div className="absolute bottom-3 right-3 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity">
                                                    <a
                                                        href={`https://www.youtube.com/watch?v=${videoId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl"
                                                    >
                                                        <PlayCircle size={14} /> Open in YouTube
                                                    </a>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-8 text-center uppercase tracking-widest font-black text-xs">
                                                <AlertCircle size={40} className="mb-4 text-orange-400" />
                                                Video Source Not Syncing
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center gap-6 md:gap-8">
                                        <div className="hidden md:flex items-center gap-4 bg-orange-50 px-8 py-4 rounded-full border border-orange-100">
                                            <Sparkles size={18} className="text-orange-500" />
                                            <span className="text-sm font-black text-orange-700 uppercase tracking-widest">Mastered the video? Test your skills!</span>
                                        </div>
                                        <Button onClick={() => setActiveTab("quiz")} className="w-full bg-byjus text-white h-16 md:h-24 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-xl">Start Skills Assessment <Star className="ml-2" fill="currentColor" size={20} /></Button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "quiz" && (
                                <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 md:space-y-8">
                                    {unit.quizQuestions ? (
                                        <QuizLogic questions={unit.quizQuestions} onComplete={handleFinalComplete} />
                                    ) : (
                                        <div className="text-center py-12 md:py-24 space-y-8 md:space-y-10">
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-yellow-400 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center mx-auto text-white shadow-2xl rotate-12 border-8 border-white"><Trophy size={48} className="md:size-[72px]" /></div>
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Mission Accomplished?</h3>
                                            <Button onClick={() => handleFinalComplete(100)} className="w-full max-w-md bg-green-500 text-white h-16 md:h-24 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest shadow-2xl text-base md:text-xl hover:bg-green-600 transition-all">Claim Phase Rewards</Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

function QuizLogic({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const q = questions[step];

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === q.correctAnswer) setCorrectCount(prev => prev + 1);
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
            setSelected(null);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        const score = Math.floor((correctCount / questions.length) * 100);
        return (
            <div className="text-center py-20 space-y-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-48 h-48 bg-green-500 rounded-[4rem] flex items-center justify-center mx-auto text-white border-[12px] border-white shadow-2xl relative">
                    <Trophy size={100} />
                </motion.div>
                <div className="space-y-4">
                    <h3 className="text-5xl font-black text-slate-800 tracking-tighter uppercase">Quest Finished!</h3>
                    <p className="text-slate-400 font-bold text-xl uppercase tracking-[0.4em]">Accuracy: {score}%</p>
                </div>
                <Button onClick={() => onComplete(score)} className="w-full max-w-md bg-orange-600 text-white py-10 rounded-3xl font-black uppercase tracking-widest shadow-2xl text-2xl hover:bg-orange-700 transition-all">Claim Academy Credits</Button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col items-center gap-6">
                <div className="px-8 py-3 bg-slate-900 rounded-full text-[11px] font-black text-white uppercase tracking-[0.4em] shadow-lg">Assessment {step + 1} of {questions.length}</div>
                <h3 className="text-3xl md:text-5xl font-black text-center text-slate-800 tracking-tight leading-[0.9] max-w-3xl">{q.question}</h3>
            </div>

            <div className="grid gap-5">
                {q.options.map((o, i) => (
                    <button
                        key={i}
                        disabled={selected !== null}
                        onClick={() => handleSelect(i)}
                        className={`p-8 rounded-[2.5rem] border-[4px] text-left font-bold text-xl transition-all flex justify-between items-center group ${selected === i
                            ? i === q.correctAnswer
                                ? "bg-green-500 border-green-600 text-white shadow-2xl scale-[1.03]"
                                : "bg-red-500 border-red-600 text-white shadow-2xl"
                            : (selected !== null && i === q.correctAnswer)
                                ? "bg-green-50 border-green-300 text-green-700"
                                : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl"
                            }`}
                    >
                        <span className="flex-1">{o}</span>
                        {selected === i && (
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 border-2 border-white/20">
                                {i === q.correctAnswer ? <Check size={24} strokeWidth={4} /> : <X size={24} strokeWidth={4} />}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {selected !== null && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className={`p-8 rounded-[3rem] border-4 flex gap-6 items-start ${selected === q.correctAnswer ? "bg-green-50 border-green-100 text-green-900" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                            <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${selected === q.correctAnswer ? "bg-green-500 text-white" : "bg-slate-400 text-white"}`}>
                                <HelpCircle size={24} />
                            </div>
                            <p className="text-lg font-bold leading-relaxed">{q.explanation}</p>
                        </div>
                        <Button onClick={handleNext} className="w-full bg-slate-900 text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 text-2xl hover:bg-byjus transition-all">
                            {step < questions.length - 1 ? "Next Analysis" : "Finalize Results"} <ChevronRight size={28} />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
