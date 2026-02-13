import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const LEVELS = [
    { name: 'Level 1 — Warm Up', target: 8, spawnRate: 900, speedMin: 1.2, speedMax: 2.2 },
    { name: 'Level 2 — Getting Harder', target: 12, spawnRate: 700, speedMin: 1.8, speedMax: 3.0 },
    { name: 'Level 3 — Love Master!', target: 15, spawnRate: 500, speedMin: 2.5, speedMax: 4.0 },
];

const Game = ({ onComplete, onBack }) => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const requestRef = useRef(null);
    const basketRef = useRef({ x: 50 });
    const heartsRef = useRef([]);
    const scoreRef = useRef(0);
    const levelRef = useRef(0);

    const totalTarget = LEVELS.reduce((sum, l) => sum + l.target, 0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = Math.min(600, window.innerWidth - 40);
            canvas.height = Math.min(500, window.innerHeight - 280);
        };
        resize();
        window.addEventListener('resize', resize);

        let lastSpawnTime = 0;
        let levelScore = 0;

        const drawHeart = (ctx, x, y, size) => {
            ctx.save();
            ctx.translate(x, y);
            const s = size / 15;
            ctx.beginPath();
            ctx.moveTo(0, 3 * s);
            ctx.bezierCurveTo(0, 0, -5 * s, -5 * s, -10 * s, -3 * s);
            ctx.bezierCurveTo(-15 * s, 0, -15 * s, 8 * s, 0, 15 * s);
            ctx.moveTo(0, 3 * s);
            ctx.bezierCurveTo(0, 0, 5 * s, -5 * s, 10 * s, -3 * s);
            ctx.bezierCurveTo(15 * s, 0, 15 * s, 8 * s, 0, 15 * s);

            const gradient = ctx.createRadialGradient(0, 5 * s, 0, 0, 5 * s, 15 * s);
            gradient.addColorStop(0, '#ff6b9d');
            gradient.addColorStop(1, '#c0392b');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-4 * s, 0, 2 * s, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();
            ctx.restore();
        };

        const loop = (timestamp) => {
            const lv = LEVELS[levelRef.current];
            if (!lv) {
                setGameOver(true);
                setTimeout(onComplete, 1500);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Level label
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.font = 'bold 16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(lv.name, canvas.width / 2, canvas.height - 10);

            // Spawn
            if (timestamp - lastSpawnTime > lv.spawnRate) {
                heartsRef.current.push({
                    x: Math.random() * (canvas.width - 40) + 20,
                    y: -30,
                    speed: Math.random() * (lv.speedMax - lv.speedMin) + lv.speedMin,
                    size: Math.random() * 8 + 12,
                    wobble: Math.random() * Math.PI * 2,
                });
                lastSpawnTime = timestamp;
            }

            // Update & Draw Hearts
            heartsRef.current = heartsRef.current.filter(heart => {
                heart.y += heart.speed;
                heart.x += Math.sin(heart.y * 0.02 + heart.wobble) * 0.8;

                // Particles
                if (heart.isParticle) {
                    heart.life -= 1;
                    ctx.globalAlpha = heart.life / 20;
                    drawHeart(ctx, heart.x, heart.y, heart.size);
                    ctx.globalAlpha = 1;
                    return heart.life > 0;
                }

                drawHeart(ctx, heart.x, heart.y, heart.size);

                // Collision
                const bx = (basketRef.current.x / 100) * canvas.width;
                if (
                    heart.y > canvas.height - 80 &&
                    heart.y < canvas.height - 40 &&
                    Math.abs(heart.x - bx) < 50
                ) {
                    scoreRef.current += 1;
                    levelScore += 1;
                    setScore(scoreRef.current);

                    // Burst
                    for (let p = 0; p < 5; p++) {
                        heartsRef.current.push({
                            x: heart.x + (Math.random() - 0.5) * 30,
                            y: heart.y,
                            speed: -(Math.random() * 3 + 1),
                            size: 4,
                            wobble: Math.random() * 6,
                            isParticle: true,
                            life: 20
                        });
                    }

                    // Level up check
                    if (levelScore >= lv.target) {
                        levelScore = 0;
                        levelRef.current += 1;
                        setLevel(levelRef.current);
                        if (levelRef.current < LEVELS.length) {
                            setShowLevelUp(true);
                            setTimeout(() => setShowLevelUp(false), 1200);
                        }
                    }

                    return false;
                }
                return heart.y < canvas.height + 20;
            });

            // Draw Basket
            const bx = (basketRef.current.x / 100) * canvas.width;
            const by = canvas.height - 50;
            ctx.save();
            ctx.shadowColor = '#ec407a';
            ctx.shadowBlur = 20;
            ctx.font = '45px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🧺', bx, by);
            ctx.restore();

            ctx.beginPath();
            ctx.ellipse(bx, by - 20, 35, 6, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(236, 64, 122, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const handleMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        basketRef.current.x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    };

    const progress = Math.min((score / totalTarget) * 100, 100);

    return (
        <div className="game-wrapper fade-in" style={{ position: 'relative' }}>
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
                    zIndex: 20
                }}
            >
                <ArrowLeft size={28} />
            </button>

            <div className="game-header">
                <h2>Catch the Love!</h2>
                <p>{level < LEVELS.length ? LEVELS[level].name : 'All Levels Done!'}</p>
            </div>

            <div className="game-score-bar">
                <span className="score-text">💖 {score} / {totalTarget}</span>
                <div className="score-progress">
                    <div className="score-progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    className="game-canvas"
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                />

                {showLevelUp && (
                    <div className="game-win-overlay">
                        <div className="level-up-card">
                            <span className="trophy">⬆️</span>
                            <h2>Level Up!</h2>
                            <p>{LEVELS[level]?.name}</p>
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div className="game-win-overlay">
                        <div className="game-win-card">
                            <span className="trophy">🏆</span>
                            <h2>You Won!</h2>
                            <p>All levels cleared! 🎉</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
