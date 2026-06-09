// Prevent duplicate canvas if script loads twice
if (!document.getElementById("matrixCanvas")) {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.id = "matrixCanvas";

    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "-1",
        pointerEvents: "none",
        opacity: "0.35"
    });

    document.body.appendChild(canvas);

    const letters = "01VOICEAIDATA";
    const fontSize = 16;

    let columns;
    let drops;

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(2, 6, 23, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#38bdf8";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {

            const text = letters.charAt(
                Math.floor(Math.random() * letters.length)
            );

            ctx.fillText(
                text,
                i * fontSize,
                drops[i] * fontSize
            );

            if (
                drops[i] * fontSize > canvas.height &&
                Math.random() > 0.975
            ) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setupCanvas();

    setInterval(drawMatrix, 55);

    window.addEventListener("resize", setupCanvas);
}