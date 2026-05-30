let startTime = null;
let lastKeyTime = null;
let backspaces = 0;
let pauses = [];
let chars = 0;

const box = document.getElementById("typingBox");

box.addEventListener("keydown", function(e) {

    const now = Date.now();

    if (!startTime) startTime = now;

    if (lastKeyTime) pauses.push((now - lastKeyTime) / 1000);

    lastKeyTime = now;

    if (e.key === "Backspace") backspaces++;
    else chars++;
});

function analyze() {

    const duration = (Date.now() - startTime) / 1000;

    const speed = chars / duration;
    const avgPause = pauses.length
        ? pauses.reduce((a,b)=>a+b)/pauses.length
        : 0;

    const error = backspaces / chars;

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            speed: speed,
            backspaces: backspaces,
            pause: avgPause,
            error: error
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result")
            .innerText = "Detected State: " + data.result;
    });
}