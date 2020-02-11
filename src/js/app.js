let canv_bg = document.getElementById("canv_bg");
let canv_ui = document.getElementById("canv_ui");
let canv_main = document.getElementById("canv_main");

const ratio = 9/16;

canv_bg.width = window.innerWidth * 0.8;
canv_bg.height = window.innerWidth * 0.8 * ratio;

canv_main.width = window.innerWidth * 0.8;
canv_main.height = window.innerWidth * 0.8 * ratio;

canv_ui.width = window.innerWidth * 0.8;
canv_ui.height = window.innerWidth * 0.8 * ratio;

let ctx_bg = canv_bg.getContext("2d");
let ctx_ui = canv_ui.getContext("2d");
let ctx_main = canv_main.getContext("2d");

const cwidth = canv_bg.width;
const cheight = canv_bg.height;

const pwidth = 10;
const pheight = cheight/10;
const max_speed = 28;

let w_pressed = false;
let s_pressed = false;
let up_pressed = false;
let down_pressed = false;

let game_running = false;
let curr_screen = 'game'; // game | game_over

let player1 = {
    x: 0.1 * cwidth,
    y: 0.4 * cheight,
    score: 0,
    color: "white",
    draw: function() {
        if (w_pressed)
            this.y = Math.max(this.y-10, 0);

        if (s_pressed)
            this.y = Math.min(this.y+10, cheight-pheight);

        ctx_main.save();
        ctx_main.fillStyle = this.color;
        ctx_main.fillRect(this.x, this.y, pwidth, pheight);
        ctx_main.restore();
    },
    reset: function() {
        this.score = 0;
        this.x = 0.1 * cwidth;
        this.y = 0.4 * cheight;
    }
};

let player2 = {
    x: 0.9 * cwidth,
    y: 0.4 * cheight,
    score: 0,
    color: "white",
    draw: function() {
        if (up_pressed)
            this.y = Math.max(this.y-10, 0);

        if (down_pressed)
            this.y = Math.min(this.y+10, cheight-pheight);

        ctx_main.save();
        ctx_main.fillStyle = this.color;
        ctx_main.fillRect(this.x, this.y, pwidth, pheight);
        ctx_main.restore();
    },
    reset: function() {
        this.score = 0;
        this.x = 0.9 * cwidth;
        this.y = 0.4 * cheight;
    }
}

let ball = {
    x: cwidth/2,
    y: cheight/2,
    vx: 5,
    vy: 2,
    radius: 20,
    color: "white",
    draw: function() {
        ctx_main.save();
        ctx_main.beginPath();
        ctx_main.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx_main.closePath();
        ctx_main.fillStyle = this.color;
        ctx_main.fill();
        ctx_main.restore();
    },
    reset: function() {
        this.x = cwidth/2;
        this.y = cheight/2;
        this.vx = 0;
        this.vy = 0;
    }
};

init_game();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

canv_ui.addEventListener('click', function(e){
    if (curr_screen === 'game') {
        game_running = !game_running;
        draw();
    } else if (curr_screen === 'game_over') {
        new_game();
        draw_score();
        curr_screen = 'game';
        game_running = true;
        draw();
    }
});

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

function hit(cx, cy, rx, ry) {
    let testX = cx;
    let testY = cy;

    if (cx < rx)
        testX = rx;
    else if (cx > rx + pwidth)
        testX = rx + pwidth;

    if (cy < ry)
        testY = ry;
    else if (cy > ry + pheight)
        testY = ry + pheight;

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt(distX*distX + distY*distY);

    if (distance <= ball.radius)
        return true;

    return false;
}

function draw_score() {
    ctx_ui.clearRect(0,0,cwidth,cheight);
    ctx_ui.save();
    ctx_ui.font = '50px Verdana';
    ctx_ui.fillStyle = 'white';
    ctx_ui.fillText(`${player1.score}`, 0.25*cwidth, 75);
    ctx_ui.fillText(`${player2.score}`, 0.75*cwidth, 75);
    ctx_ui.restore();
}

function init_game() {
    draw_background();
    new_game();
    draw_score();
    draw();
}

function new_game() {
    ball.reset();
    ball.vx = 5;
    ball.vy = 2;
    player1.reset();
    player2.reset();
}

function game_over(winner) {
    ball.reset();

    ctx_ui.save();
    ctx_ui.font = '50px Verdana';
    ctx_ui.fillStyle = 'white';

    if (winner === 'player1')
        ctx_ui.fillText('winner!', 0.20*cwidth, 150);
    else
        ctx_ui.fillText('winner!', 0.70*cwidth, 150);

    ctx_ui.restore();
}

function draw() {
    ctx_main.clearRect(0,0,cwidth,cheight);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy + ball.radius > cheight ||
        ball.y + ball.vy - ball.radius < 0)
        ball.vy = -ball.vy;

    if (ball.x + ball.vx + ball.radius > cwidth){
        player1.score += 1;
        draw_score();

        if (player1.score === 10){
            game_over('player1');
            game_running = false;
            curr_screen = 'game_over';
        } else {
            ball.reset();
            ball.vx = 5;
            ball.vy = 2;
        }
    }

    if (ball.x + ball.vx - ball.radius < 0) {
        player2.score += 1;
        draw_score();

        if (player2.score === 10) {
            game_over('player2');
            game_running = false;
            curr_screen = 'game_over';
        } else {
            ball.reset();
            ball.vx = -5;
            ball.vy = 2;
        }
    }

    let hits_paddle1 = hit(ball.x + ball.vx, ball.y + ball.vy, player1.x, player1.y);
    let hits_paddle2 = hit(ball.x + ball.vx, ball.y + ball.vy, player2.x, player2.y);

    if ( hits_paddle1 || hits_paddle2) {
        let speed = Math.min(max_speed, Math.abs(ball.vx) * 1.03);
        ball.vx = ball.vx > 0? -1 * speed: speed;

        if (hits_paddle1)
            ball.x = player1.x + pwidth + ball.radius;
        else
            ball.x = player2.x - ball.radius;
    }

    player1.draw();
    player2.draw();
    ball.draw();

    if (game_running)
        window.requestAnimationFrame(draw);
}
