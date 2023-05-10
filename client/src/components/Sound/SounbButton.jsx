import React, { useState, useRef, useEffect } from 'react';
import './SoundButton.css';
import sound from '../../assets/backgroundmp3.mp3';

function SoundButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(sound));

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const handleSoundToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sound-button" onClick={handleSoundToggle}>
      <i className="gg-loadbar-sound"></i>
    </div>
  );
}

export default SoundButton;
