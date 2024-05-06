let gridBackground = document.querySelectorAll('#gridBackground table')[0];
let turn = 1;
let playfield = 
[
[0, 0, 0],
[0, 0, 0],
[0, 0, 0]
];
let won = false;


for (let i = 0; i < 19; i++) {
    let tds = '';
    for (let j = 0; j < 49; j++) {
        tds += '<td>     </td>';
    }
    gridBackground.innerHTML += '<tr>'+tds+'</tr>';
}

if (sessionStorage.getItem('animation') == 'right') {
    document.getElementById('paper').style.animation = 'pageToLeft 1.2s ease-in 1';
    sessionStorage.setItem('animation', 'none');
}

let playfieldString = '<table id="playfield">';
for (let i = 0; i < 3; i++) {
    playfieldString += '<tr>';
    for (let j = 0; j < 3; j++) {
        playfieldString += '<td onclick="fillOut(this, '+i+', '+j+')"></td>';
    }
    playfieldString += '</tr>';
}
playfieldString += '</table>';
document.querySelectorAll('body')[0].innerHTML += playfieldString;


function checkW(playfield, row, column, turn) {
    let win = [true, true, true, true];
    for (let i = 0; i < playfield.length; i++) {

        if (playfield[row][i] != turn && win[0]) win[0] = false;
        else {if (win[0] && i+1 == playfield.length) winType = [0, row];}

        if (playfield[i][column] != turn && win[1]) win[1] = false;
        else {if (win[1] && i+1 == playfield.length) winType = [1, column];}

        if (playfield[i][i] != turn && win[2]) win[2] = false;
        else {if (win[2] && i+1 == playfield.length) winType = [2, 0];}

        if (playfield[i][2-i] != turn && win[3]) win[3] = false;
        else {if (win[3] && i+1 == playfield.length) winType = [3, 1];}

    }
    return win;
}


function fillOut(playgrid, row, column) {
    if (playfield[row][column] == 0) {

        if (!won) playfield[row][column] = turn;

        if (turn == 1 && !won) {
            playgrid.innerHTML += '<img src="../assets/X.png">';
            playgrid.style.background = localStorage.getItem('color1')+'44';
        }
        else if (turn == 2 && !won) {
            playgrid.innerHTML += '<img src="../assets/O.png">';
            playgrid.style.background = localStorage.getItem('color2')+'44';
        }

        let check;
        check = checkW(playfield, row, column, turn);
        for (let i = 0; i < check.length; i++) {
            if (check[i] == true) {
                won = true;
                document.querySelector('#turn h2').innerHTML = 'Player '+turn+' won! +5 coins'
                let money = parseInt(localStorage.getItem('money'+turn));
                money += 5;
                localStorage.setItem('money' + turn, money);
                let wins = parseInt(localStorage.getItem('wins'+turn));
                wins += 1;
                localStorage.setItem('wins'+turn, wins);

                winAnimation(check, row, column, turn);
            }
        }
        let tie = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (playfield[i][j] == 0) tie = false;
            }
        }

        if (!tie && !won) {
            if (turn == 1) turn = 2;
            else if (turn == 2) turn = 1;
            document.querySelector('#turn h2').innerHTML = "It's "+(turn==1 ? 'X' : 'O')+"'s turn.";
        }
        else if (tie && !won) {
            turn = 0;
            document.querySelector('#turn h2').innerHTML = "It's a tie. :( <br>Losers!";
            let end = document.querySelector('#end');
            end.style.transform = 'translateY(-118vh)';
            end.innerHTML += `<div id="playagain" onclick="window.location.href='game.html'" style="transform:translateY(-40vh)">Play again</div>`
        }
        document.querySelector('#turn').style.scale = '1.2';
        setTimeout(() => {
            document.querySelector('#turn').style.scale = '1';
        }, 410);

    }
}


function winAnimation(checkedWin, row, column, turn) {
    console.log(checkedWin)
    if (checkedWin[0] == true) {
        document.querySelector('#playfield tr:nth-child('+(row+1)+') td').innerHTML += 
        `<img src="../assets/line.png" alt='a line woohoo' class="line" id="row">`
    }
    if (checkedWin[1] == true) {
        document.querySelector('#playfield td:nth-child('+(column+1)+')').innerHTML += 
        `<img src="../assets/line.png" alt='a line woohoo' class="line" id="column">`
    }
    if (checkedWin[2] == true) {
        document.querySelector('#playfield td:nth-child('+1+')').innerHTML += 
        `<img src="../assets/line.png" alt='a line woohoo' class="line" id="diagonal1">`
    }
    if (checkedWin[3] == true) {
        document.querySelector('#playfield td:nth-child('+3+')').innerHTML += 
        `<img src="../assets/line.png" alt='a line woohoo' class="line" id="diagonal2">`
    }
    document.querySelector('.line').style.width = '0%';
    setTimeout(() => {
        document.querySelector('.line').style.width = '100%';
    }, 140);
    endScreen(turn);
}


function endScreen(turn) {
    let end = document.querySelector('#end');
    end.style.transform = 'translateY(-118vh)';
    end.innerHTML += '<img src="../assets/'+localStorage.getItem('taunt'+turn)+'Taunt.png" alt="haha, get rekt. look at this epic taunt">'
    end.innerHTML += `<div id="playagain" onclick="window.location.href='game.html'">Play again</div>`
}


function back() {
    document.getElementById('paper').style.animation = 'pageFromLeft 1.2s ease-in 1';
    setTimeout(() => {
        sessionStorage.setItem('animation', 'left');
        window.location.href = '../index.html';
    }, 1100);
}