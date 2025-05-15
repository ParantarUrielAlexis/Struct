import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import simulation from '../../assets/insertion/simulation1.gif';
import simulation2 from '../../assets/insertion/simulation2.gif';
import simulation3 from '../../assets/insertion/simulation3.gif';
import simulation4 from '../../assets/insertion/simulation4.gif';
import simulation5 from '../../assets/insertion/simulation5.gif';
import simulation6 from '../../assets/insertion/simulation6.gif';
import { useAuth } from '../../contexts/AuthContext'; 
import { FaHeart } from 'react-icons/fa'; 
import axios from 'axios';

import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';

import styles from './SortShiftInsertion.module.css';

const SortShiftInsertion = () => {
    const backgroundSound = useRef(new Audio("/sounds/insertion_background.mp3")); 
    const navigate = useNavigate();
    
    // Add heart functionality
    const { isAuthenticated, user: authUser, updateUser } = useAuth();
    const [hearts, setHearts] = useState(0); 
    const [hasDeductedHeart, setHasDeductedHeart] = useState(false);
    const [successTimeoutId, setSuccessTimeoutId] = useState(null);
    
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
                <div className={styles["simulation-grid"]}>
                    <div className={styles["simulation-row"]}>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation} alt="1st Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>1st Iteration (no  swap)</p>
                        </div>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation2} alt="2nd Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>2nd Iteration (no swap)</p>
                        </div>
                    </div>
                    <div className={styles["simulation-row"]}>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation3} alt="3rd Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>3rd Iteration (swapped)</p>
                        </div>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation4} alt="4th Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>4th Iteration (swapped)</p>
                        </div>
                    </div>
                    <div className={styles["simulation-row"]}>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation5} alt="5th Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>5th Iteration (no swap)</p>
                        </div>
                        <div className={styles["simulation-cell"]}>
                            <img src={simulation6} alt="6th Iteration" className={styles["simulation-gif"]} />
                            <p className={styles["simulation-label"]}>6th Iteration (swapped)</p>
                        </div>
                    </div>
                </div>
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

    // Fetch hearts from authenticated user
    useEffect(() => {
        if (isAuthenticated && authUser) {
            setHearts(authUser.hearts || 0);
        }
    }, [isAuthenticated, authUser]);

    // Handle page refresh heart deduction
    useEffect(() => {
        // Set up event listener for page refresh
        const handleBeforeUnload = (e) => {
            // Standard way to show a confirmation dialog on refresh/navigation away
            const message = 'Are you sure you want to leave? This will cost you 1 heart.';
            e.preventDefault();
            e.returnValue = message; // This is what shows in the confirmation dialog
            
            // Store information that the page is being refreshed intentionally
            sessionStorage.setItem('refreshIntended', 'true');
            
            return message; // For older browsers
        };

        // Check if there was an intended refresh
        const checkForRefresh = () => {
            const wasRefreshIntended = sessionStorage.getItem('refreshIntended') === 'true';
            
            // If this is a refresh (not first load) and heart hasn't been deducted yet
            if (wasRefreshIntended && !hasDeductedHeart && isAuthenticated && authUser) {
                deductHeart();
                // Clear the flag
                sessionStorage.removeItem('refreshIntended');
            }
        };
        
        // Function to deduct a heart
        const deductHeart = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                
                const newHeartCount = Math.max(0, authUser.hearts - 1);
                setHearts(newHeartCount);
                setHasDeductedHeart(true);
                
                // Update in the backend
                const API_BASE_URL = 'http://localhost:8000';
                const response = await axios.patch(
                    `${API_BASE_URL}/api/user/profile/`,
                    { hearts: newHeartCount },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        }
                    }
                );
                
                // Update user in context
                if (typeof updateUser === 'function' && response.data) {
                    updateUser({
                        ...authUser,
                        hearts: newHeartCount
                    });
                }
                
                // If no hearts left, redirect
                if (newHeartCount <= 0) {
                    alert("You don't have enough hearts to continue playing!");
                    navigate('/sortshift');
                }
            } catch (error) {
                console.error('Error updating heart count:', error);
            }
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // On component mount, check if this is a refresh
        checkForRefresh();
        
        // On first load, set a flag to indicate the page has been visited
        if (!sessionStorage.getItem('pageVisited')) {
            sessionStorage.setItem('pageVisited', 'true');
            // Clear any previous refresh intentions
            sessionStorage.removeItem('refreshIntended');
        }
        
        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            // Clear any lingering timeouts when component unmounts
            if (successTimeoutId) {
                clearTimeout(successTimeoutId);
            }
        };
    }, [isAuthenticated, authUser, hasDeductedHeart, navigate, updateUser, successTimeoutId]);

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

                        {/* Heart counter */}
                        <div className={styles["heart-counter"]}>
                            <FaHeart className={styles["heart-icon"]} />
                            <span className={styles["heart-count"]}>{hearts}</span>
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
