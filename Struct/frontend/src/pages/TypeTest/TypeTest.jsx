import React, { useState, useEffect, useRef } from "react";
import "./TypeTest.css";

import { FaRedo } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Import volume icons

import typingSoundFile from "../../assets/typing.mp3"; // Add your typing sound file
import pingSoundFile from "../../assets/ping.mp3"; // Add your ping sound file

const words = [
  "*(arr+i)",
  "arr[i]",
  "int*",
  "malloc",
  "realloc",
  "calloc",
  "free",
  "delete",
  "arr[i][j]",
  "*(arr+i)+j",
  "capacity * sizeof(int)",
];

const wordDefinitions = {
  "*(arr+i)": "Pointer arithmetic to access an array element.",
  "arr[i]": "Accessing an array element using an index.",
  "int*": "A pointer to an integer.",
  malloc: "Allocates memory dynamically in C.",
  realloc: "Resizes previously allocated memory in C.",
  calloc: "Allocates and initializes memory in C.",
  free: "Deallocates previously allocated memory in C.",
  delete: "Deallocates memory in C++.",
  "arr[i][j]": "Accessing a 2D array element using indices.",
  "*(arr+i)+j": "Pointer arithmetic to access a 2D array element.",
  "capacity * sizeof(int)": "Calculates the memory size required for an array.",
};

function TypeTest() {
  const typingSound = new Audio(typingSoundFile);
  const pingSound = new Audio(pingSoundFile);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Timer starts at 15 seconds
  const [startTime, setStartTime] = useState(null); // Track the start time
  const [score, setScore] = useState(0); // Track the score
  const [multiplier, setMultiplier] = useState(1); // Track the multiplier
  const [mistakes, setMistakes] = useState(0); // Track mistakes for the current word
  const [scoreAnimation, setScoreAnimation] = useState(false); // Animation for score
  const [multiplierAnimation, setMultiplierAnimation] = useState(false); // Animation for multiplier
  const [difficulty, setDifficulty] = useState("Easy"); // Track difficulty level
  const [selectedTimer, setSelectedTimer] = useState(15); // Track selected timer

  const inputRef = useRef(null); // Reference to the input field

  const [mode, setMode] = useState("Competitive");

  const [customTime, setCustomTime] = useState(""); // State for custom time input
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const startGame = () => {
    if (!gameStarted) {
      setStartTime(Date.now()); // Set the start time only when the game starts
    }
    setGameStarted(true);
    setGameOver(false);
    setShowNavbar(false);
    setHasStartedTyping(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(mode === "Competitive" ? selectedTimer : null); // Timer only for Competitive Mode
    setStartTime(null); // Reset the start time
    setScore(0); // Reset the score
    setMultiplier(1); // Reset the multiplier
    setMistakes(0); // Reset mistakes

    // Automatically focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleCustomTimeSubmit = () => {
    const time = parseInt(customTime, 10);
    if (!isNaN(time) && time > 0) {
      setSelectedTimer(time); // Set the custom time as the selected timer
      setShowCustomTimeModal(false); // Hide the input field
      setCustomTime(""); // Reset the input field
    } else {
      alert("Please enter a valid number greater than 0.");
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setGameStarted(false); // Reset the game when switching modes
    setGameOver(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(newMode === "Competitive" ? selectedTimer : null); // Reset timer for Competitive Mode
    setScore(0);
    setMultiplier(1);
    setMistakes(0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle mute state
  };

  useEffect(() => {
    if (mode === "Competitive" && gameStarted && startTime && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    } else if (mode === "Competitive" && timeLeft === 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [mode, gameStarted, startTime, timeLeft]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false); // Reset the gameOver state
    setShowNavbar(true);
    setHasStartedTyping(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(selectedTimer); // Reset the timer
    setStartTime(null); // Reset the start time
    setScore(0); // Reset the score
    setMultiplier(1); // Reset the multiplier
    setMistakes(0); // Reset mistakes

    // Automatically focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    setGameStarted(true); // Restart the game
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      setShowNavbar(false); // Hide the navbar when typing starts
    }

    // Play typing sound for every letter typed (only if not muted)
    if (!isMuted) {
      typingSound.currentTime = 0; // Reset sound to the beginning
      typingSound.play();
    }

    // Start the timer when the user types the first letter
    if (!startTime) {
      setStartTime(Date.now());
    }

    setInputValue(value);

    const currentWord = words[currentWordIndex];

    // Check if the input matches the current word
    if (value === currentWord) {
      // Play ping sound when a word is completed (only if not muted)
      if (!isMuted) {
        pingSound.currentTime = 0; // Reset sound to the beginning
        pingSound.play();
      }

      // Update score and multiplier
      const points = 5 * multiplier;
      setScore((prevScore) => prevScore + points);
      setScoreAnimation(true); // Trigger score animation

      if (mistakes === 0) {
        setMultiplier((prevMultiplier) => prevMultiplier + 1); // No mistakes, increase by 1
      } else {
        setMultiplier((prevMultiplier) => prevMultiplier + 0.5); // Mistakes made, increase by 0.5
      }
      setMultiplierAnimation(true); // Trigger multiplier animation

      // Move to the next word
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setInputValue("");
      setMistakes(0); // Reset mistakes for the next word

      // End game if all words are completed
      if (currentWordIndex + 1 === words.length) {
        setGameOver(true);
        setGameStarted(false);
      }
    } else {
      // Check for mistakes
      if (!currentWord.startsWith(value)) {
        setMistakes((prevMistakes) => prevMistakes + 1);

        // Decrease multiplier if mistakes reach 2
        if (mistakes + 1 === 2) {
          setMultiplier((prevMultiplier) => Math.max(1, prevMultiplier - 0.5)); // Ensure multiplier doesn't go below 1
          setMultiplierAnimation(true); // Trigger multiplier animation
        }
      }
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty); // Update the difficulty without affecting the game state
    }
  };

  const handleTimerChange = (newTimer) => {
    if (selectedTimer !== newTimer) {
      setSelectedTimer(newTimer); // Update the timer without affecting the game state
    }
  };

  useEffect(() => {
    if (gameStarted && startTime && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    } else if (timeLeft === 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [gameStarted, startTime, timeLeft]);

  useEffect(() => {
    if (scoreAnimation) {
      const timer = setTimeout(() => setScoreAnimation(false), 300); // Reset after animation
      return () => clearTimeout(timer);
    }
  }, [scoreAnimation]);

  useEffect(() => {
    if (multiplierAnimation) {
      const timer = setTimeout(() => setMultiplierAnimation(false), 300); // Reset after animation
      return () => clearTimeout(timer);
    }
  }, [multiplierAnimation]);

  const calculateWPM = () => {
    const elapsedTime = (Date.now() - startTime) / 1000 / 120; // Time in minutes
    return Math.round(currentWordIndex / elapsedTime) || 0; // Words per minute
  };

  const renderHighlightedWord = () => {
    const currentWord = words[currentWordIndex];
    return currentWord.split("").map((char, index) => {
      const isCorrect = inputValue[index] === char;
      const isTyped = index < inputValue.length;

      return (
        <span
          key={index}
          className={`letter ${
            isTyped ? (isCorrect ? "correct" : "incorrect") : ""
          }`}
        >
          {char}
        </span>
      );
    });
  };

  const renderDefinitions = () => {
    return words.slice(0, currentWordIndex + 1).map((word, index) => (
      <div key={index} className="definition-card">
        <div className="definition-word">{word}</div>
        <div className="definition-text">
          {wordDefinitions[word] || "Definition not available."}
        </div>
      </div>
    ));
  };

  return (
    <div className="type-test-wrapper">
      {/* Navigation Bar */}
      {showNavbar && !hasStartedTyping && (
        <nav className="type-test-navbar">
          <div className="modes">
            <button
              className={`mode-button ${
                mode === "Competitive" ? "active" : ""
              }`}
              onClick={() => handleModeChange("Competitive")}
            >
              Competitive Mode
            </button>
            <button
              className={`mode-button ${mode === "Practice" ? "active" : ""}`}
              onClick={() => handleModeChange("Practice")}
            >
              Practice Mode
            </button>

            {/* Mute Button */}
            <button className="mute-button" onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>

          <div className="difficulty">
            <div className="difficulty-options">
              <div
                className={`difficulty-item ${
                  difficulty === "Easy" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Easy")}
              >
                Easy
              </div>
              <div
                className={`difficulty-item ${
                  difficulty === "Medium" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Medium")}
              >
                Medium
              </div>
              <div
                className={`difficulty-item ${
                  difficulty === "Hard" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Hard")}
              >
                Hard
              </div>
            </div>
          </div>
          {mode === "Competitive" && (
            <div className="timers">
              <div className="timer-options">
                <div
                  className={`timer-item ${
                    selectedTimer === 15 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(15)}
                >
                  15
                </div>
                <div className="line"></div>
                <div
                  className={`timer-item ${
                    selectedTimer === 30 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(30)}
                >
                  30
                </div>
                <div className="line"></div>
                <div
                  className={`timer-item ${
                    selectedTimer === 60 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(60)}
                >
                  60
                </div>
                <div className="line"></div>
                <div
                  className="timer-item custom-timer"
                  onClick={() => setShowCustomTimeModal(true)}
                >
                  <FaClock /> {/* React clock icon */}
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Custom Timer Modal */}
      {showCustomTimeModal && (
        <div className="custom-timer-modal">
          <div className="custom-timer-modal-content">
            <h3>Set Custom Timer</h3>
            <input
              type="number"
              placeholder="Enter custom time (seconds)"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleCustomTimeSubmit}>Set Timer</button>
              <button onClick={() => setShowCustomTimeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div className="game-container">
        {/* Score and Multiplier */}
        <div className="score-multiplier-container">
          <div
            className={`score-multiplier ${scoreAnimation ? "animate" : ""}`}
          >
            <span
              className={`score-display ${scoreAnimation ? "animate" : ""}`}
            >
              Score: {score}
            </span>
            <span
              className={`multiplier-display ${
                multiplierAnimation ? "animate" : ""
              }`}
            >
              Multiplier: x{multiplier.toFixed(1)}
            </span>
          </div>
        </div>

        {!gameStarted && !gameOver && (
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        )}
        {gameStarted && (
          <div className="game-layout">
            {/* Left side: Words answered */}
            <div className="answered-words">
              {words
                .slice(Math.max(0, currentWordIndex - 1), currentWordIndex)
                .map((word, index) => (
                  <div key={index} className="word-item">
                    {word}
                  </div>
                ))}
            </div>

            {/* Middle: Current word */}
            <div className="current-word">
              <div className="word-display">{renderHighlightedWord()}</div>
              <input
                type="text"
                className="input-field"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type the word here"
                ref={inputRef}
              />
              <div className="info-display">
                <span
                  className={`wpm-display ${
                    mode === "Practice" ? "centered-wpm" : ""
                  }`}
                >
                  WPM: {calculateWPM()}
                </span>
                {mode === "Competitive" && (
                  <span className="timer-display">Time Left: {timeLeft}s</span>
                )}
              </div>
              <button className="restart-button" onClick={restartGame}>
                <FaRedo className="restart-icon" /> Restart
              </button>
            </div>

            {/* Right side: Upcoming words */}
            <div className="upcoming-words">
              {words
                .slice(currentWordIndex + 1, currentWordIndex + 2)
                .map((word, index) => (
                  <div key={index} className="word-item">
                    {word}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Game Over Section */}
        {gameOver && (
          <div className="game-over-container">
            <h2 className="game-over-title">Game Over!</h2>
            <p className="game-over-wpm">Your WPM: {calculateWPM()}</p>
            <div className="definitions-container">
              <h3>Words and Definitions:</h3>
              {renderDefinitions()}
            </div>
            <button onClick={restartGame} className="restart-button">
              <FaRedo className="restart-icon" /> Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeTest;
