"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, Loader2, ChevronRight, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import confetti from "canvas-confetti";

export default function EntryPage() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // If user is already logged in, redirect to the default path
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/path/kafka");
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const cleanEmail = email.trim();

    try {
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
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (signInError) throw signInError;
          router.push("/path/kafka");
          return;
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
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Loader2 className="text-orange-500 animate-spin" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-orange-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20"
          >
            <Sparkles size={40} className="text-white fill-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            LearnHub <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Academy.</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            Master specialized technologies at <br className="hidden md:block" /> extreme scale.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-2xl border border-red-500/20 mb-6 flex items-start gap-3"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="font-bold text-xs">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-500/10 text-green-400 p-6 rounded-3xl border border-green-500/20 mb-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} />
                  <p className="font-black text-sm">Welcome Hero!</p>
                </div>
                <p className="text-xs font-medium text-slate-300 pl-8">
                  Check your email for a magic link to verify your entry, or wait to be redirected.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Your Name</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-12 py-4 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold text-white text-base"
                  placeholder="e.g. Satoshi"
                />
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-12 py-4 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold text-white text-base"
                  placeholder="hero@learnhub.io"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-12 py-4 focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-bold text-white text-base"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-orange-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Enter Academy <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center pt-4">
          <p className="text-slate-500 text-sm font-medium">
            By entering, you join a global community of specialists.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
