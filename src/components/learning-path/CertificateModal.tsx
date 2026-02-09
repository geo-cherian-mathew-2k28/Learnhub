"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ShieldCheck, Award } from "lucide-react";
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
            <DialogContent className="max-w-xl w-full p-0 bg-transparent border-none shadow-none z-[10001] h-[90vh] overflow-hidden flex flex-col items-center justify-center no-print">
                <DialogTitle className="sr-only">Completion Certificate for {pathTitle}</DialogTitle>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="relative w-full flex flex-col items-center gap-6"
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
                                        padding: 80px !important;
                                        background: #010411 !important;
                                        z-index: 99999 !important;
                                        display: flex !important;
                                        flex-direction: column !important;
                                        justify-content: space-between !important;
                                        align-items: center !important;
                                    }
                                    .no-print {
                                        display: none !important;
                                    }
                                }
                            `}</style>

                            <div className="absolute inset-0 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none" />

                            {/* 🔘 High-Contrast Close Trigger - Anchor Locked */}
                            <div className="w-full flex justify-end mb-[-20px] relative z-20">
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-[#010411] text-white/40 hover:text-white rounded-full border border-white/10 hover:bg-slate-900 transition-all shadow-xl backdrop-blur-md"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* 🏆 The Certificate Artifact: Elite Compact Scale */}
                            <div
                                ref={certRef}
                                className="printable-cert relative w-full aspect-[1.414/1] bg-[#010411] rounded-[1rem] p-8 md:p-10 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center justify-between text-center"
                            >
                                {/* Tech Accents */}
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-40" />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

                                {/* Header Section */}
                                <div className="relative z-10 space-y-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Award size={16} className="text-indigo-500" />
                                    </div>
                                    <p className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.4em]">Official Mastery Protocol</p>
                                    <h1 className="text-white text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                        Certificate <br /> of Velocity
                                    </h1>
                                </div>

                                {/* Core Content Layer */}
                                <div className="relative z-10 space-y-4 w-full">
                                    <div className="space-y-1">
                                        <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[6px]">The Academy authorizes</p>
                                        <h2 className="text-white text-2xl md:text-4xl font-black tracking-tighter italic uppercase leading-none">
                                            {userData.username || "Scholar"}
                                        </h2>
                                        <div className="flex justify-center mt-1">
                                            <div className="h-0.5 w-16 bg-indigo-600/60 rounded-full" />
                                        </div>
                                    </div>

                                    <p className="text-white/40 font-bold text-[10px] leading-relaxed italic px-4">
                                        For professional execution in <br />
                                        <span className="text-white font-black uppercase tracking-tight not-italic">"{pathTitle}"</span>
                                    </p>
                                </div>

                                {/* Authenticated Footer */}
                                <div className="relative z-10 w-full flex items-end justify-between px-2">
                                    <div className="text-left space-y-1">
                                        <div className="w-16 h-[0.5px] bg-white/10" />
                                        <p className="text-[7px] font-black text-white/40 uppercase tracking-widest leading-none">Director</p>
                                    </div>

                                    <div className="relative mb-[-4px]">
                                        <div className="w-10 h-10 bg-[#010101] rounded-xl flex items-center justify-center border border-white/5 shadow-2xl">
                                            <ShieldCheck size={20} className="text-indigo-600" />
                                        </div>
                                    </div>

                                    <div className="text-right space-y-1 flex flex-col items-end">
                                        <div className="w-16 h-[0.5px] bg-white/10" />
                                        <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest leading-none">SYNCED</p>
                                        <p className="text-[5px] font-black text-white/10 uppercase italic mt-1">By Geo Cherian Mathew</p>
                                    </div>
                                </div>
                            </div>

                            {/* ⚡ Interaction Command: High-Contrast Alignment */}
                            <div className="w-full">
                                <Button
                                    onClick={handleDownload}
                                    className="w-full h-12 bg-white text-black rounded-lg text-sm font-black uppercase tracking-[0.1em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                                    Save Credentials
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
