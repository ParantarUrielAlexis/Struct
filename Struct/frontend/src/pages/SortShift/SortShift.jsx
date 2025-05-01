import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import selectionLogo from '../../assets/selection/selection_sort.png';
import insertionLogo from '../../assets/insertion/insertion_sort.png';
import bubbleLogo from '../../assets/bubble/bubble_sort.png';
import './SortShift.css';

const levels = [
  { id: 1, title: 'Selection Sort', backgroundImage: selectionLogo, path: '/sortshiftselection' },
  { id: 2, title: 'Bubble Sort', backgroundImage: bubbleLogo, path: '/sortshiftbubble' },
  { id: 3, title: 'Insertion Sort', backgroundImage: insertionLogo, path: '/sortshiftinsertion' },
];

export default function SortShift() {
  const navigate = useNavigate();
  
  const gameStartSound = useRef(new Audio('/sounds/game_start_sound.mp3'));
  const backgroundSound = useRef(new Audio('/sounds/sortshift_background.mp3'));
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [progress, setProgress] = useState(() => {
    // Retrieve progress from localStorage or default to level 1
    return parseInt(localStorage.getItem('progress')) || 1;
  });

  useEffect(() => {
    const sound = backgroundSound.current;
    sound.loop = true;
    sound.play();

    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, []);

  const handlePlayClick = (path, image, levelId) => {
    if (levelId > progress) return; // Prevent access to locked levels

    const bgSound = backgroundSound.current;
    const startSound = gameStartSound.current;

    bgSound.pause();
    bgSound.currentTime = 0;

    startSound.play();

    setLoadingImage(image);
    setIsLoading(true);
    setFadeIn(false);
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
    setTimeout(() => {
      if (levelId === progress) {
        const newProgress = progress + 1;
        setProgress(newProgress);
        localStorage.setItem('progress', newProgress); 
      }
      navigate(path);
    }, 4000);
  };

  return (
    <div className="container">
      {isLoading && (
        <div className={`loading-overlay ${isLoading ? 'loading-active' : 'loading-done'}`}>
          <img
            src={loadingImage}
            alt="Loading Level"
            className={`loading-image ${fadeIn ? 'fade-in' : ''}`}
          />
          <div className="loading-spinner"></div>
        </div>
      )}
      <video className="background-video" autoPlay loop muted>
        <source src="/video/sortshift_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="title">SortShift</h1>
      <hr />
      <p className="tagline">“Click. Swap. Sort your way to victory”</p>
      <div className="level-grid">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-card ${level.id > progress ? 'locked' : ''}`}
            onClick={() => handlePlayClick(level.path, level.backgroundImage, level.id)}
            style={{
              backgroundImage: `url(${level.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: level.id > progress ? 'not-allowed' : 'pointer',
              opacity: level.id > progress ? 0.5 : 1, // Dim locked levels
            }}
          >
            <div className="overlay">
              {level.id > progress ? (
                <span className="locked-text">Locked</span>
              ) : (
                <button className="play-button">Play</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
