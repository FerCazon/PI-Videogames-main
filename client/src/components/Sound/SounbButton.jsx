import React, { useState } from 'react';
import './SoundButton.css';
import sound from '../../assets/backgroundmp3.mp3';

function SoundButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio(sound);

  const handleSoundToggle = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sound-button" onClick={handleSoundToggle}>
      <div className="gg-loadbar-sound"></div>
    </div>
  );
}

export default SoundButton;