import { getCarElement, setUpCar, updateCar } from "./game-objects/car.js";
import {
    getObstacleElements,
    setUpObstacles,
} from "./game-objects/obstacle.js";
import { getGoalElement, setUpGoal } from "./game-objects/goal.js";
import { isCompleteOverlap, isOverlap } from "./helpers.js";
import { debugWithMousePosition } from "./debug.js";

debugWithMousePosition();

const textStartElement = document.querySelector("[data-text-start]");
const textEndElement = document.querySelector("[data-text-end]");
const lvlElement = document.querySelector("[data-lvl]");
const mapElement = document.querySelector("[data-map]");

document.addEventListener("keydown", startGame, { once: true });

let lvl = 0;
let lastTime = 0;
let delta = 0;

function update(time) {
    if (lastTime === 0) {
        lastTime = time;
    }
    delta = time - lastTime;
    lastTime = time;

    updateCar(delta);

    if (isRoundWon()) {
        endRound();
        return false;
    }

    if (isGameLost()) {
        endGame();
        return false;
    }

    window.requestAnimationFrame(update);
}

function isRoundWon() {
    return isCompleteOverlap(getCarElement(), getGoalElement());
}

function isGameLost() {
    return isCollisionWithObstacles(getCarElement());
}

function isCollisionWithObstacles(element) {
    const obstacleElements = [...getObstacleElements()];
    return obstacleElements.some((obstacleElement) =>
        isOverlap(element, obstacleElement)
    );
}

function startGame() {
    textStartElement.classList.add("hide");
    textEndElement.classList.add("hide");
    lvlElement.classList.remove("hide");
    startRound();
}

function endGame() {
    textEndElement.classList.remove("hide");
    lvl = 0;
    document.addEventListener("keydown", startGame, { once: true });
}

function startRound() {
    lvlElement.innerHTML = `LVL: ${lvl}`;
    setUpObstacles(mapElement, lvl);
    setUpGoal(mapElement);
    while (
        isCollisionWithObstacles(getGoalElement()) ||
        !isCompleteOverlap(getGoalElement(), mapElement)
    ) {
        setUpGoal(mapElement);
    }
    setUpCar(mapElement);
    while (
        isCollisionWithObstacles(getCarElement()) ||
        !isCompleteOverlap(getCarElement(), mapElement)
    ) {
        setUpCar(mapElement);
    }

    window.requestAnimationFrame(update);
}

function endRound() {
    lvl++;
    startRound();
}
