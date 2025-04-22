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
import simulation from '../../assets/selection/simulation.gif';

import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';

import styles from './SortShiftSelection.module.css';

const SortShiftSelection= () => {
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
        <div className={styles['short-shift-container']}>
            <video className={styles['background-video']} autoPlay loop muted>
                <source src="/video/selection_bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
             {isTutorialOpen && (
                <div className={styles["tutorial-modal"]}>
                    <div className={styles["tutorial-content"]}>
                        <h1>Selection Sort</h1>
                        <hr className={styles["divider"]}></hr>
                        <p className={styles["description"]}>
                            <strong>Selection Sort</strong> is a simple comparison-based sorting algorithm. It repeatedly selects the smallest (or largest, depending on the order) element from the unsorted portion of the array and places it in its correct position. This process continues until the entire array is sorted.
                        </p>
                        <div className={styles["how-it-works"]}>
                            <h3>How it works:</h3>
                            <ol className={styles["steps-list"]}>
                                <li>Start with the first element in the array.</li>
                                <li>Find the smallest element in the unsorted portion of the array.</li>
                                <li>Swap the smallest element with the first element of the unsorted portion.</li>
                                <li>Move to the next element and repeat the process for the remaining unsorted portion of the array.</li>
                                <li>Continue until the entire array is sorted.</li>
                            </ol>
                        </div>
                        <p className={styles["additional-info"]}>
                            <strong>Selection Sort </strong>is an intuitive algorithm that works well for small datasets. However, it is not efficient for large datasets due to its time complexity of O(n²). Continue reading to learn how to implement it in the game.
                        </p>
                        <div className={styles["line-break"]}>
                            <hr className={styles["divider"]}></hr>
                        </div>
                        <div className={styles["manual-run-through"]}>
                            <h2>Manual Run Through</h2>
                            <p className={styles["step-description1"]}>
                                <strong>Step 1: </strong> We start with an unsorted array.
                                <img src={unsortedImg} alt="Unsorted Array" className={styles["unsorted-image"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 2: </strong>The first element 12 is already the smallest in the array, so no swap is needed and we are done with first iteration.
                                <img src={firstIteration} alt="First Iteration" className={styles["first-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 3: </strong>  Move to the second position. Find the smallest element in the unsorted portion (23). 
                                <img src={secondIteration} alt="Second Iteration" className={styles["second-compare"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with second iteration. <br></br>
                                <img src={firstSwapped} alt="First Swap" className={styles["first-swap"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 4: </strong> You can see here that the smallest element is 34, which already in the correct position, so no swap is needed.
                                <img src={thirdIteration} alt="Third Iteration" className={styles["first-swap"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 5: </strong>  Move the fourth position. Find the smallest element in the unsorted portion (45).
                                <img src={fourthIteration} alt="Fourth Iteration" className={styles["fourth-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with fourth iteration. <br></br>
                                <img src={secondSwapped} alt="Second Compare" className={styles["second-swap"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 6: </strong> Move to the fifth position. Find the smallest element in the unsorted portion (56).
                                <img src={fifthIteration} alt="Fifth Iteration" className="fifth-iteration" />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with fifth iteration. <br></br>
                                <img src={thirdSwapped} alt="Third Swapped" className={styles["third-swap"]} /> 
                            </p>
                            <p>
                                <strong>Step 7: </strong>  Move to the sixth position. Find the smallest element in the unsorted portion (67).
                                <img src={sixthIteration} alt="Sixth Iteration" className="sixth-iteration" />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with sixth iteration. <br></br>
                                <img src={forthSwapped} alt="Fourth Swapped" className={styles["fourth-swap"]} /> 
                            </p>
                        </div>
                        <p>
                            The array is now sorted! The final sorted array is: [12, 23, 34, 45, 56, 67, 78]. 
                        </p>
                        <br></br>
                        <p>
                            <strong>Remarks:</strong>  Find the smallest element in the unsorted portion of the array and swap it with the first element of the unsorted portion. Repeat this process until the entire array is sorted.
                        </p>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["simulation"]}>
                            <p>
                                Watch the simulation to see how the algorithm works in real-time.
                            </p>
                            
                            <img src={simulation} alt="Iteration GIF" className="simulation-gif" />
                        </div>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["game-introduction"]}>
                            <h2>Welcome to Sort Shift!</h2>
                            <p>
                                Sort Shift is an interactive game designed to help you understand and practice the Selection Sort algorithm. 
                                Your task is to sort a series of numbers in ascending order by selecting the smallest element from the unsorted portion of the array 
                                and swapping it with the first element of the unsorted portion. This process continues until the entire array is sorted.
                                The game challenges you to think critically and apply the sorting steps efficiently. Each move you make will be evaluated, 
                                and your score will reflect how accurately and efficiently you complete the sorting process.
                            </p>
                            <h2>How to Play:</h2>
                            <ul>
                                <li>Click on the smallest element in the unsorted portion of the array.</li>
                                <li>Swap it with the first element of the unsorted portion.</li>
                                <li>Repeat this process until the array is fully sorted.</li>
                                <li>If the current position already contains the smallest element, you still need to add an iteration to proceed.</li>
                            </ul>
                        </div>
                        <div className={styles["line-break"]}>
                            <hr></hr>
                        </div>
                        <div className={styles["scoring-system"]}>
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
