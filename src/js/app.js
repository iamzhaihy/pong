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

const pwidth = 10;
const pheight = cheight/10;

let w_pressed = false;
let s_pressed = false;
let up_pressed = false;
let down_pressed = false;

let player1 = {
    x: 0,
    y: 0,
    draw: function() {
        if (w_pressed)
            this.y = Math.max(this.y-10, 0);

        if (s_pressed)
            this.y = Math.min(this.y+10, cheight-pheight);

        ctx_main.save();
        ctx_main.fillStyle = "white";
        ctx_main.fillRect(this.x, this.y, pwidth, pheight);
        ctx_main.restore();
    }
};

let player2 = {
    x: cwidth-pwidth,
    y: 0,
    draw: function() {
        if (up_pressed)
            this.y = Math.max(this.y-10, 0);

        if (down_pressed)
            this.y = Math.min(this.y+10, cheight-pheight);

        ctx_main.save();
        ctx_main.fillStyle = "white";
        ctx_main.fillRect(this.x, this.y, pwidth, pheight);
        ctx_main.restore();
    }
}

draw_background();
window.requestAnimationFrame(draw);

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
            w_pressed = true;
            break;
        case 's':
            s_pressed = true;
            break;
        case 'ArrowUp':
            up_pressed = true;
            break;
        case 'ArrowDown':
            down_pressed = true;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.key) {
        case 'w':
            w_pressed = false;
            break;
        case 's':
            s_pressed = false;
            break;
        case 'ArrowUp':
            up_pressed = false;
            break;
        case 'ArrowDown':
            down_pressed = false;
            break;
    }
}

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
