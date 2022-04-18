import { getCarElement, setUpCar, updateCar } from "./car.js";
import { getTreeElements, setUpTrees } from "./tree.js";
import { isCompleteOverlap, isOverlap } from "./helpers.js";
import { getGoalElement, setUpGoal } from "./goal.js";
import { debugWithMousePosition } from "./debug.js";
const textStartElement = document.querySelector("[data-text-start]");
const textEndElement = document.querySelector("[data-text-end]");
const lvlElement = document.querySelector("[data-lvl]");
const mapElement = document.querySelector("[data-map]");
document.addEventListener("keydown", startGame, { once: true });
debugWithMousePosition();

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
        console.log(getCarElement().getBoundingClientRect());
        endGame();
        return false;
    }

    window.requestAnimationFrame(update);
}

function isRoundWon() {
    return isCompleteOverlap(getCarElement(), getGoalElement());
}

function isGameLost() {
    return isCollisionWithTrees(getCarElement());
}

function isCollisionWithTrees(element) {
    const treeElements = getTreeElements();
    for (const treeElement of treeElements) {
        if (isOverlap(element, treeElement)) {
            return true;
        }
    }
    return false;
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
    setUpTrees(mapElement, lvl);
    setUpGoal(mapElement);
    while (
        isCollisionWithTrees(getGoalElement()) ||
        !isCompleteOverlap(getGoalElement(), mapElement)
    ) {
        setUpGoal(mapElement);
    }
    setUpCar(mapElement);
    while (
        isCollisionWithTrees(getCarElement()) ||
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
