import React, { useEffect, useState, useRef } from "react";
import unsortedImg from '../../assets/bubble/unsorted.png';
import firstCompare from '../../assets/bubble/first_compare.png';
import secondCompare from '../../assets/bubble/second_compare.png';
import thirdCompare from '../../assets/bubble/third_compare.png';
import fourthCompare from '../../assets/bubble/fourth_compare.png';
import fifthCompare from '../../assets/bubble/fifth_compare.png';
import sixthCompare from '../../assets/bubble/sixth_compare.png';
import firstSwap from '../../assets/bubble/first_swap.png';
import secondSwap from '../../assets/bubble/second_swap.png';
import thirdSwap from '../../assets/bubble/third_swap.png';
import fourthSwap from '../../assets/bubble/fourth_swap.png';
import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';

import iterationGIF from '../../assets/bubble/first_iteration.gif';

import styles from './SortShiftBubble.module.css';

const SortShiftBubble = () => {
    const backgroundSound = useRef(new Audio("/sounds/bubble_background.mp3")); 

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

    const swapNumbers = (gridIndex, itemIndex1, itemIndex2) => {
        let newGrids = [...grids];
        let newGrid = [...newGrids[gridIndex]];
        [newGrid[itemIndex1], newGrid[itemIndex2]] = [newGrid[itemIndex2], newGrid[itemIndex1]];
        newGrids[gridIndex] = newGrid;
        setGrids(newGrids);
    };
    
    const closeTutorial = () => {
        setIsTutorialOpen(false);
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

    const checkSorting = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        let isPreviousCorrect = true; // Track if the previous iteration was correct
        let isAlreadySorted = false; // Track if the array is already sorted
    
        const results = grids.map((grid, index) => {
            if (isPreviousCorrect && !isAlreadySorted && checkIteration(grid, index)) {
                if (isSorted(grid)) {
                    isAlreadySorted = true; // Mark as sorted if the current grid is sorted
                }
                correctCount++;
                return { iteration: index + 1, correct: true };
            } else {
                incorrectCount++;
                isPreviousCorrect = false; // Mark subsequent iterations as incorrect
                return { iteration: index + 1, correct: false };
            }
        });
        
    
        setIterationResults(results);
        setIsModalOpen(true); // Open the modal

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
                        <h1>Bubble Sort</h1>
                        <hr className={styles["divider"]}></hr>
                        <p className={styles["description"]}>
                            <strong>Bubble sort</strong> is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top (beginning of the list), while larger elements sink to the bottom (end of the list) with each pass.
                        </p>
                        <div className={styles["how-it-works"]}>
                            <h3>How it works:</h3>
                            <ol className={styles["steps-list"]}>
                                <li>Start at the beginning of the array.</li>
                                <li>Compare the current element with the next one.</li>
                                <li>If the current element is greater than the next, swap them.</li>
                                <li>Move to the next pair and repeat until the end of the array.</li>
                                <li>Repeat the whole process for the remaining unsorted part.</li>
                                <li>Stop when no swaps are needed in a full pass.</li>
                            </ol>
                        </div>
                        <p className={styles["additional-info"]}>
                        Continue reading to fully understand the Bubble Sort algorithm and how to implement it yourself.
                        </p>
                        <div className={styles["line-break"]}>
                            <hr className={styles["divider"]}></hr>
                        </div>
                        <div className={styles["manual-run-through"]}>
                            <h2>Manual Run Through</h2>
                            <p className={styles["step-description"]}>
                                <strong>Step 1: </strong> We start with an unsorted array.
                                <img src={unsortedImg} alt="Unsorted Array" className={styles["unsorted-image"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 2: </strong> We look at the two first values. Does the lowest value come first? Yes, so we don't need to swap them.
                                <img src={firstCompare} alt="First Compare" className={styles["first-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 3: </strong>  Take one step forward and look at values 10 and 8. Does the lowest value come first? No.
                                <img src={secondCompare} alt="Second Compare" className={styles["second-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 4: </strong>  So we need to swap them so that 8 comes first.
                                <img src={firstSwap} alt="First Swap" className={styles["first-swap"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 5: </strong>  Taking one step forwards and look at value 10 and 4. Does the lowest value come first? No.
                                <img src={thirdCompare} alt="Third Compare" className={styles["third-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 6: </strong>  Let's swap them so that 4 comes first.
                                <img src={secondSwap} alt="Second Swap" className={styles["second-swap"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 7: </strong>  Looking at 10 and 9. Do we need to swap them? Yes.
                                <img src={fourthCompare} alt="Fourth Compare" className={styles["fourth-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 8: </strong>  We must swap them so that 9 comes first.
                                <img src={thirdSwap} alt="Third Swap" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 9: </strong>  Now take a look at 10 and 56. Do we need to swap them? No.
                                <img src={fifthCompare} alt="Fifth Compare" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 10: </strong> Now we look at 56 and 6. Do we need to swap them? Yes.
                                <img src={sixthCompare} alt="Sixth Compare" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 11: </strong> Now we look at 56 and 6. Do we need to swap them? Yes.
                                <img src={fourthSwap} alt="Fourth Swap" className="fourth-compare" />
                            </p>
                        </div>
                        <p>
                            Now we have completed one iteration. The largest number (56) has "bubbled" to the end of the array. We repeat the process for the remaining unsorted part of the array until no swaps are needed in a full pass.
                        </p>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["simulation"]}>
                            <p>
                                Watch the simulation to see how the algorithm works in real-time.
                            </p>
                            
                            <img src={iterationGIF} alt="Iteration GIF" className="iteration_gif" />
                        </div>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["game-introduction"]}>
                            <h2>Welcome to Sort Shift!</h2>
                            <p>
                                Sort Shift is an interactive game designed to help you understand and practice the Bubble Sort algorithm. 
                                Your task is to sort a series of numbers in ascending order by swapping adjacent elements, just like in Bubble Sort.
                                The game challenges you to think critically and apply the sorting steps efficiently. Each move you make will be evaluated, 
                                and your score will reflect how accurately and efficiently you complete the sorting process.
                            </p>
                            <h2>How to Play:</h2>
                            <ul>
                                <li>Click on two adjacent boxes to swap their positions.</li>
                                <li>Repeat this process until the array is fully sorted.</li>
                                <li>Remember, you can only swap adjacent elements!</li>
                            </ul>
                        </div>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["scoring-system"]}>
                        <h2>How Scoring Works</h2>
                        <p>
                            Your score in the Short Shift game is based on how accurately and efficiently you sort the array using the Bubble Sort algorithm. Here's how the scoring works:
                        </p>
                        <ul>
                            <li><strong>Correct Iterations:</strong> You earn points for each correct iteration. The total points are divided equally among the required iterations.</li>
                            <li><strong>Incorrect Iterations:</strong> Points are deducted for incorrect iterations.</li>
                            <li><strong>Extra Iterations:</strong> Points are also deducted if you perform unnecessary extra iterations after the array is already sorted.</li>
                            <li><strong>Maximum Score:</strong> The maximum score you can achieve is <strong>60 points</strong>.</li>
                            <li><strong>Passing Score:</strong> To pass, you need to score at least <strong>70%</strong> of the total points (42 points).</li>
                        </ul>
                        <p>
                            Aim to complete the sorting process with as few mistakes and extra iterations as possible to maximize your score!
                        </p>
                    </div>
                    <button className={styles["start-btn"]} onClick={closeTutorial}>
                                Start Game
                    </button>
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

export default SortShiftBubble;
