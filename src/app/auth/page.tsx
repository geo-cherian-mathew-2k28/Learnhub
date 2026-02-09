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
                        throw new Error("Check your email Hero! ✉️ You need to click the magic link we sent you to start.");
                    }
                    if (signInError.message.includes("Invalid login credentials")) {
                        throw new Error("Invalid credentials. 🔑 If you haven't signed up yet, click 'Sign Up' below.");
                    }
                    throw signInError;
                }
                router.push("/path/kafka");
            } else {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                    options: {
                        data: { full_name: name || cleanEmail.split('@')[0] },
                        emailRedirectTo: `${window.location.origin}/path/kafka`
                    },
                });

                if (signUpError) {
                    if (signUpError.message.includes("User already registered")) {
                        throw new Error("You already have an account! 🛡️ Please try to Sign In instead.");
                    }
                    throw signUpError;
                }

                // Create the profile artifact immediately
                if (data.user) {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        username: name || cleanEmail.split('@')[0],
                        xp_points: 0,
                        streak_count: 0
                    }, { onConflict: 'id' });
                }

                // ⚡ Instant Access: Auto-SignIn to bypass email confirmation
                const { error: autoLoginError } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });

                if (autoLoginError) throw autoLoginError;

                setSuccess(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#4F46E5', '#06B6D4', '#FFFFFF']
                });

                // Redirect to dashboard after a short delay
                setTimeout(() => router.push("/path/kafka"), 2000);
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || "Something went wrong! Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Visual Side */}
            <div className="hidden md:flex md:w-5/12 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 text-white space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
                            <Sparkles size={40} className="text-white" />
                        </div>
                        <h1 className="text-6xl font-black leading-tight tracking-tight italic uppercase">Access<br />Mastery.</h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-sm italic">
                            Enter the global terminal of specialized engineering.
                        </p>
                    </motion.div>

                    <div className="space-y-6 pt-10 border-t border-white/10">
                        {[
                            "Verified Professional Credentials",
                            "Direct Access to Expert Paths",
                            "High-Fidelity Learning Hub"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-slate-300">
                                <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="font-bold text-sm tracking-wide uppercase italic">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-16 bg-white overflow-y-auto">
                <div className="w-full max-w-[480px]">
                    <div className="mb-12">
                        {/* 🔘 Segmented Tab Switcher */}
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-12">
                            <button
                                onClick={() => { setIsLogin(true); setError(null); }}
                                className={`flex-1 py-3.5 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <LogIn size={12} className="md:size-14" /> Sign In
                                </div>
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(null); }}
                                className={`flex-1 py-3.5 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <UserPlus size={12} className="md:size-14" /> Sign Up
                                </div>
                            </button>
                        </div>

                        <motion.h2
                            key={isLogin ? "login-title" : "signup-title"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase"
                        >
                            {isLogin ? "Welcome Back" : "Deploy Account"}
                        </motion.h2>
                        <p className="text-slate-500 font-bold text-lg leading-relaxed uppercase tracking-tighter italic">
                            {isLogin
                                ? "Resume your cognitive synchronization."
                                : "Start your path to architectural mastery."}
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
                                <div className="flex items-center gap-4 mb-2">
                                    <CheckCircle2 size={24} className="text-green-600" />
                                    <p className="text-xl font-black tracking-tight uppercase italic">Entry Authorized!</p>
                                </div>
                                <p className="font-bold text-slate-600 leading-relaxed pl-10 text-sm">
                                    Your cognitive synchronization is complete. Initializing dashboard...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Display Name</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 md:px-14 py-3.5 md:py-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-800 text-base md:text-lg shadow-sm"
                                        placeholder="Enter your name"
                                    />
                                    <UserPlus className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Protocol Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 md:px-14 py-3.5 md:py-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-800 text-base md:text-lg shadow-sm"
                                    placeholder="your@email.com"
                                />
                                <Mail className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Master Passkey</label>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 md:px-14 py-3.5 md:py-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-800 text-base md:text-lg shadow-sm"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {isLogin ? "Authenticate" : "Initialize Agent"} <ChevronRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">LearnHub Academy Global Terminal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
