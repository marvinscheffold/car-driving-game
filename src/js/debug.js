export function debugWithMousePosition() {
    const textElem = document.createElement("div");
    textElem.style.fontSize = "20px";
    textElem.style.zIndex = "1000";
    textElem.style.color = "black";
    textElem.style.position = "fixed";
    textElem.style.top = "0px";
    textElem.style.left = "0px";
    document.body.appendChild(textElem);
    document.addEventListener("mousemove", (e) => {
        textElem.innerText = `X: ${e.clientX}, Y: ${e.clientY}`;
    });
}
