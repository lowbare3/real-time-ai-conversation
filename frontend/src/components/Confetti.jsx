import { useMemo } from "react";
import "./Confetti.css";

export default function Confetti({ active, reason }) {
    const particles = useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 1,
            duration: 2 + Math.random() * 2,
            color: [
                "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
                "#FFEAA7", "#DDA0DD", "#FF8C00", "#7B68EE",
                "#FF69B4", "#00CED1", "#FFD700", "#98FB98",
            ][i % 12],
            size: 6 + Math.random() * 8,
            rotation: Math.random() * 360,
            shape: ["square", "circle", "triangle"][i % 3],
        }));
    }, []);

    if (!active) return null;

    return (
        <div className="confetti-container">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`confetti-particle confetti-${p.shape}`}
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        backgroundColor: p.shape !== "triangle" ? p.color : "transparent",
                        borderBottomColor: p.shape === "triangle" ? p.color : undefined,
                        width: p.shape !== "triangle" ? `${p.size}px` : 0,
                        height: p.shape !== "triangle" ? `${p.size}px` : 0,
                        borderWidth: p.shape === "triangle" ? `${p.size}px ${p.size / 2}px 0` : undefined,
                        "--rotation": `${p.rotation}deg`,
                    }}
                />
            ))}
            {reason && <div className="confetti-reason">{reason}</div>}
        </div>
    );
}
