import React, { useState, useEffect } from 'react';

const Welcome = ({ onStart }) => {
    const fullMessage = "Hey Bulu buluuu... 💖 Something very special just for you!";
    const [text, setText] = useState("");
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullMessage.slice(0, i));
            i++;
            if (i > fullMessage.length) {
                clearInterval(interval);
                setTimeout(() => setShowButton(true), 400);
            }
        }, 55);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card fade-in" style={{ textAlign: 'center' }}>
            <div className="welcome-icon-wrap">
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>

            <h1 className="welcome-title">Hello My Love</h1>

            <div className="typing-text">
                <span>{text}<span className="cursor-blink" /></span>
            </div>

            {showButton && (
                <div className="fade-in" style={{ marginTop: '32px' }}>
                    <button className="btn-primary" onClick={onStart}>
                        Start Surprise ✨
                    </button>
                </div>
            )}
        </div>
    );
};

export default Welcome;
