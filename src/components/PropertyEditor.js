/**
 * PropertyEditor Component
 *
 * This component allows users to edit properties of selected shapes. It displays input fields for width, height, radius, and fill color.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.selectedShape - The currently selected shape object to edit.
 * @param {function} props.onUpdateShape - A callback function to handle shape property updates.
 */

import React, { useState, useEffect } from 'react';

function PropertyEditor({ selectedShape, onUpdateShape }) {
    // State variables to manage input fields
    const [widthInput, setWidthInput] = useState('');
    const [heightInput, setHeightInput] = useState('');
    const [radiusInput, setRadiusInput] = useState('');
    const [fillColorInput, setFillColorInput] = useState('');

    useEffect(() => {
        // Update input values when the selected shape changes
        setWidthInput(selectedShape ? selectedShape.width || '' : '');
        setHeightInput(selectedShape ? selectedShape.height || '' : '');
        setRadiusInput(selectedShape ? selectedShape.radius || '' : '');
        setFillColorInput(selectedShape ? selectedShape.fillColor || '' : '');
    }, [selectedShape]);

    /**
     * Handles changes in the width input field.
     *
     * @param {ChangeEvent} event - The input change event.
     */
    const handleWidthChange = (event) => {
        setWidthInput(event.target.value);
    };

    /**
     * Handles changes in the height input field.
     *
     * @param {ChangeEvent} event - The input change event.
     */
    const handleHeightChange = (event) => {
        setHeightInput(event.target.value);
    };

    /**
     * Handles changes in the radius input field.
     *
     * @param {ChangeEvent} event - The input change event.
     */
    const handleRadiusChange = (event) => {
        setRadiusInput(event.target.value);
    };

    /**
     * Handles changes in the fill color input field.
     *
     * @param {ChangeEvent} event - The input change event.
     */
    const handleFillColorChange = (event) => {
        setFillColorInput(event.target.value);
    };

    /**
     * Handles the update button click event. Prepares and sends the updated shape to the parent component.
     */
    const handleUpdateClick = () => {
        // Prepare the updated shape object
        const updatedShape = {
            ...selectedShape,
            width: parseFloat(widthInput) || 0,
            height: parseFloat(heightInput) || 0,
            radius: parseFloat(radiusInput) || 0,
            fillColor: fillColorInput,
        };
        onUpdateShape(updatedShape);
    };

    return (
        <div className="property-editor">
            {selectedShape && (
                <>
                    <h2 className="app-title">Properties Editor</h2>
                    <label>Width:</label>
                    <input
                        type="number"
                        value={widthInput}
                        onChange={handleWidthChange}
                        disabled={selectedShape.type === 'circle'}
                        className="property-input"
                    />
                    <br />
                    <label>Height:</label>
                    <input
                        type="number"
                        value={heightInput}
                        onChange={handleHeightChange}
                        disabled={selectedShape.type === 'circle'}
                        className="property-input"
                    />
                    <br />
                    <label>Radius:</label>
                    <input
                        type="number"
                        value={radiusInput}
                        onChange={handleRadiusChange}
                        disabled={selectedShape.type === 'rectangle'}
                        className="property-input"
                    />
                    <br />
                    <label>Fill Color:</label>
                    <input
                        type="color"
                        value={fillColorInput}
                        onChange={handleFillColorChange}
                        className="property-color-input"
                    />
                    <br />
                    <div className="shape-list">
                        <button onClick={handleUpdateClick} className="property-update-button">
                            Update
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PropertyEditor;
