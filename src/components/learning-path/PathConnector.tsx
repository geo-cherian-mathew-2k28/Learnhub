"use client";

import { motion } from "framer-motion";

export function PathConnector({ count }: { count: number }) {
    // A simple vertical path with slight zig-zag
    const nodeGap = 160;
    const points = [];

    for (let i = 0; i < count; i++) {
        const x = i % 2 === 0 ? 30 : 70;
        points.push({ x, y: 50 + (i * 150) });
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cp1y = curr.y + 75;
        const cp2y = next.y - 75;
        d += ` C ${curr.x} ${cp1y}, ${next.x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <svg
                className="w-full h-full opacity-20"
                viewBox="0 0 100 1500"
                preserveAspectRatio="none"
            >
                <path
                    d={d}
                    fill="none"
                    stroke="#FF7E29"
                    strokeWidth="4"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
