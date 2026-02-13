import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

const LEVELS = [
    { name: 'Level 1 — Easy', pairs: 4, emojis: ['❤️', '💕', '💖', '🌹'] },
    { name: 'Level 2 — Medium', pairs: 6, emojis: ['❤️', '💕', '💖', '🌹', '💘', '🦋'] },
    { name: 'Level 3 — Hard', pairs: 8, emojis: ['❤️', '💕', '💖', '🌹', '💘', '🦋', '🍫', '💌'] },
];

const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const MemoryGame = ({ onComplete, onBack }) => {
    const [level, setLevel] = useState(0);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Initialize level cards
    useEffect(() => {
        const lv = LEVELS[level];
        if (!lv) return;
        const pairs = [...lv.emojis, ...lv.emojis];
        const shuffled = shuffleArray(pairs.map((emoji, i) => ({ id: `${level}-${i}`, emoji })));
        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
    }, [level]);

    // Check for match
    useEffect(() => {
        if (flipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = flipped;
            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    setMatched(prev => [...prev, cards[first].emoji]);
                    setFlipped([]);
                }, 500);
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    }, [flipped, cards]);

    // Check level complete
    useEffect(() => {
        const lv = LEVELS[level];
        if (!lv) return;
        if (matched.length === lv.pairs && matched.length > 0) {
            if (level < LEVELS.length - 1) {
                // Level up
                setShowLevelUp(true);
                setTimeout(() => {
                    setShowLevelUp(false);
                    setLevel(prev => prev + 1);
                }, 1500);
            } else {
                // Game won
                setGameWon(true);
                setTimeout(onComplete, 1500);
            }
        }
    }, [matched, level, onComplete]);

    const handleFlip = (index) => {
        if (
            flipped.length >= 2 ||
            flipped.includes(index) ||
            matched.includes(cards[index]?.emoji)
        ) return;
        setFlipped(prev => [...prev, index]);
    };

    const isFlipped = (index) => flipped.includes(index) || matched.includes(cards[index]?.emoji);

    const lv = LEVELS[level];
    const progress = lv ? Math.round((matched.length / lv.pairs) * 100) : 100;
    const cols = lv && lv.pairs <= 4 ? 4 : 4;

    return (
        <div className="memory-wrapper fade-in" style={{ position: 'relative' }}>
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
            <div className="game-header">
                <h2>Love Memory 🃏</h2>
                <p>{lv ? lv.name : 'All Done!'}</p>
            </div>

            <div className="game-score-bar">
                <span className="score-text">💖 {matched.length}/{lv?.pairs || 0} pairs</span>
                <div className="score-progress">
                    <div className="score-progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="memory-stats">
                <span>🎯 Moves: {moves}</span>
                <span style={{ marginLeft: '16px' }}>📊 Level {level + 1}/{LEVELS.length}</span>
            </div>

            <div className="memory-grid" key={level} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {cards.map((card, index) => (
                    <button
                        key={card.id}
                        className={`memory-card ${isFlipped(index) ? 'flipped' : ''} ${matched.includes(card.emoji) ? 'matched' : ''}`}
                        onClick={() => handleFlip(index)}
                        disabled={isFlipped(index)}
                    >
                        <div className="memory-card-inner">
                            <div className="memory-card-front">
                                <span>💜</span>
                            </div>
                            <div className="memory-card-back">
                                <span>{card.emoji}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {showLevelUp && (
                <div className="game-win-overlay">
                    <div className="level-up-card">
                        <span className="trophy">⬆️</span>
                        <h2>Level Up!</h2>
                        <p>{LEVELS[level + 1]?.name}</p>
                    </div>
                </div>
            )}

            {gameWon && (
                <div className="game-win-overlay">
                    <div className="game-win-card">
                        <span className="trophy">🏆</span>
                        <h2>Perfect Match!</h2>
                        <p>All levels in {moves} moves! 🎉</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
