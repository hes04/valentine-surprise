import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import GameSelect from './components/GameSelect';
import Game from './components/Game';
import MemoryGame from './components/MemoryGame';
import Quest from './components/Quest';
import Surprise from './components/Surprise';
import { Volume2, VolumeX } from 'lucide-react';

function App() {
  const [stage, setStage] = useState('welcome');
  // Fallback music if local file is missing
  const REMOTE_MUSIC = 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3';
  const LOCAL_MUSIC = '/music.mp3';

  const audioRef = useRef(new Audio(LOCAL_MUSIC));
  const [isPlaying, setIsPlaying] = useState(false);
  /*
   * Audio logic refactored:
   * We no longer have a "Click to Enter" screen.
   * Browsers block autoplay, so we must trigger audio on the first user interaction.
   * That interaction is now the "Start Surprise" button in the Welcome component.
   */
  const startAudio = async () => {
    const audio = audioRef.current;
    if (isPlaying) return; // Already playing

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn("Local audio failed or blocked, trying remote...", e);
      // If it was a loading error (404) or not supported, switch source
      if (audio.error || e.name === 'NotSupportedError') {
        audio.src = REMOTE_MUSIC;
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (remErr) {
          console.log("Remote audio also blocked/failed", remErr);
          setIsPlaying(false);
        }
      } else {
        // Just blocked by browser (shouldn't happen if called from click handler)
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.4;

    return () => {
      audio.pause();
    };
  }, []); // Run once on mount to set properties

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Use the robust start function that handles fallbacks
      startAudio();
    }
  };

  const goBack = () => {
    if (stage === 'game' || stage === 'memory') setStage('gameSelect');
    if (stage === 'gameSelect') setStage('welcome');
    if (stage === 'quest') setStage('gameSelect');
    if (stage === 'surprise') setStage('quest');
  };

  const handleStart = () => {
    startAudio();
    setStage('gameSelect');
  };

  return (
    <Layout>


      {stage === 'welcome' && <Welcome onStart={handleStart} />}
      {stage === 'gameSelect' && (
        <GameSelect
          onSelect={(game) => setStage(game === 'catch' ? 'game' : 'memory')}
          onBack={() => setStage('welcome')}
        />
      )}
      {stage === 'game' && <Game onComplete={() => setStage('quest')} onBack={() => setStage('gameSelect')} />}
      {stage === 'memory' && <MemoryGame onComplete={() => setStage('quest')} onBack={() => setStage('gameSelect')} />}
      {stage === 'quest' && <Quest onComplete={() => setStage('surprise')} onBack={() => setStage('gameSelect')} />}
      {stage === 'surprise' && <Surprise onBack={() => setStage('quest')} />}
    </Layout>
  );
}

export default App;
