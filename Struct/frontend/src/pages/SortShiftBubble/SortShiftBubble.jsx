import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';
import iterationGIF from '../../assets/bubble/bubble_simulation.gif';
import styles from './SortShiftBubble.module.css';

const SortShiftBubble = () => {
    const backgroundSound = useRef(new Audio("/sounds/bubble_background.mp3")); 
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
    const [startTime, setStartTime] = useState(null);
    const tutorialPages = [
        {
            title: "How Bubble Sort Works",
            content: (
                <>
                    <div className="simulation-text">
                    <p><strong>Bubble Sort</strong> is a straightforward sorting algorithm that repeatedly traverses the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the entire list is sorted in ascending order.</p>
                    </div>
                    <br></br>
                    <h2>Here are the steps: </h2>
                    <ol>
                        <li>Start from the beginning of the array and compare the first two adjacent elements.</li>
                        <li>If the first element is greater than the second, swap them. Otherwise, move to the next pair.</li>
                        <li>Repeat this process for the entire array. After one pass, the largest element will be at the end.</li>
                        <li>Ignore the last sorted element(s) and repeat the process for the remaining unsorted portion of the array.</li>
                        <li>Continue until no swaps are needed, indicating that the array is fully sorted.</li>
                    </ol>
                    <p>Watch the simulation to see how the algorithm works in real-time.</p>
                    <img 
                        src={iterationGIF} 
                        alt="Bubble Sort Simulation" 
                        className="simulation-gif" 
                        style={{ width: '65%', height: 'auto', margin: '20px auto', display: 'block' }} 
                    />
                    <p>Note: This is only the first iteration of the entire sorting process.</p>
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

    const swapNumbers = (gridIndex, itemIndex1, itemIndex2) => {
        let newGrids = [...grids];
        let newGrid = [...newGrids[gridIndex]];
        [newGrid[itemIndex1], newGrid[itemIndex2]] = [newGrid[itemIndex2], newGrid[itemIndex1]];
        newGrids[gridIndex] = newGrid;
        setGrids(newGrids);
    };
    
    const closeTutorial = () => {
        setIsTutorialOpen(false);
        setStartTime(Date.now()); // Start the timer when the tutorial is closed
        const sound = backgroundSound.current;
        sound.volume = 0.2; 
        sound.loop = true; 
        sound.play();   
    };


    const addGrid = () => {
        const addGridSound = new Audio("/sounds/add.mp3");
        addGridSound.play();
        // Don't add new grids if the last grid is already sorted
        if (grids.length < 6 ) {
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

    // Function to check if the array is sorted
    const isSorted = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    };

    // Function to simulate bubble sort and store the steps
    const bubbleSortSteps = () => {
        let arr = [...originalArray];
        let steps = [arr.slice()];
        for (let i = 0; i < arr.length - 1; i++) {
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                }
            }
            if (swapped) {
                steps.push(arr.slice());
            } else {
                break; // No swaps, the array is sorted
            }
        }
        return steps;
    };

    // Generate the correct bubble sort steps
    const correctSteps = bubbleSortSteps();

    const checkIteration = (grid, gridIndex) => {
        // Dynamically compute the expected result for the current iteration
        let arr = [...originalArray];
        for (let i = 0; i <= gridIndex; i++) { // Include the current iteration
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }

        // Compare the user's grid with the dynamically computed result
        return JSON.stringify(grid) === JSON.stringify(arr);
    };

    // --- USER PROGRESS ---
    const updateProgress = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        await axios.post(
        'http://localhost:8000/api/user-progress/',
        { bubble_sort_passed: true },
        { headers: { Authorization: `Token ${token}` } }
        );
    } catch (err) {
        // Optionally handle error
    }
    };
    // --- USER LOGS INTEGRATION ---
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
                alert(JSON.stringify(error.response.data));
            } else {
                console.error("Error saving user log:", error.message);
            }
        }
    };

    // Update checkSorting to send user log
    const checkSorting = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        let isPreviousCorrect = true;
        let isAlreadySorted = false;

        const results = grids.map((grid, index) => {
            if (isPreviousCorrect && !isAlreadySorted && checkIteration(grid, index)) {
                if (isSorted(grid)) {
                    isAlreadySorted = true;
                }
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
        const penaltyPerExtraIteration = pointsPerIteration / 2;
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

        // Calculate duration (optional: add startTime logic if you want)
        let duration = "00:00:00";
        // If you have a startTime, use it here

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
            game_name: "Sort Shift - Bubble Sort",
            date_time: new Date().toISOString(),
            duration: duration,
            score: parseFloat(calculatedScore.toFixed(2)),
            remarks: calculatedRemarks,
            attempts: 1,
        };

        sendUserLog(logData);
        if(calculatedRemarks === "Pass"){
            updateProgress();
        }
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
            <source src="/video/bubble_bg.mp4" type="video/mp4" />
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
            {!isTutorialOpen && (
                <>
                    <h1 className={styles["title-game"]}>Sort Shift</h1>
                    <p className={styles["instruction"]}>Instruction: Use bubble sort to arrange the numbers in ascending order.</p>
                    <div className={styles["array-label"]}>Original Array:</div>
                    <div className={styles["orig-grid-container"]}>
                        {originalArray.map((num, index) => (
                            <div key={index} className={styles["orig-grid-item"]}>
                                {num}
                            </div>
                        ))}
                    </div>

                    <div className={styles["iterations"]}>
                        <h2 className={styles["bubble-sort-title"]}>Bubble Sort</h2>
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
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default SortShiftBubble;
