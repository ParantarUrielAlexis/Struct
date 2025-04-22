import React from 'react';
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

  return (
    <div className="container">
      <h1 className="title">SortShift</h1>
      <hr />
      <p className="tagline">“Click. Swap. Sort your way to victory”</p>
      <div className="level-grid">
        {levels.map((level) => (
          <div
            key={level.id}
            className="level-card"
            onClick={() => navigate(level.path)}
            style={{
              backgroundImage: `url(${level.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
            }}
          >
            <div className="overlay">
              <button className="play-button">Play</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
