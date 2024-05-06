/***********************************
 * INIT
 * **********************************/
let player = document.getElementById('player');
let spriteImg = document.getElementById('spriteImg');
let cash = document.getElementById('collect');
let amount = document.getElementById('amount');
let surface = document.getElementById('surface');
let startButton = document.getElementById('startEgg');
let wall = document.getElementById('wall');
let loseE = document.getElementById('loseScreen');
let tutorial = document.getElementById('tutorial');
let money = -1;

let clickEgg = new Audio('../SoundAssets/select.wav');
let walk = new Audio('../SoundAssets/walk.wav');
let originalDuration = walk.duration;
let can_play_walk = true;
let pickup = new Audio('../SoundAssets/pickup.wav');
let loseSound = new Audio('../SoundAssets/hit.wav');

// Scale the surface to 85% of the screen width
let surface_scale = 0.85 * (window.innerWidth / surface.clientWidth)
surface.style.transform = `scale(${surface_scale})`;



/***********************************
 * GAME CONFIG
 * **********************************/
let spriteImgNumber = 0; // current animation part of sprite image
let gameSpeed = 24; // game loop refresh rate (pictures per second)
let characterSpeed = 5; // move offset in PX

document.querySelector('h1').innerHTML = 'Name: ' + localStorage['name'];


/***********************************
 * EVENT LISTENER
 * **********************************/
document.onkeydown = keydown_detected;
document.onkeyup = keyup_detected;

let leftArrow = false;
let rightArrow = false;
let upArrow = false;
let downArrow = false;
let shift = false;
let enter = false;

function keydown_detected(e){
    //console.log(e);
    //console.log(e.keyCode);
    if (!e){
        e = window.event; //Internet Explorer
    }
    if (e.keyCode == 37 || e.keyCode == 65){ // leftArrow
        leftArrow = true;
    }
    if (e.keyCode == 38 || e.keyCode == 87){ //upArrow
        upArrow = true;
    }
    if (e.keyCode == 39 || e.keyCode == 68){ // rightArrow
        rightArrow = true;
    }
    if (e.keyCode == 40 || e.keyCode == 83){ // downArrow
        downArrow = true;
    }
    if (e.keyCode == 16){
        shift = true;
    }
    if (e.keyCode == 13){
        enter = true;
    }
}
function keyup_detected(e){
    //console.log(e);
    //console.log(e.keyCode);
    if (!e){
        e = window.event; //Internet Explorer
    }
    if (e.keyCode == 37 || e.keyCode == 65){ // leftArrow
        leftArrow = false;
    }
    if (e.keyCode == 38 || e.keyCode == 87){ //upArrow
        upArrow = false;
    }
    if (e.keyCode == 39 || e.keyCode == 68){ // rightArrow
        rightArrow = false;
    }
    if (e.keyCode == 40 || e.keyCode == 83){ // downArrow
        downArrow = false;
    }
    if (e.keyCode == 16){ //shift
        shift = false;
    }
    if (e.keyCode == 13){
        enter = false;
    }
}


function eggHover(element) {
    element.setAttribute('src', '../ArtAssets/EggHover.png');
}
function eggUnhover(element) {
    element.setAttribute('src', '../ArtAssets/Egg.png');
}


/***********************************
 * GAME LOOP
 * **********************************/
let cx; //coin x
let cy; //coin y

function startGame() {
    clickEgg.play();
    player.style.left = '392px'; // starting position
    player.style.top = '184px'; // starting position
    startButton.style.display = 'none';
    player.style.opacity = '1'; // show player
    spriteImg.style.right = '0px'; // starting animation
    tutorial.style.display = 'none';
    tutorial.style.animation = 'none';

    cash.style.opacity = '1';
    collect();

    startButton.innerHTML = 'STARTED';
    startButton.removeAttribute('onclick');

    gameLoop();

    moveWall();
    increaseWallSpeed();
}

let can_do_this_timeout = true;
function gameLoop() {

    to_idle = true;

    if(leftArrow) {
        movePlayer((-1)*characterSpeed, 0, -1);
        animatePlayer();
    }
    if(rightArrow) {
        movePlayer(characterSpeed, 0, 1)
        animatePlayer();
    }
    if(upArrow) {
        movePlayer(0, (-1)*characterSpeed, 0);
        animatePlayer();
    }
    if(downArrow) {
        movePlayer(0, characterSpeed, 0);
        animatePlayer();
    }
    if(shift) {
        animatePlayer();
    } else {
        can_play_walk = false;
        if (can_do_this_timeout) {
            can_do_this_timeout = false;
            setTimeout(function () {
                can_play_walk = true;
                can_do_this_timeout = true
            }, 260);
        }
    }

    if (money > 0) amount.style.opacity = '1';
    else amount.style.opacity = '0';

    setTimeout(gameLoop, 1000/gameSpeed); // async recursion

}



/***********************************
 * MOVE
 * **********************************/
/**
 * @param {number} dx - player x move offset in pixel
 * @param {number} dy - player y move offset in pixel
 * @param {number} dr - player heading direction (-1: move left || 1: move right || 0: no change)
 */

let px = 0;
let py = 0;
let animation_counter = 0;
let can_move = true

function movePlayer(dx, dy, dr){

    px = dx;
    py = dy;
    dx *= (py == 1 || py == -1 ? 0.5 : 1);
    dy *= (px == 1 || px == -1 ? 0.5 : 1);

    to_idle = false;
    // current position
    let x = parseFloat(player.style.left);
    let y = parseFloat(player.style.top);
    
    // calc new position
    if (can_move) {
        x = Math.max(Math.min(x + dx * (shift ? 1.6 : 1), 764), 18);
        y = Math.max(Math.min(y + dy * (shift ? 1.6 : 1), 358), 20);
    }

    // assign new position
    player.style.left = x + 'px';
    player.style.top = y + 'px';

    if (dx != 0) amount.style.left = Math.max(Math.min(x+(dr == -1 ? 64 : -64), 764), 18) + 'px';
    if (dy != 0) amount.style.top = y + 'px';


    // handle direction
    if(dr != 0) {
        player.style.transform = `scaleX(${dr})`;
    }

    if (x > (cx - 28) && x < (cx + 32) && y > (cy - 38) && y < (cy + 20)) {
        pickup.play();
        collect();
    }
}



/***********************************
 * ANIMATE PLAYER
 * **********************************/
function animatePlayer() {
    if (can_play_walk) walk.play();
    if (spriteImg.getAttribute('src') == '../ArtAssets/RunHorizontally.png') {
        if (spriteImgNumber < 7) { // switch to next sprite position
            spriteImgNumber+=0.5;
            if (spriteImgNumber % 1 == 0) {
                let x = parseFloat(spriteImg.style.right);
                x += 18.0; // ANPASSEN!
                spriteImg.style.right = x + "px";
            }
        }
        else { // animation loop finished: back to start animation
            spriteImg.style.right = "0px";
            spriteImgNumber = 0;
        }
    }

    countIdle();
}

function countIdle() {
    setTimeout(function () {
        if (to_idle && spriteImg.getAttribute('src') == '../ArtAssets/RunHorizontally.png') {
            spriteImg.style.right = '0px';
            spriteImg.setAttribute('src', '../ArtAssets/Idle.gif');
        }
        else if (!to_idle && spriteImg.getAttribute('src') == '../ArtAssets/Idle.gif') spriteImg.setAttribute('src', '../ArtAssets/RunHorizontally.png');
    }, 100);
}


function collect() {
    cx = Math.max(18, Math.random() * 764);
    cy = Math.max(48, Math.random() * 358);
    money++;
    cash.style.left = cx + 'px';
    cash.style.top = cy + 'px';
    amount.querySelector('p').innerHTML = money + '$';
    amount.querySelector('img').style.filter = `hue-rotate(${(money%6)*60}deg)`;
}

let wx = 0;
let wy = 0;
let wall_speed = 1;

function moveWall() {
    //x: min: 0, max: 764
    //y: min: 0, max: 220
    
    if (can_move) wall.style.left = (wx + wall_speed) + 'px';
    if (wx > 792) {
        wall.style.left = '0px';
        wall.style.top = (Math.random() * 220)+'px';
        wy = parseFloat(wall.style.top);
    }

    wx = parseFloat(wall.style.left);

    let x = parseFloat(player.style.left);
    let y = parseFloat(player.style.top);

    if ((y <= (wy+86) || y >= (wy+128)) && (x >= wx - 4 && x <= wx + 4) && can_move) {
        loseSound.play();
        lose();
    }

    setTimeout(function() {
        moveWall();
    }, 5);
}

function increaseWallSpeed() {
    wall_speed += 0.01;
    setTimeout(function() {
        increaseWallSpeed();
    }, 750);
}

let firstCallLose = true;
function lose() {
    can_move = false;
    loseE.style.transform = 'translate(-8vw, -2vh)';
    setTimeout(function() {
        localStorage['score'] = money;
        if (money > localStorage['highScore']) localStorage['highScore'] = money;
        
        if (localStorage.getItem('scoreList') == 'null' || localStorage.getItem('scoreList') == null) {
            localStorage['scoreList'] = JSON.stringify({'scores': []});
        }
        let scores = JSON.parse((localStorage['scoreList']));
        scores.scores.push([localStorage['name'], localStorage['score']]);
        localStorage['scoreList'] = JSON.stringify(scores);
        
        window.location.href = 'leaderboard.html';
    }, 540);
}