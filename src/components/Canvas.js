/**
 * Canvas Component
 *
 * This component displays shapes on a canvas and handles user interactions such as selection and dragging.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.shapes - An array of shape objects to be rendered on the canvas.
 * @param {Array} props.selectedShapes - An array of selected shape objects.
 * @param {function} props.onSelectShape - A callback function to handle shape selection.
 * @param {function} props.onDragShape - A callback function to handle shape dragging.
 */

import React, { useRef, useEffect, useState } from 'react';

function Canvas({ shapes, selectedShapes, onSelectShape, onDragShape }) {
    // Reference to the canvas element
    const canvasRef = useRef(null);

    // State to track the currently hovered shape
    const [hoveredShape, setHoveredShape] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        shapes.forEach((shape) => {
            // Check if the shape is within the canvas boundaries
            if (
                shape.x + (shape.width || shape.radius * 2) >= 0 &&
                shape.x <= canvas.width &&
                shape.y + (shape.height || shape.radius * 2) >= 0 &&
                shape.y <= canvas.height
            ) {
                if (shape.type === 'rectangle') {
                    ctx.fillStyle = shape.fillColor;
                    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                } else if (shape.type === 'circle') {
                    ctx.fillStyle = shape.fillColor;
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Draw the outline around the selected shapes
            if (selectedShapes.includes(shape)) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 3;
                if (shape.type === 'rectangle') {
                    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                } else if (shape.type === 'circle') {
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius + 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });

        // Draw a semi-transparent blue border around the hovered shape
        if (hoveredShape && !selectedShapes.includes(hoveredShape)) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
            ctx.lineWidth = 3;
            if (hoveredShape.type === 'rectangle') {
                ctx.strokeRect(hoveredShape.x, hoveredShape.y, hoveredShape.width, hoveredShape.height);
            } else if (hoveredShape.type === 'circle') {
                ctx.beginPath();
                ctx.arc(hoveredShape.x, hoveredShape.y, hoveredShape.radius + 1.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }, [shapes, selectedShapes, hoveredShape]);

    /**
     * Handles the click event on the canvas, determining if any shape is clicked.
     *
     * @param {MouseEvent} event - The mouse click event.
     */
    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        // Iterate through shapes in reverse order to detect the top-most shape
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];

            if (shape.type === 'rectangle') {
                // Check if the mouse click is within the rectangle's boundaries
                if (
                    mouseX >= shape.x &&
                    mouseX <= shape.x + shape.width &&
                    mouseY >= shape.y &&
                    mouseY <= shape.y + shape.height
                ) {
                    // Select or deselect the shape based on its current state
                    onSelectShape(shape === selectedShapes[0] ? null : shape);
                    return;
                }
            } else if (shape.type === 'circle') {
                // Calculate the distance between the mouse cursor and the circle's center
                const distance = Math.sqrt((mouseX - shape.x) ** 2 + (mouseY - shape.y) ** 2);
                if (distance <= shape.radius) {
                    // Select or deselect the shape based on its current state
                    onSelectShape(shape === selectedShapes[0] ? null : shape);
                    return;
                }
            }
        }

        onSelectShape(null);
    };

    /**
     * Handles the mouse down event on the canvas, enabling shape dragging.
     *
     * @param {MouseEvent} event - The mouse down event.
     */
    const handleCanvasMouseDown = (event) => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        if (selectedShapes && selectedShapes.length > 0) {
            const offsets = selectedShapes
                .filter((shape) => shape) // Remove any null or undefined shapes
                .map((shape) => ({
                    shape,
                    offsetX: mouseX - shape.x,
                    offsetY: mouseY - shape.y,
                }));

            const handleMouseMove = (e) => {
                const newMouseX = e.clientX - canvasRect.left;
                const newMouseY = e.clientY - canvasRect.top;

                const updatedShapes = shapes.map((shape) => {
                    const offset = offsets.find((o) => o.shape === shape);
                    if (offset) {
                        // Calculate the new position with offsets
                        const newX = newMouseX - offset.offsetX;
                        const newY = newMouseY - offset.offsetY;

                        // Ensure the shape stays within the canvas bounds
                        const maxX = canvas.width - (shape.width || shape.radius * 2);
                        const maxY = canvas.height - (shape.height || shape.radius * 2);

                        const clampedX = Math.max(0, Math.min(newX, maxX));
                        const clampedY = Math.max(0, Math.min(newY, maxY));

                        return {
                            ...shape,
                            x: clampedX,
                            y: clampedY,
                        };
                    }
                    return shape;
                });

                onDragShape(updatedShapes);
            };

            const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    };

    /**
     * Handles the mouse move event on the canvas during shape dragging.
     *
     * @param {MouseEvent} event - The mouse move event.
     */
    const handleCanvasMouseMove = (event) => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        // Find the shape under the cursor
        let shapeUnderCursor = null;
        for (const shape of shapes) {
            if (
                shape.x + (shape.width || shape.radius * 2) >= mouseX &&
                shape.x <= mouseX &&
                shape.y + (shape.height || shape.radius * 2) >= mouseY &&
                shape.y <= mouseY
            ) {
                shapeUnderCursor = shape;
                break;
            }
        }

        // Update the hovered shape
        setHoveredShape(shapeUnderCursor);
    };

    /**
     * Handles the mouse leave event on the canvas, clearing the hovered shape.
     */
    const handleCanvasMouseLeave = () => {
        // Clear the hovered shape when the cursor leaves the canvas
        setHoveredShape(null);
    };

    return (
        <canvas
            ref={canvasRef}
            className="canvas"
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            style={{ border: '2px solid #000000' }}
            width={800}
            height={600}
        />
    );
}

export default Canvas;
