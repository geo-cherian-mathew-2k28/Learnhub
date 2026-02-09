"use client";

import { useAuth } from "@/lib/AuthContext";
import { LogOut, Layers } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function Navbar() {
    const { user, signOut } = useAuth();
    const { scrollY } = useScroll();

    const bgOpacity = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.98)"]);
    const borderOpacity = useTransform(scrollY, [0, 50], ["rgba(241, 245, 249, 0)", "rgba(241, 245, 249, 1)"]);
    const shadowOpacity = useTransform(scrollY, [0, 50], ["0 0 0 rgba(0,0,0,0)", "0 10px 30px rgba(0,0,0,0.02)"]);

    return (
        <motion.header
            style={{ backgroundColor: bgOpacity, borderBottomColor: borderOpacity, boxShadow: shadowOpacity }}
            className="fixed top-0 left-0 right-0 z-[100] h-16 border-b backdrop-blur-xl transition-all"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-10 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:rotate-6">
                        <Layers size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">LearnHub</span>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest pl-0.5 -mt-0.5">By Geo Cherian Mathew</span>
                    </div>
                </Link>

                <div className="flex items-center gap-8">
                    {user ? (
                        <>
                            <nav className="hidden lg:flex items-center gap-4">
                                <NavLink href="/path/kafka" label="Curriculum" active />
                            </nav>

                            <div className="h-4 w-px bg-slate-100 mx-2" />

                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-red-500 transition-all uppercase tracking-[0.3em]"
                            >
                                Sign Out <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <Link href="/auth">
                            <button className="px-8 h-10 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-indigo-600 transition-all">
                                Join Now
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
    );
}

function NavLink({ href, label, active = false }: { href: string, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
        >
            {label}
            <div className={`absolute bottom-0 left-4 right-4 h-[2px] bg-indigo-600 transition-transform origin-center ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
        </Link>
    );
}
