"use client";

import { motion } from "framer-motion";
import { Play, PlayCircle, Lock, CheckCircle2, Star, BookOpen, Sparkles, Zap } from "lucide-react";
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

    const placement = index % 2 === 0 ? "justify-center md:justify-start md:pl-[20%]" : "justify-center md:justify-end md:pr-[20%]";

    return (
        <div className={cn("relative z-10 flex w-full", placement)}>
            <motion.div
                whileHover={!isLocked ? { scale: 1.08, y: -5 } : {}}
                whileTap={!isLocked ? { scale: 0.92 } : {}}
                onClick={!isLocked ? onClick : undefined}
                className={cn(
                    "relative group flex flex-col items-center cursor-pointer",
                    isLocked && "opacity-50 cursor-not-allowed grayscale"
                )}
            >
                {/* --- FLOATING XP BADGE --- */}
                {!isLocked && (
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-8 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-orange-100 flex items-center gap-1.5 z-30"
                    >
                        <Zap size={12} className="text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-black text-orange-600">+{points} XP</span>
                    </motion.div>
                )}

                {/* --- MAIN CONCEPT BUBBLE (BYJUS PLANET) --- */}
                <div className={cn(
                    "w-28 h-28 md:w-36 md:h-36 rounded-[3.5rem] flex items-center justify-center p-1.5 border-8 border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500",
                    isLocked ? "bg-slate-200" : "bg-gradient-to-br from-[#FF7E29] to-[#FF4D00]",
                    isCompleted && "bg-gradient-to-br from-[#00C853] to-[#00E676] shadow-green-200",
                    isUnlocked && "ring-[12px] ring-orange-100 animate-[pulse_4s_infinite]"
                )}>
                    <div className="w-full h-full rounded-[2.8rem] flex items-center justify-center relative overflow-hidden">
                        {/* --- INNER SPECULAR HIGHLIGHT (3D LOOK) --- */}
                        <div className="absolute top-2 left-4 w-12 h-6 bg-white/30 rounded-full blur-md -rotate-12 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/10 rounded-b-full pointer-events-none" />

                        {isLocked ? (
                            <Lock className="text-slate-400 w-12 h-12" />
                        ) : isCompleted ? (
                            <CheckCircle2 className="text-white w-20 h-20 drop-shadow-lg" />
                        ) : (
                            <motion.div
                                animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]"
                            >
                                {type === 'video' && <PlayCircle className="text-white w-16 h-16" />}
                                {type === 'quiz' && <Star className="text-white fill-white w-16 h-16" />}
                                {type === 'concept' && <Sparkles className="text-white w-16 h-16" />}
                                {type === 'article' && <BookOpen className="text-white w-16 h-16" />}
                            </motion.div>
                        )}

                        {/* --- ROTATING SHIMMER EFFECT --- */}
                        {isUnlocked && (
                            <div className="absolute inset-0 shimmer opacity-20" />
                        )}
                    </div>
                </div>

                {/* --- LABEL CARD --- */}
                <div className="mt-6 bg-white px-8 py-3.5 rounded-[2rem] shadow-xl border border-orange-50 text-center min-w-[180px] max-w-[220px] transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(255,126,41,0.1)]">
                    <h3 className="text-[15px] font-black text-slate-800 leading-tight mb-1">{title}</h3>
                    <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isLocked ? "bg-slate-300" : isCompleted ? "bg-green-500" : "bg-orange-500")} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{type} session</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
