/**
 * ShapeList Component
 *
 * This component allows users to add rectangles and circles to the canvas.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onAddShape - A callback function to add a shape to the canvas.
 */

import React from 'react';

function ShapeList({ onAddShape }) {
    /**
     * Handles the click event when the "Add Rectangle" button is clicked.
     * Calls the `onAddShape` callback with the type 'rectangle' to add a rectangle shape.
     */
    const handleAddRectangle = () => {
        onAddShape('rectangle');
    };

    /**
     * Handles the click event when the "Add Circle" button is clicked.
     * Calls the `onAddShape` callback with the type 'circle' to add a circle shape.
     */
    const handleAddCircle = () => {
        onAddShape('circle');
    };

    return (
        <div className="shape-list">
            <button className="shape-button" onClick={handleAddRectangle}>Add Rectangle</button>
            <button className="shape-button" onClick={handleAddCircle}>Add Circle</button>
        </div>
    );
}

export default ShapeList;
