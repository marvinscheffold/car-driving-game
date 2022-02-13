import {
    incrementCustomProperty,
    getCustomProperty,
    setCustomProperty,
} from "./htmlInterface.js";
import { clamp } from "./helpers.js";

const CAR_MAX_DRIVE_SPEED = 0.75;
const CAR_ACCELERATION = 0.022;
const CAR_DEACCELERATION_BREAK = -0.03;
const CAR_DEACCELERATION_AUTOMATIC = -0.008;
const CAR_MAX_TURN_SPEED = 0.18;
const CAR_DELTA_TURN_SPEED = 0.025;
const CAR_MIN_DRIVE_SPEED_TO_TURN = 0.05;

let carState = {
    drivingSpeed: 0,
    turningSpeed: 0,
};

let playerInput = {
    isPushingGasPedal: false,
    isInForwardGear: true,
    isTurningWheel: false,
    isPushingBreak: false,
    isTurningWheelRight: false,
};

export function setUpCar(mapElement) {
    carState = {
        drivingSpeed: 0,
        turningSpeed: 0,
    };
    document.removeEventListener("keydown", handleKeyEvent);
    document.addEventListener("keydown", handleKeyEvent);
    document.removeEventListener("keyup", handleKeyEvent);
    document.addEventListener("keyup", handleKeyEvent);
    removeCar();
    spawnCarInRandomPosition(mapElement);
}

export function updateCar(delta) {
    const shouldNegateDrivingSpeedDelta = carState.drivingSpeed < 0 ? -1 : 1;
    const shouldNegateTurningSpeedDelta = carState.turningSpeed < 0 ? -1 : 1;

    let drivingSpeedDelta = 0;
    if (playerInput.isPushingBreak) {
        // Decrease speed strongly
        drivingSpeedDelta =
            CAR_DEACCELERATION_BREAK * shouldNegateDrivingSpeedDelta;
    } else if (playerInput.isPushingGasPedal) {
        // Increase car speed
        drivingSpeedDelta = playerInput.isInForwardGear
            ? CAR_ACCELERATION
            : -CAR_ACCELERATION;
    } else if (Math.abs(carState.drivingSpeed) > 0) {
        // Let car roll out and finally stop
        // Decrease speed softly
        drivingSpeedDelta =
            CAR_DEACCELERATION_AUTOMATIC * shouldNegateDrivingSpeedDelta;
    }
    // Add drivingSpeedDelta to drivingSpeed
    carState.drivingSpeed = clamp(
        carState.drivingSpeed + drivingSpeedDelta,
        -CAR_MAX_DRIVE_SPEED,
        CAR_MAX_DRIVE_SPEED
    );

    // Turn car when player turns wheel and car is moving fast enough
    if (
        playerInput.isTurningWheel &&
        Math.abs(carState.drivingSpeed) > CAR_MIN_DRIVE_SPEED_TO_TURN
    ) {
        // Increase turn speed by delta until max is reached
        let turningSpeedDelta;
        turningSpeedDelta =
            (playerInput.isTurningWheelRight
                ? CAR_DELTA_TURN_SPEED
                : -1 * CAR_DELTA_TURN_SPEED) * shouldNegateDrivingSpeedDelta;

        // Check if turn speed limit is reached
        carState.turningSpeed = clamp(
            carState.turningSpeed + turningSpeedDelta,
            -CAR_MAX_TURN_SPEED,
            CAR_MAX_TURN_SPEED
        );
    } else if (Math.abs(carState.turningSpeed) > 0) {
        // Return turn speed slowly back to 0 if car is moving
        carState.turningSpeed =
            carState.turningSpeed -
            Math.min(CAR_DELTA_TURN_SPEED, Math.abs(carState.turningSpeed)) *
                shouldNegateTurningSpeedDelta;
    }

    if (Math.abs(carState.drivingSpeed) > 0)
        setCarPosition(carState.drivingSpeed, delta);

    if (Math.abs(carState.turningSpeed) > 0)
        setCarRotation(carState.turningSpeed, delta);
}

function removeCar() {
    document
        .querySelectorAll("[data-car]")
        .forEach((carElement) => carElement.remove());
}

function spawnCarInRandomPosition(mapElement) {
    const carElement = document.createElement("img");
    carElement.src = "./imgs/car.png";
    carElement.classList.add("car");
    carElement.dataset.car = true;

    setCustomProperty(
        carElement,
        "--bottom",
        Math.floor(Math.random() * mapElement.clientHeight)
    );
    setCustomProperty(
        carElement,
        "--left",
        Math.floor(Math.random() * mapElement.clientWidth)
    );
    setCustomProperty(
        carElement,
        "--rotation",
        Math.floor(Math.random() * 360)
    );

    mapElement.appendChild(carElement);
}

function setCarPosition(drivingSpeed, delta) {
    const carElement = getCarElement();
    const currentRotationDegrees =
        getCustomProperty(carElement, "--rotation") % 360;
    const currentRotationRadian = (currentRotationDegrees * Math.PI) / 180;
    const deltaY = Math.cos(currentRotationRadian) * drivingSpeed * delta;
    const deltaX = Math.sin(currentRotationRadian) * drivingSpeed * delta;
    incrementCustomProperty(carElement, "--bottom", deltaY);
    incrementCustomProperty(carElement, "--left", deltaX);
}

function setCarRotation(turningSpeed, delta) {
    const carElement = getCarElement();
    incrementCustomProperty(carElement, "--rotation", turningSpeed * delta);
}

function handleKeyEvent(event) {
    let isKeyDown = event.type === "keydown";
    switch (event.key) {
        case " ":
            playerInput.isPushingBreak = isKeyDown;
            break;
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
            playerInput.isPushingGasPedal = isKeyDown;
            playerInput.isInForwardGear = isKeyDown;
            break;
        case "s":
        case "ArrowDown":
            playerInput.isPushingGasPedal = isKeyDown;
            playerInput.isInForwardGear = !isKeyDown;
            break;
    }
}

export function getCarElement() {
    return document.querySelector("[data-car]");
}
