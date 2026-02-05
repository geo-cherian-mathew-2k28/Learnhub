"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PlayCircle, Trophy, Users } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-primary mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span>The Future of Learning is Here</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            Master Any Skill with <br />
                            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                Gamified Paths
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Create, share, and follow structured learning journeys. Turn passive watching into active mastery with interactive quizzes, challenges, and rewards.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button size="lg" variant="premium" className="h-12 px-8 text-lg">
                            Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="glass" className="h-12 px-8 text-lg">
                            <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
                        </Button>
                    </motion.div>

                    {/* Stats / Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/10 pt-8"
                    >
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                <Users className="h-6 w-6 text-secondary" />
                                <span>10k+</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Active Learners</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                <Trophy className="h-6 w-6 text-accent" />
                                <span>500+</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Gamified Paths</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                <span className="text-primary">95%</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
