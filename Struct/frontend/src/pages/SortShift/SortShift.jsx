import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "./SortShift.css";

const ShortShift = () => {
    const [numbers, setNumbers] = useState([3, 1, 2, 6, 8, 5]);
    const [selected, setSelected] = useState([]);

    const handleSelect = (index) => {
        if (selected.length === 1 && selected[0] !== index) {
            swapNumbers(selected[0], index);
            setSelected([]);
        } else {
            setSelected([index]);
        }
    };

    const swapNumbers = (index1, index2) => {
        let newNumbers = [...numbers];
        [newNumbers[index1], newNumbers[index2]] = [newNumbers[index2], newNumbers[index1]];
        setNumbers(newNumbers);
    };

    return (
        <div className="short-shift-container">
            <h1>Sort Shift</h1>
            <p className="instruction">Instruction: Use bubble sort to arrange the game items in ascending order based on their value or attribute.</p>
            <div className="array-label">Original Array:</div>
            <div className="grid-container">
                {numbers.map((num, index) => (
                    <div 
                        key={index} 
                        className={`grid-item ${selected.includes(index) ? "selected" : ""}`}
                        onClick={() => handleSelect(index)}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShortShift;
