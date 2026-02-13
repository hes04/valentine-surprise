import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GameSelect = ({ onSelect, onBack }) => {
    return (
        <div className="game-select-wrapper fade-in" style={{ position: 'relative' }}>
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

            <div className="game-select-header">
                <h2>Choose a Game 🎮</h2>
                <p>Pick one to unlock the next stage!</p>
            </div>

            <div className="game-select-grid">
                <button className="game-select-card" onClick={() => onSelect('catch')}>
                    <div className="gsc-icon">🧺</div>
                    <div className="gsc-preview">
                        <span className="gsc-heart gsc-h1">💖</span>
                        <span className="gsc-heart gsc-h2">💗</span>
                        <span className="gsc-heart gsc-h3">💖</span>
                    </div>
                    <h3>Catch the Love</h3>
                    <p>Move the basket to catch falling hearts before they disappear!</p>
                    <span className="gsc-difficulty">⭐ Easy</span>
                </button>

                <button className="game-select-card" onClick={() => onSelect('memory')}>
                    <div className="gsc-icon">🃏</div>
                    <div className="gsc-preview">
                        <span className="gsc-card-mini">❤️</span>
                        <span className="gsc-card-mini flip">?</span>
                        <span className="gsc-card-mini">💕</span>
                        <span className="gsc-card-mini flip">?</span>
                    </div>
                    <h3>Love Memory</h3>
                    <p>Flip cards and find all the matching love pairs!</p>
                    <span className="gsc-difficulty">⭐⭐ Medium</span>
                </button>
            </div>
        </div>
    );
};

export default GameSelect;
