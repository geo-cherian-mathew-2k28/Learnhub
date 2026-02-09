"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        username: string;
        xp_points: number;
    };
    pathTitle: string;
}

export function CertificateModal({ isOpen, onClose, userData, pathTitle }: CertificateModalProps) {
    const certRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none shadow-none z-[10001] h-[85vh] overflow-hidden flex items-center justify-center">
                {/* ♿ Radix UI Accessibility Requirement: Hidden Title */}
                <DialogTitle className="sr-only">Completion Certificate for {pathTitle}</DialogTitle>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full h-full flex flex-col items-center justify-center p-6 lg:p-10 print:p-0"
                        >
                            <style jsx global>{`
                                @media print {
                                    @page {
                                        size: A4 landscape;
                                        margin: 0;
                                    }
                                    body * {
                                        visibility: hidden;
                                    }
                                    .printable-cert, .printable-cert * {
                                        visibility: visible !important;
                                        -webkit-print-color-adjust: exact !important;
                                        print-color-adjust: exact !important;
                                    }
                                    .printable-cert {
                                        position: fixed !important;
                                        left: 0 !important;
                                        top: 0 !important;
                                        width: 100vw !important;
                                        height: 100vh !important;
                                        margin: 0 !important;
                                        padding: 60px !important;
                                        border: none !important;
                                        border-radius: 0 !important;
                                        display: flex !important;
                                        flex-direction: column !important;
                                        justify-content: space-between !important;
                                        background: #020617 !important;
                                        z-index: 99999 !important;
                                    }
                                    .no-print {
                                        display: none !important;
                                    }
                                }
                            `}</style>

                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none no-print" />

                            <button
                                onClick={onClose}
                                className="absolute top-0 right-0 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all z-50 text-white/40 hover:text-white border border-white/5 no-print"
                            >
                                <X size={20} />
                            </button>

                            {/* 💎 The Lumina Certificate - Scaled for high-end visibility */}
                            <div
                                ref={certRef}
                                className="printable-cert relative w-full max-w-3xl aspect-[1.414/1] bg-[#020617] rounded-[2rem] p-10 md:p-12 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 flex flex-col items-center justify-between text-center"
                            >
                                {/* Background Tech Ornaments */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500" />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] border border-white/[0.02] rounded-full pointer-events-none" />

                                <div className="relative z-10 space-y-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-500/50" />
                                        <Cpu size={24} className="text-indigo-400" />
                                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-500/50" />
                                    </div>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Credential Verification Node</p>
                                    <h1 className="text-white text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.9] bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                        Certificate <br /> of Velocity
                                    </h1>
                                </div>

                                <div className="relative z-10 space-y-3">
                                    <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px]">Recognizing the synchronization of</p>
                                    <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter italic uppercase underline decoration-indigo-600 decoration-[6px] underline-offset-[10px]">
                                        {userData.username || "Scholar Unknown"}
                                    </h2>
                                </div>

                                <div className="relative z-10 max-w-lg px-2">
                                    <p className="text-white/40 font-medium text-sm leading-relaxed italic">
                                        Successfully finalized the intensive architecture curriculum of
                                        <span className="text-indigo-400 font-extrabold mx-1.5 not-italic">"{pathTitle}"</span>
                                        at LearnHub Academy. Demonstrating professional mastery in distributed architectures and real-time data sync.
                                    </p>
                                </div>

                                <div className="relative z-10 w-full flex items-end justify-between px-2">
                                    <div className="text-left space-y-2">
                                        <div className="w-24 h-0.5 bg-white/10" />
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Protocol Lead</p>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-xl flex items-center justify-center border-4 border-[#020617] relative z-10 shadow-xl transition-transform hover:scale-105">
                                            <ShieldCheck size={36} className="text-white" />
                                        </div>
                                    </div>

                                    <div className="text-right space-y-2">
                                        <div className="w-24 h-0.5 bg-white/10" />
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">ID: {userData.xp_points}-SYNC</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4 w-full max-w-3xl no-print">
                                <Button
                                    onClick={handleDownload}
                                    className="w-full h-14 bg-white text-[#010101] rounded-xl text-base font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                                >
                                    <Download size={18} className="mr-3" /> Save Credentials
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
