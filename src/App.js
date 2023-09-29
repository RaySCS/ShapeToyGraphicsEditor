/**
 * App.js
 *
 * This file defines the main application component, including the canvas, shape list, and property editor.
 *
 * Author: Rayaan Siddiqi
 */
import React, { useState } from 'react';
import './App.css';
import ShapeList from './components/ShapeList';
import Canvas from './components/Canvas';
import PropertyEditor from './components/PropertyEditor';

function App() {
    // State variables to manage shapes and selections
    const [shapes, setShapes] = useState([]);
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    /**
     * Adds a new shape to the canvas based on the provided shape type.
     *
     * @param {string} type - The type of shape to add (e.g., 'rectangle' or 'circle').
     */
    const addShape = (type) => {
        const newShape = {
            type,
            x: 50, // Initial x position
            y: 50, // Initial y position
            width: type === 'rectangle' ? 175 : undefined,
            height: type === 'rectangle' ? 100 : undefined,
            radius: type === 'circle' ? 50 : undefined,
            fillColor: '#ff0000',
        };

        setShapes([...shapes, newShape]);
    };

    /**
     * Handles the key down event, setting the Shift key state.
     *
     * @param {KeyboardEvent} event - The key down event.
     */
    const handleKeyDown = (event) => {
        if (event.key === 'Shift') {
            setIsShiftPressed(true);
        }
    };

    /**
     * Handles the key up event, clearing the Shift key state.
     *
     * @param {KeyboardEvent} event - The key up event.
     */
    const handleKeyUp = (event) => {
        if (event.key === 'Shift') {
            setIsShiftPressed(false);
        }
    };

    /**
     * Selects or deselects a shape based on user interactions.
     *
     * @param {object} shape - The shape to select or deselect.
     */
    const onSelectShape = (shape) => {
        if (isShiftPressed) {
            // Toggle selection with Shift key
            setSelectedShapes((prevSelected) => {
                if (prevSelected.includes(shape)) {
                    return prevSelected.filter((s) => s !== shape);
                } else {
                    return [...prevSelected, shape];
                }
            });
        } else {
            // Single selection without Shift key
            setSelectedShapes([shape]);
        }
    };

    /**
     * Updates the position of shapes on the canvas during dragging.
     *
     * @param {array} updatedShapes - The updated array of shapes with new positions.
     */
    const onDragShape = (updatedShapes) => {
        setShapes(updatedShapes);
    };

    /**
     * Updates the properties of a selected shape.
     *
     * @param {object} updatedShape - The shape with updated properties.
     */
    const onUpdateShape = (updatedShape) => {
        const updatedShapes = shapes.map((shape) =>
            selectedShapes.includes(shape) ? updatedShape : shape
        );
        setShapes(updatedShapes);
    };

    return (
        <div className="App" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
            <h1 className="app-title">ShapeToy Graphics Editor</h1>
            <div className="editor-container">
                <ShapeList onAddShape={addShape} />
                <Canvas
                    shapes={shapes}
                    selectedShapes={selectedShapes}
                    onSelectShape={onSelectShape}
                    onDragShape={onDragShape}
                />
                <PropertyEditor
                    selectedShape={selectedShapes.length === 1 ? selectedShapes[0] : null}
                    onUpdateShape={onUpdateShape}
                />
            </div>
        </div>
    );
}

export default App;
