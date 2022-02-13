export function isInBetween(value, min, max) {
    return value >= min && value <= max;
}

export function isOverlap(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
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
