"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, Loader2, Sparkles, ChevronRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const cleanEmail = email.trim();

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });

                if (signInError) {
                    if (signInError.message.includes("Email not confirmed")) {
                        throw new Error("Check your email Hero! ✉️ You need to click the magic link we sent you to start. (Check your spam folder too!)");
                    }
                    if (signInError.message.includes("Invalid login credentials")) {
                        throw new Error("Invalid password or email. 🔑 If you haven't signed up yet, please click 'Create Account' below!");
                    }
                    throw signInError;
                }
                router.push("/path/kafka");
            } else {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                    options: {
                        data: { full_name: name },
                        emailRedirectTo: `${window.location.origin}/path/kafka`
                    },
                });

                if (signUpError) {
                    if (signUpError.message.includes("User already registered")) {
                        throw new Error("You already have an account! 🛡️ Please try to Sign In instead.");
                    }
                    throw signUpError;
                }

                setSuccess(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FF7E29', '#00C853', '#FFFFFF']
                });

                if (data.user) {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        username: name || cleanEmail.split('@')[0],
                        xp_points: 0,
                        streak_count: 0
                    }, { onConflict: 'id' });
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            let msg = err.message || "Something went wrong! Try again.";
            if (msg.includes("rate limit")) {
                msg = "Whoa, slow down Hero! 🛑 Too many attempts. Please wait 60 seconds and try again.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-orange-100">
            {/* Visual Side */}
            <div className="hidden md:flex md:w-5/12 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 text-white space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-byjus rounded-[2rem] flex items-center justify-center shadow-2xl">
                            <Sparkles size={40} className="text-white" />
                        </div>
                        <h1 className="text-6xl font-black leading-tight tracking-tight">Level Up Your<br />Core Skills.</h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-sm">
                            Access the world's most premium learning curriculum and join a community of top-tier engineers.
                        </p>
                    </motion.div>

                    <div className="space-y-6 pt-10 border-t border-white/10">
                        {[
                            "Real-world Architecture Simulators",
                            "Verified Professional Credentials",
                            "Direct Access to Expert Paths"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-slate-300">
                                <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 shadow-inner">
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <span className="font-bold text-sm tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-16 bg-white">
                <div className="w-full max-w-[480px]">
                    <div className="mb-12">
                        <motion.h2
                            key={isLogin ? "login-title" : "signup-title"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-slate-900 tracking-tighter mb-4"
                        >
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </motion.h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            {isLogin
                                ? "Enter your credentials to continue your journey."
                                : "Join the academy and start your technical mastery."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 mb-10 flex items-start gap-4 shadow-sm"
                            >
                                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                <p className="font-bold text-sm leading-relaxed">{error}</p>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 text-green-700 p-8 rounded-3xl border-2 border-green-100 mb-10 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                                        <Mail size={24} />
                                    </div>
                                    <p className="text-xl font-black tracking-tight">Check Your Inbox!</p>
                                </div>
                                <p className="font-medium text-slate-600 leading-relaxed pl-16">
                                    We've sent a magic link to your email. Click it to verify your account and start learning.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleAuth} className="space-y-8">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-14 py-5 focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 text-lg shadow-sm"
                                        placeholder="Enter your name"
                                    />
                                    <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-14 py-5 focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 text-lg shadow-sm"
                                    placeholder="your@email.com"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                                {isLogin && (
                                    <button type="button" className="text-[11px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot?</button>
                                )}
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-14 py-5 focus:border-slate-900 focus:bg-white outline-none transition-all font-bold text-slate-800 text-lg shadow-sm"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"} <ChevronRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-10 border-t border-slate-100">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-slate-500 font-bold text-lg hover:text-slate-900 transition-colors"
                        >
                            {isLogin ? "Don't have an account?" : "Already have an account?"} <span className="text-orange-600 font-black ml-1 uppercase text-sm tracking-widest">
                                {isLogin ? "Register Now" : "Sign In"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
