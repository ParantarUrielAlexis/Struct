import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import simulation from '../../assets/insertion/insertion_simulation.gif';

import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';

import styles from './SortShiftInsertion.module.css';

const SortShiftInsertion = () => {
    const backgroundSound = useRef(new Audio("/sounds/insertion_background.mp3")); 
    const navigate = useNavigate();
    const { user } = useAuth();
    const generateRandomArray = () =>{
        return Array.from({ length: 7}, () => Math.floor(Math.random() * 100) + 1 )
    }
    const [originalArray, setOriginalArray] = useState([]);
    
    const [grids, setGrids] = useState([originalArray.slice()]);
    const [selected, setSelected] = useState({ gridIndex: null, itemIndex: null });
    const [iterationResults, setIterationResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [tutorialPage, setTutorialPage] = useState(0); 
    const [startTime, setStartTime] = useState(null); // Track the start time of the game

    const tutorialPages = [
    {
        title: "How Insertion Sort Works",
        content: (
            <>
                <div className="simulation-text">
                    <p><strong>Insertion Sort</strong> is a simple sorting algorithm that builds the sorted array one element at a time by repeatedly picking the next element and inserting it into its correct position in the sorted portion.</p>
                </div>
                <br></br>
                <h2>Here are the steps:</h2>
                <ol>
                    <li>Start with the second element in the array (index 1).</li>
                    <li>Compare it with the elements in the sorted portion (to its left).</li>
                    <li>Shift all larger elements one position to the right.</li>
                    <li>Insert the current element into its correct position.</li>
                    <li>Repeat this process for all remaining elements in the array.</li>
                </ol>
                <p>Watch the simulation to see how the algorithm works in real-time.</p>
                <img 
                    src={simulation} 
                    alt="Insertion Sort Simulation" 
                    className="simulation-gif" 
                    style={{ width: '70%', height: 'auto', margin: '20px auto', display: 'block' }} 
                />
                <p>Note: Even if the element is already in the correct position, you must still perform the iteration to ensure the process is complete.</p>
            </>
        ),
    },
    {
        title: "Game Mechanics",
        content: (
            <>
                <h1>How to Play:</h1>
                <ol>
                    <li>Click on a box to select the element you want to move.</li>
                    <li>Click on the target position in the sorted portion to insert the selected element.</li>
                    <li>Repeat this process for each iteration until the entire array is sorted.</li>
                    <li>Ensure that you follow the correct steps for each iteration to avoid penalties.</li>
                    <li>Click the "Submit" button once you believe the array is sorted correctly.</li>
                    <li>Use the "+" button to add a new grid/iteration or the "-" button to remove a grid/iteration if needed.</li>
                    <li>Click the "Tutorial" button to revisit the instructions or the "Music" button to toggle background music.</li>
                    <li>Earn points based on the accuracy and efficiency of your sorting process.</li>
                </ol>
            </>
        ),
    },
    {
        title: "Scoring Works",
        content: (
            <>
                <h1>How Scoring Works</h1>
                <ul>
                    <li><strong>Correct Iterations:</strong> You earn points for each correct iteration. The total points are divided equally among the required iterations.</li>
                    <li><strong>Incorrect Iterations:</strong> Points are deducted for incorrect iterations.</li>
                    <li><strong>Extra Iterations:</strong> Points are also deducted if you perform unnecessary extra iterations after the array is already sorted.</li>
                    <li><strong>Reminder:</strong> Even if the current position already contains the correct element, you must add an iteration to proceed.</li>
                    <li><strong>Maximum Score:</strong> The maximum score you can achieve is <strong>60 points</strong>.</li>
                    <li><strong>Passing Score:</strong> To pass, you need to score at least <strong>70%</strong> of the total points (42 points).</li>
                </ul>
            </>
        ),
    },
];
    useEffect(() => {
        const randomArray = generateRandomArray();
        setOriginalArray(randomArray);
        setGrids([randomArray]);
    }, []);
    useEffect(() => {
        const sound = backgroundSound.current;
    
        return () => {
            sound.pause();
            sound.currentTime = 0;
        };
    }, []);

    const swapSound = new Audio("/sounds/swap.mp3");
    const clickSound = new Audio("/sounds/first_click.mp3");

    const toggleMusic = () => {
        const sound = backgroundSound.current;
        if(sound.paused){
            sound.play();
            setIsPlaying(true);
        } else {
            sound.pause();
            setIsPlaying(false);
        }
    }

    const handleSelect = (gridIndex, itemIndex) => {

        if (selected.gridIndex === null) {
            clickSound.play();
            
            setSelected({ gridIndex, itemIndex });
        } else if (selected.gridIndex === gridIndex && selected.itemIndex !== itemIndex) {
            
            swapNumbers(gridIndex, selected.itemIndex, itemIndex);
            swapSound.play();
            setSelected({ gridIndex: null, itemIndex: null });
        } else {
            setSelected({ gridIndex: null, itemIndex: null });
        }
    };
    const handleNext = () => {
        if (tutorialPage < tutorialPages.length - 1) {
            setTutorialPage(tutorialPage + 1);
        }
    };

    const handlePrevious = () => {
        if (tutorialPage > 0) {
            setTutorialPage(tutorialPage - 1);
        }
    };

    const swapNumbers = (gridIndex, itemIndex1, itemIndex2) => {
        let newGrids = [...grids];
        let newGrid = [...newGrids[gridIndex]];
        [newGrid[itemIndex1], newGrid[itemIndex2]] = [newGrid[itemIndex2], newGrid[itemIndex1]];
        newGrids[gridIndex] = newGrid;
        setGrids(newGrids);
    };
    
    const closeTutorial = () => {
        setIsTutorialOpen(false);
        setStartTime(Date.now()); // Set the start time when the tutorial is closed
        const sound = backgroundSound.current;
        sound.volume = 0.3; 
        sound.loop = true; 
        sound.play();
        
    };


    const addGrid = () => {
        const addGridSound = new Audio("/sounds/add.mp3");
        addGridSound.play();
        // Don't add new grids if the last grid is already sorted
        if (grids.length < 6) {
            setGrids([...grids, [...grids[grids.length - 1]]]);
        }
    };

    const removeGrid = () => {
        const removeGridSound = new Audio("/sounds/delete.mp3");
        removeGridSound.play();
        if (grids.length > 1) {
            setGrids(grids.slice(0, -1));
        }
    };

    const getOrdinalSuffix = (n) => {
        if (n % 100 >= 11 && n % 100 <= 13) {
            return `${n}th`;
        }
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    const isSorted = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    };

    const insertionSortSteps = () => {
        let arr = [...originalArray];
        let steps = [arr.slice()];
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
            steps.push(arr.slice());
            if (isSorted(arr)) break;
        }
        return steps;
    };

    const correctSteps = insertionSortSteps();

    const checkIteration = (grid, gridIndex) => {
        let arr = [...originalArray];
        for (let i = 1; i <= gridIndex + 1; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }

        if (gridIndex >= correctSteps.length) return false;
        return JSON.stringify(grid) === JSON.stringify(arr);
    };

    const sendUserLog = async (logData) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("Authentication token is missing.");
                return;
            }
            await axios.post("http://localhost:8000/api/user-logs/", logData, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            if (error.response) {
                console.error("Error saving user log:", error.response.data);
                alert(JSON.stringify(error.response.data)); // Show backend error
            } else {
                console.error("Error saving user log:", error.message);
            }
        }
    };
    const checkSorting = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        let isPreviousCorrect = true;
        let isAlreadySorted = false;

        const results = grids.map((grid, index) => {
            if (isPreviousCorrect && !isAlreadySorted && checkIteration(grid, index)) {
                if (isSorted(grid)) isAlreadySorted = true;
                correctCount++;
                return { iteration: index + 1, correct: true };
            } else {
                incorrectCount++;
                isPreviousCorrect = false;
                return { iteration: index + 1, correct: false };
            }
        });

        setIterationResults(results);
        setIsModalOpen(true);
        
        // Calculate score and remarks
        const totalPoints = 60;
        const iterationsRequired = correctSteps.length - 1;
        const pointsPerIteration = totalPoints / iterationsRequired;
        const penaltyPerExtraIteration = pointsPerIteration / 4;
        let calculatedScore = 0;

        results.forEach((result, index) => {
            if (index < iterationsRequired) {
                if (result.correct) {
                    calculatedScore += pointsPerIteration;
                } else {
                    calculatedScore -= penaltyPerExtraIteration;
                }
            } else {
                calculatedScore -= penaltyPerExtraIteration;
            }
        });

        calculatedScore = Math.max(0, calculatedScore);
        const passingScore = 0.7 * totalPoints;
        const calculatedRemarks = calculatedScore >= passingScore ? "Pass" : "Fail";

        // Use username from context
        const username = user?.username || "guest";

        // Calculate duration if startTime is available
        let duration = "00:00:00";
        if (startTime) {
            const endTime = Date.now();
            const diff = Math.floor((endTime - startTime) / 1000);
            const mins = String(Math.floor(diff / 60)).padStart(2, "0");
            const secs = String(diff % 60).padStart(2, "0");
            duration = `00:${mins}:${secs}`;
        }

        // Prepare log data
        const logData = {
            username: username,
            game_name: "Sort Shift - Insertion Sort",
            date_time: new Date().toISOString(),
            duration: duration,
            score: parseFloat(calculatedScore.toFixed(2)),
            remarks: calculatedRemarks,
            attempts: 1, // You can increment this if you track attempts elsewhere
        };

        sendUserLog(logData);
    };
    

    
    const totalPoints = 60;
    const iterationsRequired = correctSteps.length - 1;
    const pointsPerIteration = totalPoints / iterationsRequired;
    const penaltyPerExtraIteration = pointsPerIteration / 2;
    let score = 0;

    iterationResults.forEach((result, index) => {
        if (index < iterationsRequired) {
            if (result.correct) {
                score += pointsPerIteration;
            } else {
                score -= penaltyPerExtraIteration;
            }
        } else {
            score -= penaltyPerExtraIteration;
        }
    });

    score = Math.max(0, score);
    const passingScore = 0.7 * totalPoints;
    const remarks = score >= passingScore ? "Pass" : "Fail";

    return (
        <div className={styles['short-shift-container']}>
            <video className={styles['background-video']} autoPlay loop muted>
            <source src="/video/insertion_bg.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
            </video>
             {isTutorialOpen && (
                             <div className={styles["tutorial-modal"]}>
                                 <div className={styles["tutorial-content"]}>
                                     <div className={styles["tutorial-header"]}>
                                         <h1>{tutorialPages[tutorialPage].title}</h1>
                                         <button className={styles["close-btn"]} onClick={closeTutorial}>
                                             X
                                         </button>
                                     </div>
                                     <div className={styles["tutorial-body"]}>
                                         {tutorialPages[tutorialPage].content}
                                     </div>
                                     <div className={styles["tutorial-navigation"]}>
                                         <button
                                             className={styles["previous-btn"]}
                                             onClick={handlePrevious}
                                             disabled={tutorialPage === 0}
                                         >
                                             Previous
                                         </button>
                                         <button
                                             className={styles["next-btn"]}
                                             onClick={handleNext}
                                             disabled={tutorialPage === tutorialPages.length - 1}
                                         >
                                             Next
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         )}
            <div className={styles['content']}>
                {!isTutorialOpen && (
                    <>
                        <h1 className={styles["title-game"]}>Sort Shift</h1>
                        <p className={styles["instruction"]}>Instruction: Use insertion sort to arrange the numbers in ascending order.</p>
                        <div className={styles["array-label"]}>Original Array:</div>
                        <div className={styles["orig-grid-container"]}>
                            {originalArray.map((num, index) => (
                                <div key={index} className={styles["orig-grid-item"]}>
                                    {num}
                                </div>
                            ))}
                        </div>

                        <div className={styles["iterations"]}>
                            <h2 className={styles["bubble-sort-title"]}>Insertion Sort</h2>
                            <div className={styles["game-controls"]}>
                                <button
                                    className={`${styles["control-btn"]} ${styles["tutorial-btn"]}`}
                                    onClick={() => setIsTutorialOpen(true)}
                                >
                                    <img src={tutorialLogo} alt="Tutorial" className={styles["tutorial-logo"]} />
                                </button>

                                <button className={`${styles["control-btn"]} ${styles["music-btn"]}`} onClick={toggleMusic}>
                                    <div className={`${styles["music-logo-wrapper"]} ${!isPlaying ? styles["slashed"] : ""}`}>
                                        <img src={musicLogo} alt="Music" className={styles["music-logo"]} />
                                    </div>
                                </button>
                            </div>
                            <div className={styles["controls"]}>
                                <button className={styles["add-btn"]} onClick={addGrid}>+</button>
                                <button className={styles["remove-btn"]} onClick={removeGrid}>-</button>
                            </div>
                            {grids.map((grid, gridIndex) => {
                                let correctResult = [...originalArray];
                                for (let i = 0; i <= gridIndex; i++) {
                                    for (let j = 0; j < correctResult.length - i - 1; j++) {
                                        if (correctResult[j] > correctResult[j + 1]) {
                                            [correctResult[j], correctResult[j + 1]] = [correctResult[j + 1], correctResult[j]];
                                        }
                                    }
                                }

                                const isExtraIteration = iterationResults.length > 0 && iterationResults[gridIndex]?.correct === false && isSorted(grids[gridIndex]);

                                return (
                                    <div key={gridIndex}>
                                        <h3 className={styles["iteration-title"]}>{getOrdinalSuffix(gridIndex + 1)} Iteration</h3>
                                        <div className={styles["grid-container"]}>
                                            {grid.map((num, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className={`${styles["grid-item"]} ${selected.gridIndex === gridIndex && selected.itemIndex === itemIndex ? styles["selected"] : ""}`}
                                                    onClick={() => handleSelect(gridIndex, itemIndex)}
                                                >
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            <button className={styles["submit-btn"]} onClick={() => setIsConfirmModalOpen(true)}>Submit</button>
                        </div>
                    </>
                )}
            </div>
            {isConfirmModalOpen && (
                <div className={styles["modal-overlay-confirm"]}>
                    <div className={styles["modal-content-confirm"]}>
                        <div className={styles["modal-header-confirm"]}>
                            <h2>Confirm Submission</h2>
                        </div>
                        <div className={styles["modal-body-confirm"]}>
                            <p>Are you sure you want to submit your answer?</p>
                            <div className={styles["modal-warning"]}>
                                <span className={styles["warning-icon"]}>⚠️</span>
                                <br /> This action cannot be undone.
                            </div>
                        </div>
                        <div className={styles["modal-footer-confirm"]}>
                            <button className={styles["submit-btn-confirm"]} onClick={() => {
                                const sound = backgroundSound.current;
                                sound.pause();
                                sound.currentTime = 0;
                                checkSorting();
                                setIsConfirmModalOpen(false);
                            }}>
                                Yes, Submit
                            </button>
                            <button className={styles["cancel-btn-confirm"]} onClick={() => setIsConfirmModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className={styles["modal-overlay"]}>
                    <div className={styles["modal-content"]}>
                        <div className={styles["modal-header"]}>
                            <h2>Sorting Results</h2>
                        </div>
                        <div className={styles["score-container"]}>
                            {(() => {
                                const totalPoints = 60;
                                const iterationsRequired = correctSteps.length - 1;
                                const pointsPerIteration = totalPoints / iterationsRequired;
                                const penaltyPerExtraIteration = pointsPerIteration / 2;
                                let score = 0;

                                iterationResults.forEach((result, index) => {
                                    if (index < iterationsRequired) {
                                        if (result.correct) {
                                            score += pointsPerIteration;
                                        } else {
                                            score -= penaltyPerExtraIteration;
                                        }
                                    } else {
                                        score -= penaltyPerExtraIteration;
                                    }
                                });

                                score = Math.max(0, score);

                                const passingScore = 0.7 * totalPoints;
                                const remarks = score >= passingScore ? "Pass" : "Fail";
                                const remarksClass = score >= passingScore ? styles["pass"] : styles["fail"];

                                return (
                                    <div className={styles["score-container"]}>
                                        <p>Score: {score.toFixed(2)} / <span className={styles["total-points"]}>{totalPoints}</span></p>
                                        <p>Remark: <span className={remarksClass}>{remarks}</span></p>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className={styles["results-container"]}>
                            <div>
                                <h3 className={styles["results-title"]}>Your Answers</h3>
                                <hr />
                                {grids.map((grid, index) => (
                                    <div key={index}>
                                        <h4 className={styles["iteration-title"]}>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className={styles["grid-container"]}>
                                            {grid.map((num, i) => (
                                                <div key={i} className={styles["grid-item"]}>
                                                    {num}
                                                </div>
                                            ))}
                                            <span
                                                className={`${styles["iteration-status-icon"]} ${iterationResults[index]?.correct ? styles["correct"] : styles["incorrect"]}`}>
                                                {iterationResults[index]?.correct ? "✓" : "X"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className={styles["results-title"]}>Correct Answers</h3>
                                <hr />
                                {correctSteps.slice(1).map((step, index) => (
                                    <div key={index}>
                                        <h4 className={styles["iteration-title"]}>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className={styles["grid-container"]}>
                                            {step.map((num, i) => (
                                                <div key={i} className={styles["grid-item"]}>
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles["reset-container"]}>
                            
                            <button className={styles["reset-btn"]} onClick={() => window.location.reload()}>
                                Reset
                            </button>
                            <button
                                className={styles["next-btn"]}
                                onClick={() => navigate("/sortshift")}
                                disabled={remarks === "Fail"}
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default SortShiftInsertion;
