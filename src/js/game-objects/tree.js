import { setCustomProperty } from "../htmlInterface.js";

export function setUpTrees(mapElement, lvl) {
    removeAllTrees();
    for (let i = 0; i < lvl; i++) {
        spawnTreeInRandomPosition(mapElement);
    }
}

function removeAllTrees() {
    const treeElements = document.querySelectorAll("[data-tree]");
    treeElements.forEach((treeElement) => treeElement.remove());
}

function spawnTreeInRandomPosition(mapElement) {
    const treeElement = document.createElement("img");
    treeElement.src = "./imgs/tree.png";
    treeElement.classList.add("tree");
    treeElement.dataset.tree = true;

    setCustomProperty(
        treeElement,
        "--bottom",
        Math.floor(Math.random() * mapElement.clientHeight)
    );
    setCustomProperty(
        treeElement,
        "--left",
        Math.floor(Math.random() * mapElement.clientWidth)
    );

    mapElement.appendChild(treeElement);
}

export function getTreeElements() {
    return document.querySelectorAll("[data-tree]");
}
