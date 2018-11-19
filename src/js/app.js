let canv_bg = document.getElementById("canv_bg");
let canv_ui = document.getElementById("canv_ui");
let canv_main = document.getElementById("canv_main");

for (c of [canv_bg, canv_main, canv_ui]) {
    c.width = window.innerWidth * 0.8;
    c.height = window.innerWidth * 0.8 * 9/16;
}

let ctx_bg = canv_bg.getContext("2d");
let ctx_ui = canv_ui.getContext("2d");
let ctx_main = canv_main.getContext("2d");

const cwidth = canv_bg.width;
const cheight = canv_bg.height;

function draw_background() {
    ctx_bg.save();
    ctx_bg.fillStyle = "black";
    ctx_bg.fillRect(0, 0, cwidth, cheight);
    ctx_bg.strokeStyle = "white";
    ctx_bg.lineWidth = 5;
    ctx_bg.setLineDash([20, 10]);
    ctx_bg.lineDashOffset = 5;
    ctx_bg.beginPath();
    ctx_bg.moveTo(cwidth/2 + 0.5, 0);
    ctx_bg.lineTo(cwidth/2 + 0.5, cheight);
    ctx_bg.stroke();
    ctx_bg.restore();
}

function draw() {
    ctx_main.clearRect(0,0,cwidth,cheight);
    player1.draw();
    player2.draw();
    window.requestAnimationFrame(draw);
}
