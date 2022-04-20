import { getCustomProperty } from "./htmlInterface.js";
import { areRectanglesOverlapping } from "./rect-collision/index.js";

export function isInBetween(value, min, max) {
    return value >= min && value <= max;
}

export function isOverlap(element1, element2) {
    const boundingClientRect1 = element1.getBoundingClientRect();
    const boundingClientRect2 = element2.getBoundingClientRect();

    return areRectanglesOverlapping(
        {
            cx: boundingClientRect1.x + boundingClientRect1.width / 2,
            cy: (boundingClientRect1.y + boundingClientRect1.height / 2) * -1,
            width: element1.width,
            height: element1.height,
            rotation: getCustomProperty(element1, "--rotation") % 360,
        },
        {
            cx: boundingClientRect2.x + boundingClientRect2.width / 2,
            cy: (boundingClientRect2.y + boundingClientRect2.height / 2) * -1,
            width: element2.width,
            height: element2.height,
            rotation: getCustomProperty(element2, "--rotation") % 360,
        }
    );
}

export function isCompleteOverlap(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left > rect2.left &&
        rect1.right < rect2.right &&
        rect1.top > rect2.top &&
        rect1.bottom < rect2.bottom
    );
}

// Clamp number between two values with the following line:
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
