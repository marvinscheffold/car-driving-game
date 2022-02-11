import { setCustomProperty } from "./htmlInterface.js";

export function setUpGoal(mapElement) {
    removeAllGoals();
    spawnGoalInRandomPosition(mapElement);
}

function removeAllGoals() {
    const goalElements = document.querySelectorAll("[data-goal]");
    goalElements.forEach((goalElement) => goalElement.remove());
}

function spawnGoalInRandomPosition(mapElement) {
    const goalElement = document.createElement("div");
    goalElement.classList.add("goal");
    goalElement.dataset.goal = true;

    setCustomProperty(
        goalElement,
        "--bottom",
        Math.floor(Math.random() * mapElement.clientHeight)
    );
    setCustomProperty(
        goalElement,
        "--left",
        Math.floor(Math.random() * mapElement.clientWidth)
    );
    setCustomProperty(
        goalElement,
        "--rotation",
        Math.floor(Math.random() * 360)
    );

    mapElement.appendChild(goalElement);
}

export function getGoalElement() {
    return document.querySelector("[data-goal]");
}
