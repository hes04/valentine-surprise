import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';

const Surprise = ({ onBack }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showHearts, setShowHearts] = useState(false);

    useEffect(() => {
        // Big confetti burst on load
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const colors = ['#ec407a', '#ab47bc', '#ffd700', '#ff6b9d', '#fff', '#e91e63'];

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors
            });
        }, 80);

        // Stagger message appearance
        setTimeout(() => setShowMessage(true), 800);
        setTimeout(() => setShowHearts(true), 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="surprise-card glass-card fade-in" style={{ position: 'relative' }}>
            <button
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ec407a',
                    zIndex: 10
                }}
            >
                <ArrowLeft size={28} />
            </button>

            <span className="big-emoji">💝</span>

            <h1 className="surprise-title">Happy Valentine's Day!</h1>

            {showMessage && (
                <div className="surprise-message fade-in">
                    <p>
                        My dearest <span className="highlight">Bulu buluuu</span>,
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        You are the most beautiful thing that ever happened to me.
                        Every single day with you feels like a dream I never want to wake up from. 🌙
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        Your smile lights up my entire world, and your laugh is my favorite melody.
                        I fall in love with you more and more every moment. 💫
                    </p>
                    <p style={{ marginTop: '12px' }}>
                        Thank you for being my <span className="highlight">everything</span> —
                        my best friend, my soulmate, and my forever Valentine.
                    </p>
                    <p style={{ marginTop: '16px', fontSize: '1.3rem' }}>
                        I love you to the moon and back 🌙💖
                    </p>
                </div>
            )}

            {showHearts && (
                <div className="fade-in" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, var(--pink-300), var(--gold))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '12px'
                    }}>
                        Forever Yours 💕
                    </p>
                    <div style={{
                        fontSize: '2.5rem',
                        animation: 'heartbeat 1.5s ease-in-out infinite'
                    }}>
                        💖✨💖
                    </div>
                </div>
            )}
        </div>
    );
};

export default Surprise;
