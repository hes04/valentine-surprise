import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';

const Surprise = ({ onBack }) => {
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const colors = ['#ec407a', '#ab47bc', '#ffd700', '#ff6b9d', '#fff'];

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors
            });
        }, 100);
    }, []);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const saveMemory = async () => {
        if (!photo && !message) return;
        setUploading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: photo ? 'photo' : 'note',
                    content: photo || message
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                setMessage('');
                setPhoto(null);
            }
        } catch (err) {
            alert('Could not save memory. Is the backend running?');
        } finally {
            setUploading(false);
        }
    };

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

            <div className="surprise-message">
                <p>
                    You are my everything, my <span className="highlight">Bulu buluuu</span>,
                    and my forever Valentine. Every moment with you is magical.
                    Let's capture this beautiful moment together! 📸
                </p>
            </div>

            {photo ? (
                <div className="photo-preview">
                    <img src={photo} alt="Our Memory" />
                    <button className="remove-btn" onClick={() => setPhoto(null)}>✕</button>
                </div>
            ) : (
                <div className="upload-area">
                    <div className="upload-box">
                        <span className="icon">📷</span>
                        <span>Camera</span>
                        <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
                    </div>
                    <div className="upload-box">
                        <span className="icon">📁</span>
                        <span>Upload</span>
                        <input type="file" accept="image/*" onChange={handleFile} />
                    </div>
                </div>
            )}

            <textarea
                className="note-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a sweet note to remember this moment... 💕"
                rows="3"
            />

            <button
                className={`btn-save ${success ? 'success' : ''}`}
                onClick={saveMemory}
                disabled={uploading || (!photo && !message)}
            >
                {uploading ? '⏳ Saving...' : success ? '✅ Saved!' : '💾 Save Memory'}
            </button>
        </div>
    );
};

export default Surprise;
