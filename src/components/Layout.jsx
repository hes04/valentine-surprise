import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const Layout = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio('https://cdn.pixabay.com/audio/2024/11/28/audio_3eff3beca4.mp3'));

    useEffect(() => {
        audio.loop = true;
        if (isPlaying) {
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
        return () => audio.pause();
    }, [isPlaying, audio]);

    // Generate random floating hearts
    const hearts = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 30 + 20,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 10,
    }));

    return (
        <div className="app-layout">
            {/* Ambient Glows */}
            <div className="glow-orb glow-orb-1" />
            <div className="glow-orb glow-orb-2" />
            <div className="glow-orb glow-orb-3" />

            {/* Floating Hearts */}
            <div className="floating-hearts-bg">
                {hearts.map(h => (
                    <div
                        key={h.id}
                        className="floating-heart"
                        style={{
                            left: `${h.left}%`,
                            fontSize: `${h.size}px`,
                            animationDuration: `${h.duration}s`,
                            animationDelay: `${h.delay}s`,
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            {/* Navbar */}
            <nav className="navbar">
                <span className="navbar-title">💕 Valentine Surprise</span>
                <button className="music-btn" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? '🎵' : '🔇'}
                </button>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default Layout;
