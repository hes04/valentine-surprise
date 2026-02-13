import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

const allQuestions = [
    {
        question: "What is my favorite nickname for you? 🐻",
        options: ["Cutie Pie", "Bulu buluuu", "Honey Bun", "Teddy Bear"],
        correct: "Bulu buluuu"
    },
    {
        question: "Where is our favorite place to be? 🏠",
        options: ["The Mall", "In each other's arms", "Fancy Restaurant", "Movie Theater"],
        correct: "In each other's arms"
    },
    {
        question: "How much do I love you? 💖",
        options: ["To the moon", "Infinity & Beyond", "More than pizza 🍕", "A little bit"],
        correct: "To the moon"
    },
    {
        question: "What makes our relationship special? ✨",
        options: ["Trust & Love", "Late night talks", "We're both crazy 😜", "All of the above 💕"],
        correct: "All of the above 💕"
    },
    {
        question: "What would I choose, sleep or you? 😴",
        options: ["Sleep for sure 😂", "You, always! 💖", "Both at the same time", "Neither"],
        correct: "Both at the same time"
    }
];

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Quest = ({ onComplete, onBack }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [shakeIndex, setShakeIndex] = useState(-1);

    // Shuffle options for each question once
    const shuffledQuestions = useMemo(() => {
        return allQuestions.map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));
    }, []);

    const handleAnswer = (selectedOption) => {
        if (selectedOption === shuffledQuestions[currentQ].correct) {
            if (currentQ < shuffledQuestions.length - 1) {
                setCurrentQ(prev => prev + 1);
                setShakeIndex(-1);
            } else {
                onComplete();
            }
        } else {
            const idx = shuffledQuestions[currentQ].options.indexOf(selectedOption);
            setShakeIndex(idx);
            setTimeout(() => setShakeIndex(-1), 500);
        }
    };

    const progress = ((currentQ) / shuffledQuestions.length) * 100;

    return (
        <div className="quest-card glass-card fade-in" style={{ position: 'relative' }}>
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
            <div className="quest-progress" style={{ width: `${progress}%` }} />

            <div className="quest-header">
                <h2>Love Quest 🗝️</h2>
                <p>Question {currentQ + 1} of {shuffledQuestions.length}</p>
            </div>

            <div key={currentQ} className="slide-in">
                <div className="quest-question-box">
                    <p>{shuffledQuestions[currentQ].question}</p>
                </div>

                <div className="quest-options">
                    {shuffledQuestions[currentQ].options.map((opt, i) => (
                        <button
                            key={i}
                            className={`quest-option ${shakeIndex === i ? 'shake' : ''}`}
                            onClick={() => handleAnswer(opt)}
                        >
                            <span>{opt}</span>
                            <span className="opt-icon">♥</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="quest-step-dots">
                {shuffledQuestions.map((_, i) => (
                    <div
                        key={i}
                        className={`step-dot ${i === currentQ ? 'active' : ''} ${i < currentQ ? 'done' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Quest;
