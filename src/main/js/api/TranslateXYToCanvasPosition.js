export function translateXYToCanvasPosition(x, y, margin) {
    const xDelta = 0; // No delta, because the canvas takes the full page width
    const yDelta = 0; // Some delta, because the canvas is not at the top of the page, but below the header

    return [
        x - xDelta + (margin?.left || 0),
        y - yDelta + (margin?.top || 0),
    ];
}