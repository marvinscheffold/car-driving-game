import { setCustomProperty } from "../htmlInterface.js";

export function setUpObstacles(mapElement, lvl) {
    removeAllObstacles();
    for (let i = 0; i < lvl; i++) {
        spawnObstacleInRandomPosition(mapElement);
    }
}

export function getObstacleElements() {
    return document.querySelectorAll("[data-obstacle]");
}

function removeAllObstacles() {
    const obstacleElements = document.querySelectorAll("[data-obstacle]");
    obstacleElements.forEach((obstacleElement) => obstacleElement.remove());
}

function spawnObstacleInRandomPosition(mapElement) {
    const obstacleElement = document.createElement("img");
    obstacleElement.src = "./imgs/tree.png";
    obstacleElement.classList.add("obstacle");
    obstacleElement.dataset.obstacle = true;

    setCustomProperty(
        obstacleElement,
        "--bottom",
        Math.floor(Math.random() * mapElement.clientHeight)
    );
    setCustomProperty(
        obstacleElement,
        "--left",
        Math.floor(Math.random() * mapElement.clientWidth)
    );

    mapElement.appendChild(obstacleElement);
}
