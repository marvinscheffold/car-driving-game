import { setUpCar, updateCar } from "./car.js";
const textElement = document.querySelector("[data-text]");

let lastTime = 0;
let delta = 0;

function update(time) {
    if (lastTime === 0) {
        lastTime = time;
    }

    delta = time - lastTime;
    lastTime = time;

    updateCar(delta);

    window.requestAnimationFrame(update);
}

function handleStart() {
    setUpCar();
    textElement.classList.add("hide");
    window.requestAnimationFrame(update);
}

handleStart();
