import {
    incrementCustomProperty,
    getCustomProperty,
    setCustomProperty,
} from "./htmlInterface.js";

const CAR_MAX_DRIVE_SPEED = 0.75;
const CAR_ACCELERATION = 0.025;
const CAR_DEACCELERATION_BREAK = 0.03;
const CAR_DEACCELARATION_AUTOMATIC = 0.008;
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
    if (playerInput.isPushingBreak) {
        // Decrease speed strongly
        const shouldNegate = carState.drivingSpeed < 0 ? -1 : 1;

        carState.drivingSpeed =
            carState.drivingSpeed -
            Math.min(
                CAR_DEACCELERATION_BREAK,
                Math.abs(carState.drivingSpeed)
            ) *
                shouldNegate;
    } else if (playerInput.isPushingGasPedal) {
        // Increase car speed
        if (playerInput.isInForwardGear) {
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
    } else if (Math.abs(carState.drivingSpeed) > 0) {
        // Let car roll out and finally stop
        // Decrease speed softly
        const shouldNegate = carState.drivingSpeed < 0 ? -1 : 1;

        carState.drivingSpeed =
            carState.drivingSpeed -
            Math.min(
                CAR_DEACCELARATION_AUTOMATIC,
                Math.abs(carState.drivingSpeed)
            ) *
                shouldNegate;
    }

    // Turn car when player turns wheel and car is moving fast enough
    if (
        playerInput.isTurningWheel &&
        Math.abs(carState.drivingSpeed) > CAR_MIN_DRIVE_SPEED_TO_TURN
    ) {
        // Increase turn speed depending on how fast car is
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
    } else if (Math.abs(carState.turningSpeed) > 0) {
        // Return wheel rotation slowly back to 0
        const shouldNegate = carState.turningSpeed < 0 ? -1 : 1;

        carState.turningSpeed =
            carState.turningSpeed -
            Math.min(CAR_DELTA_TURN_SPEED, Math.abs(carState.turningSpeed)) *
                shouldNegate;
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
