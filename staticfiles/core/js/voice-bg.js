const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";

document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01VOICEAIDATA";
const fontSize = 16;

const columns = canvas.width / fontSize;

const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function draw() {

    ctx.fillStyle = "rgba(2,6,23,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#38bdf8";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        const text = letters.charAt(
            Math.floor(Math.random() * letters.length)
        );

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;

    }

}

setInterval(draw, 55);

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

// for (let i = 0; i < drops.length; i++) {

//     const text = letters.charAt(
//         Math.floor(Math.random() * letters.length)
//     );

//     // bright leader character
//     ctx.fillStyle = "#e0f2fe";
//     ctx.shadowColor = "#38bdf8";
//     ctx.shadowBlur = 12;

//     ctx.fillText(text, i * fontSize, drops[i] * fontSize);

//     // trail characters (dimmer)
//     ctx.fillStyle = "#38bdf8";
//     ctx.shadowBlur = 0;

// }