"use client";

import { useAuth } from "@/lib/AuthContext";
import { LogOut, User, LayoutGrid, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
    const { user, signOut } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
            <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-orange-100 rounded-[2rem] px-6 h-16 flex items-center justify-between shadow-lg shadow-orange-100/20">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-byjus rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tighter">LearnHub</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/path/kafka" className="text-sm font-black text-slate-500 hover:text-orange-500 uppercase tracking-widest transition-colors flex items-center gap-2">
                        <LayoutGrid size={16} /> Academy
                    </Link>
                    <Link href="/" className="text-sm font-black text-slate-500 hover:text-orange-500 uppercase tracking-widest transition-colors flex items-center gap-2">
                        <Sparkles size={16} /> Roadmap
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/path/kafka" className="bg-orange-50 text-orange-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-100 transition-all">My Journey</Link>
                            <button
                                onClick={() => signOut()}
                                className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-byjus text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-100"
                            >
                                Join Academy
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
