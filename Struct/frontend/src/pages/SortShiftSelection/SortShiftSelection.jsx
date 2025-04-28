import React, { useEffect, useState, useRef } from "react";
import unsortedImg from '../../assets/selection/unsorted.png';
import firstIteration from '../../assets/selection/first_iteration.png';
import secondIteration from '../../assets/selection/second_iteration.png';
import thirdIteration from '../../assets/selection/third_iteration.png';
import fourthIteration from '../../assets/selection/fourth_iteration.png';
import fifthIteration from '../../assets/selection/fifth_iteration.png';
import sixthIteration from '../../assets/selection/sixth_iteration.png';
import firstSwapped from '../../assets/selection/swapped1.png';
import secondSwapped from '../../assets/selection/swapped2.png';
import thirdSwapped from '../../assets/selection/swapped3.png';
import forthSwapped from '../../assets/selection/swapped4.png';
import simulation from '../../assets/selection/selection_gif.gif';

import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';

import styles from './SortShiftSelection.module.css';

const SortShiftSelection = () => {
    const backgroundSound = useRef(new Audio("/sounds/selection_background.mp3")); 

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
    const [tutorialPage, setTutorialPage] = useState(0); // Track the current tutorial page

    const tutorialPages = [
        {
            title: "SELECTION SORT",
            content: (
                <>
                    <p><strong>Selection sort </strong>is a basic sorting algorithm that works by repeatedly finding the smallest (or largest) element from the unsorted part of the list and swapping it with the first element of that part. It continues this process until the entire list is sorted</p>
                    <p>Watch the simulation to see how the algorithm works in real-time.</p>
                    <img src={simulation} alt="Iteration GIF" className="simulation-gif" />
                </>
            ),
        },
        {
            title: "How to Play",
            content: (
                <>
                    <h2>How to Play:</h2>
                    <ul>
                        <li>Click on the smallest element in the unsorted portion of the array.</li>
                        <li>Swap it with the first element of the unsorted portion.</li>
                        <li>Repeat this process until the array is fully sorted.</li>
                        <li>If the current position already contains the smallest element, you still need to add an iteration to proceed.</li>
                    </ul>
                </>
            ),
        },
        {
            title: "Scoring Works",
            content: (
                <>
                    <h2>How Scoring Works</h2>
                    <p>
                        Your score in the Short Shift game is based on how accurately and efficiently you sort the array using the Selection Sort algorithm. Here's how the scoring works:
                    </p>
                    <ul>
                        <li><strong>Correct Iterations:</strong> You earn points for each correct iteration. The total points are divided equally among the required iterations.</li>
                        <li><strong>Incorrect Iterations:</strong> Points are deducted for incorrect iterations.</li>
                        <li><strong>Extra Iterations:</strong> Points are also deducted if you perform unnecessary extra iterations after the array is already sorted.</li>
                        <li><strong>Reminder:</strong> Even if the current position already contains the smallest element, you must add an iteration to proceed.</li>
                        <li><strong>Maximum Score:</strong> The maximum score you can achieve is <strong>60 points</strong>.</li>
                        <li><strong>Passing Score:</strong> To pass, you need to score at least <strong>70%</strong> of the total points (42 points).</li>
                    </ul>
                    <p>
                        Aim to complete the sorting process with as few mistakes and extra iterations as possible to maximize your score!
                    </p>
                </>
            ),
        },
    ];

    useEffect(() => {
        const randomArray = generateRandomArray();
        setOriginalArray(randomArray);
        setGrids([randomArray]);
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

    const swapNumbers = (gridIndex, itemIndex1, itemIndex2) => {
        let newGrids = [...grids];
        let newGrid = [...newGrids[gridIndex]];
        [newGrid[itemIndex1], newGrid[itemIndex2]] = [newGrid[itemIndex2], newGrid[itemIndex1]];
        newGrids[gridIndex] = newGrid;
        setGrids(newGrids);
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

    const closeTutorial = () => {
        setIsTutorialOpen(false);
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

    const selectionSortSteps = () => {
        let arr = [...originalArray];
        let steps = [arr.slice()]; 
        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }
            steps.push(arr.slice()); 

            if (isSorted(arr)) {
                break;
            }
        }
        return steps;
    };

    
    const correctSteps = selectionSortSteps();

    const checkIteration = (grid, gridIndex) => {
        let arr = [...originalArray];
        for (let i = 0; i <= gridIndex; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }
        }

        if (gridIndex >= correctSteps.length - 1) {
            return false;
        }

        return JSON.stringify(grid) === JSON.stringify(arr);
    };

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

    };
    const totalPoints = 60;
    const iterationsRequired = correctSteps.length - 1;
    const pointsPerIteration = totalPoints / iterationsRequired;
    const penaltyPerExtraIteration = pointsPerIteration / 4;
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
        <div className={styles["short-shift-container"]}>
            
            {isTutorialOpen && (
                <div className={styles["tutorial-modal"]}>
                    <div className={styles["tutorial-content"]}>
                        <div className={styles["tutorial-header"]}>
                            <h1>{tutorialPages[tutorialPage].title}</h1>
                            <button className={styles["close-btn"]} onClick={closeTutorial}>
                                X
                            </button>
                        </div>
                        <hr className={styles["divider"]}></hr>
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
                    <p className={styles["instruction"]}>Instruction: Use selection sort to arrange the numbers in ascending order.</p>
                    <div className={styles["array-label"]}>Original Array:</div>
                    <div className={styles["orig-grid-container"]}>
                        {originalArray.map((num, index) => (
                            <div key={index} className={styles["orig-grid-item"]}>
                                {num}
                            </div>
                        ))}
                    </div>

                    <div className={styles["iterations"]}>
                        <h2 className={styles["bubble-sort-title"]}>Selection Sort</h2>
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
                            <button
                                className={styles["previous-btn"]}
                                onClick={() => window.location.reload()}
                                disabled={remarks === "Fail"}
                            >
                                PREVIOUS
                            </button>
                            <button className={styles["reset-btn"]} onClick={() => window.location.reload()}>
                                RESET
                            </button>
                            <button
                                className={styles["next-btn"]}
                                onClick={() => window.location.reload()}
                                disabled={remarks === "Fail"}
                            >
                                NEXT
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default SortShiftSelection;
