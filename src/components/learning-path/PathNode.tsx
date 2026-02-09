"use client";

import { motion } from "framer-motion";
import { Play, PlayCircle, Lock, CheckCircle2, Star, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathNodeProps {
    status: "locked" | "unlocked" | "completed";
    type: "video" | "quiz" | "article" | "concept";
    title: string;
    points: number;
    onClick: () => void;
    index: number;
}

export function PathNode({ status, type, title, points, onClick, index }: PathNodeProps) {
    const isLocked = status === "locked";
    const isCompleted = status === "completed";
    const isUnlocked = status === "unlocked";

    // Alternative sides for desktop, centered for mobile
    const placement = index % 2 === 0 ? "md:justify-start md:pl-[15%]" : "md:justify-end md:pr-[15%]";

    return (
        <div className={cn("relative z-10 flex w-full justify-center", placement)}>
            {/* Desktop-only connector dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full hidden md:block border-4 border-white shadow-inner" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={!isLocked ? onClick : undefined}
                className={cn(
                    "relative group flex flex-col items-center cursor-pointer",
                    isLocked && "opacity-40 cursor-not-allowed grayscale"
                )}
            >
                {/* --- FLOATING XP BADGE --- */}
                {!isLocked && (
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-10 bg-slate-900 px-4 py-1.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 z-30"
                    >
                        <Sparkles size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-black text-white tracking-widest">+{points} XP</span>
                    </motion.div>
                )}

                {/* --- MAIN CONCEPT BUBBLE (Premium 3D Look) --- */}
                <div className={cn(
                    "w-32 h-32 md:w-40 md:h-40 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center p-2 border-[10px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] transition-all duration-700",
                    isLocked ? "bg-slate-300" : "bg-slate-900 group-hover:shadow-orange-500/20",
                    isCompleted && "bg-gradient-to-br from-green-600 to-green-500 shadow-green-500/20 border-green-50",
                    isUnlocked && "ring-[15px] ring-orange-500/10 animate-pulse"
                )}>
                    <div className="w-full h-full rounded-[2.5rem] md:rounded-[3.2rem] flex items-center justify-center relative overflow-hidden">
                        {/* 3D Glossy Overlays */}
                        <div className="absolute top-2 left-6 w-16 h-8 bg-white/10 rounded-full blur-xl -rotate-12 pointer-events-none" />

                        {isLocked ? (
                            <Lock className="text-slate-500 w-12 h-12" />
                        ) : isCompleted ? (
                            <CheckCircle2 className="text-white w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" strokeWidth={3} />
                        ) : (
                            <motion.div
                                animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="relative z-10"
                            >
                                {type === 'video' && <PlayCircle className="text-orange-500 w-20 h-20 md:w-24 md:h-24 fill-orange-500/10" strokeWidth={1.5} />}
                                {type === 'quiz' && <Star className="text-orange-500 fill-orange-500 w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />}
                                {type === 'concept' && <Sparkles className="text-orange-500 w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />}
                                {type === 'article' && <BookOpen className="text-orange-500 w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* --- LABEL CARD --- */}
                <div className={cn(
                    "mt-8 px-8 py-4 rounded-[2rem] shadow-2xl border transition-all duration-500 flex flex-col items-center min-w-[200px] max-w-[240px]",
                    isLocked ? "bg-slate-50 border-slate-100" : "bg-white border-orange-50 group-hover:border-orange-500/30 group-hover:shadow-orange-500/10"
                )}>
                    <h3 className="text-base font-black text-slate-900 leading-tight mb-2 tracking-tight">{title}</h3>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            isLocked ? "bg-slate-300" : isCompleted ? "bg-green-500" : "bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                        )} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{type} session</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
