export function getCustomProperty(element, property) {
    return parseFloat(getComputedStyle(element).getPropertyValue(property));
}

function setCustomProperty(element, property, value) {
    element.style.setProperty(property, value);
}

export function incrementCustomProperty(element, property, value) {
    setCustomProperty(
        element,
        property,
        getCustomProperty(element, property) + value
    );
}
