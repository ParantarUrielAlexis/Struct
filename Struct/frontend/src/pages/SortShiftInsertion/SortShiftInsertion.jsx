import React, { useEffect, useState, useRef } from "react";
import unsortedImg from '../../assets/insertion/unsorted.png';
import firstIteration from '../../assets/insertion/first_iteration.png';
import secondIteration from '../../assets/insertion/second_iteration.png';
import thirdIteration from '../../assets/insertion/third_iteration.png';
import fourthIteration from '../../assets/insertion/fourth_iteration.png';
import fifthIteration from '../../assets/insertion/fifth_iteration.png';
import sixthIteration from '../../assets/insertion/sixth_iteration.png';

import firstSwapped from '../../assets/insertion/swapped1.png';
import secondSwapped from '../../assets/insertion/swapped2.png';
import thirdSwapped from '../../assets/insertion/swapped3.png';
import forthSwapped from '../../assets/insertion/swapped4.png';
import simulation from '../../assets/insertion/simulation.gif';

import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';


import styles from './SortShiftInsertion.module.css';

const SortShiftInsertion = () => {
    const backgroundSound = useRef(new Audio("/sounds/insertion_background.mp3")); 
    
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

        {/* Optional Overlay */}
        
        <div className={styles['background-overlay']}></div>
             {isTutorialOpen && (
                <div className={styles["tutorial-modal"]}>
                    <div className={styles["tutorial-content"]}>
                        <h1>Insertion Sort</h1>
                        <hr className={styles["divider"]}></hr>
                        <p className={styles["description"]}>
                            <strong>Insertion Sort</strong> is a simple comparison-based sorting algorithm. It builds the final sorted array one element at a time by repeatedly taking the next unsorted element and inserting it into its correct position in the sorted portion of the array.
                        </p>
                        <div className={styles["how-it-works"]}>
                            <h3>How it works:</h3>
                            <ol className={styles["steps-list"]}>
                                <li>Start from the second element in the array (index 1).</li>
                                <li>Compare it with elements before it and shift larger elements to the right.</li>
                                <li>Insert the current element into its correct position.</li>
                                <li>Repeat this process for each element in the array.</li>
                                <li>Continue until all elements are placed in the correct order.</li>
                            </ol>
                        </div>
                        <p className={styles["additional-info"]}>
                            <strong>Insertion Sort</strong> is an intuitive algorithm that works well for small datasets or nearly sorted arrays. However, like other basic sorting algorithms, its time complexity is O(n²) in the worst case.
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
                            <strong>Step 2: </strong> Compare (12) with (42). Since (12) is smaller, we shift (42) and insert (12) in the first position.
                                <img src={firstIteration} alt="First Iteration" className={styles["first-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with first iteration. <br></br>
                                <img src={firstSwapped} alt="First Swap" className={styles["first-swap"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 3: </strong> Compare (34) with (42). Since 34 is smaller, we shift 42 and insert 34 before it. 
                                <img src={secondIteration} alt="Second Iteration" className={styles["second-compare"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> We swap them and we are done with second iteration. <br></br>
                                <img src={secondSwapped} alt="Second Compare" className={styles["second-swap"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                            <strong>Step 4: </strong> (65) is already greater than all sorted elements, so it stays in place. We are done with third iteration.
                                <img src={thirdIteration} alt="Third Iteration" className={styles["first-swap"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Step 5: </strong> Compare (23) with (65), (42), and (34). Shift all of them and insert 23 after 12.<br />
                                <img src={fourthIteration} alt="Fourth Iteration" className={styles["fourth-compare"]} />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> Elements were shifted and 23 was inserted in its correct spot. We are done with fourth iteration. <br></br>
                                <img src={thirdSwapped} alt="Third Swapped" className={styles["third-swap"]} /> 
                            </p>
                            <p className={styles["step-description"]}>
                            <strong>Step 6: </strong> (78) is greater than all sorted elements, so it stays in place.
                                <img src={fifthIteration} alt="Fifth Iteration" className="fifth-iteration" />
                            </p>
                            <p>
                                <strong>Step 7: </strong> Compare (56) with (78) and (65). Shift both, then insert 56 before them.
                                <img src={sixthIteration} alt="Sixth Iteration" className="sixth-iteration" />
                            </p>
                            <p className={styles["step-description"]}>
                                <strong>Swapped: </strong> 56 was inserted at the correct position after shifting larger values. <br></br>
                                <img src={forthSwapped} alt="Fourth Swapped" className={styles["fourth-swap"]} /> 
                            </p>
                        </div>
                        <p>
                            The array is now sorted! The final sorted array is: <strong>[12, 23, 34, 42, 56, 65, 78]</strong>.
                        </p>
                        <br></br>
                        <p>
                            <strong>Remarks:</strong> In <i>Insertion Sort</i>, we build the sorted array one element at a time by comparing each new element with those before it and inserting it into its correct position. Larger elements are shifted to make space when needed.
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
                                Sort Shift is an interactive game designed to help you understand and practice the Insertion Sort algorithm. 
                                Your task is to sort a series of numbers in ascending order by repeatedly picking an element from the unsorted portion of the array 
                                and inserting it into its correct position in the sorted portion. This process continues until the entire array is sorted.
                                The game challenges you to think critically and apply the sorting steps efficiently. Each move you make will be evaluated, 
                                and your score will reflect how accurately and efficiently you complete the sorting process.
                            </p>
                            <h2>How to Play:</h2>
                            <ul>
                                <li>Click on the element you want to insert into the sorted portion of the array.</li>
                                <li>Move it to its correct position in the sorted portion by swapping it with larger elements.</li>
                                <li>Repeat this process until the array is fully sorted.</li>
                                <li>If the element is already in its correct position, you still need to proceed to the next iteration.</li>
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

export default SortShiftInsertion;
