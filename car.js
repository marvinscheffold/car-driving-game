import { isInBetween } from "./helpers.js";
import {
    incrementCustomProperty,
    getCustomProperty,
    setCustomProperty,
} from "./htmlInterface.js";

const carElement = document.querySelector("[data-car]");

const CAR_MAX_DRIVE_SPEED = 0.7;
const CAR_ACCELERATION = 0.007;
const CAR_DEACCELERATION_BREAK = 0.01;
const CAR_DEACCELARATION_AUTOMATIC = 0.002;
const CAR_MAX_TURN_SPEED = 0.08;
const CAR_DELTA_TURN_SPEED = 0.008;

let carState = {
    drivingSpeed: 0,
    turningSpeed: 0,
};

let playerInput = {
    isPushingPedal: false,
    isTurningWheel: false,
    isPushingAccelerator: false,
    isTurningWheelRight: false,
};

export function setUpCar(mapWidth, mapHeight) {
    carState = {
        drivingSpeed: 0,
        turningSpeed: 0,
    };
    document.removeEventListener("keydown", handleKeyEvent);
    document.addEventListener("keydown", handleKeyEvent);
    document.removeEventListener("keyup", handleKeyEvent);
    document.addEventListener("keyup", handleKeyEvent);
    carElement.classList.remove("hide");
    setCarStartPosition(mapWidth, mapHeight);
}

export function updateCar(delta) {
    if (playerInput.isPushingPedal) {
        console.log(playerInput);
        // Change car speed
        if (playerInput.isPushingAccelerator) {
            carState.drivingSpeed = Math.min(
                carState.drivingSpeed + CAR_ACCELERATION,
                CAR_MAX_DRIVE_SPEED
            );
        } else {
            carState.drivingSpeed = Math.max(
                carState.drivingSpeed - CAR_DEACCELERATION_BREAK,
                -CAR_MAX_DRIVE_SPEED
            );
        }
    } else {
        // Return speed back to 0
        if (carState.drivingSpeed > 0) {
            carState.drivingSpeed = Math.max(
                carState.drivingSpeed - CAR_DEACCELARATION_AUTOMATIC,
                0
            );
        } else {
            carState.drivingSpeed = Math.min(
                carState.drivingSpeed + CAR_DEACCELARATION_AUTOMATIC,
                0
            );
        }
    }

    // Turn car when player turns wheel and car is moving
    if (playerInput.isTurningWheel && Math.abs(carState.drivingSpeed) > 0) {
        // Increase turn speed
        if (playerInput.isTurningWheelRight) {
            carState.turningSpeed = Math.min(
                carState.turningSpeed + CAR_DELTA_TURN_SPEED,
                CAR_MAX_TURN_SPEED
            );
        } else {
            carState.turningSpeed = Math.max(
                carState.turningSpeed - CAR_DELTA_TURN_SPEED,
                -CAR_MAX_TURN_SPEED
            );
        }
    } else {
        // Return wheel rotation slowly back to 0
        if (carState.turningSpeed > 0) {
            carState.turningSpeed = Math.max(
                carState.turningSpeed - CAR_DELTA_TURN_SPEED,
                0
            );
        } else {
            carState.turningSpeed = Math.min(
                carState.turningSpeed + CAR_DELTA_TURN_SPEED,
                0
            );
        }
    }

    if (Math.abs(carState.drivingSpeed) > 0)
        setCarPosition(carState.drivingSpeed, delta);

    if (Math.abs(carState.turningSpeed) > 0)
        setCarRotation(carState.turningSpeed, delta);
}

function setCarStartPosition(mapWidth, mapHeight) {
    setCustomProperty(
        carElement,
        "--bottom",
        Math.floor(Math.random() * mapHeight)
    );
    setCustomProperty(
        carElement,
        "--left",
        Math.floor(Math.random() * mapWidth)
    );
    setCustomProperty(
        carElement,
        "--rotation",
        Math.floor(Math.random() * 360)
    );
}

function setCarPosition(drivingSpeed, delta) {
    const currentRotationDegrees =
        getCustomProperty(carElement, "--rotation") % 360;
    const currentRotationRadian = (currentRotationDegrees * Math.PI) / 180;
    const deltaY = Math.cos(currentRotationRadian) * drivingSpeed * delta;
    const deltaX = Math.sin(currentRotationRadian) * drivingSpeed * delta;
    incrementCustomProperty(carElement, "--bottom", deltaY);
    incrementCustomProperty(carElement, "--left", deltaX);
}

function setCarRotation(turningSpeed, delta) {
    incrementCustomProperty(carElement, "--rotation", turningSpeed * delta);
}

function handleKeyEvent(event) {
    let isKeyDown = event.type === "keydown";
    switch (event.key) {
        case "a":
        case "ArrowLeft":
            playerInput.isTurningWheel = isKeyDown;
            playerInput.isTurningWheelRight = !isKeyDown;
            break;
        case "d":
        case "ArrowRight":
            playerInput.isTurningWheel = isKeyDown;
            playerInput.isTurningWheelRight = isKeyDown;
            break;
        case "w":
        case "ArrowUp":
            playerInput.isPushingPedal = isKeyDown;
            playerInput.isPushingAccelerator = isKeyDown;
            break;
        case "s":
        case "ArrowDown":
            playerInput.isPushingPedal = isKeyDown;
            playerInput.isPushingAccelerator = !isKeyDown;
            break;
    }
}
