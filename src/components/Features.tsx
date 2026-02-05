"use client";

import { motion } from "framer-motion";
import { Gamepad2, Layers, LineChart, ShieldCheck, Zap, Youtube } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Structured Learning Paths",
        description: "No more random videos. Follow a curated sequence of modules designed for mastery.",
        color: "text-blue-500",
    },
    {
        icon: Gamepad2,
        title: "Gamified Experience",
        description: "Earn XP, unlock badges, and maintain streaks. Learning feels like playing a game.",
        color: "text-purple-500",
    },
    {
        icon: Youtube,
        title: "Embedded Content",
        description: "Watch videos directly inside the app with distraction-free playback tracking.",
        color: "text-red-500",
    },
    {
        icon: LineChart,
        title: "Detailed Analytics",
        description: "Track your progress with precision. Visualize your journey and drop-off points.",
        color: "text-green-500",
    },
    {
        icon: Zap,
        title: "Interactive Quizzes",
        description: "Test your knowledge immediately after watching. Active recall boosts retention.",
        color: "text-yellow-500",
    },
    {
        icon: ShieldCheck,
        title: "Creator Controls",
        description: "Build paths, set rules, and control access. You own the learning experience.",
        color: "text-teal-500",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-black/50">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4">
                        Why Pathly?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Traditional learning platforms are boring and unstructured. We fixed that.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-primary/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <div className="relative z-10">
                                <div className={`mb-4 p-3 rounded-xl bg-white/5 w-fit ${feature.color}`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
