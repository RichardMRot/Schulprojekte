let click_button = new Audio("../SoundAssets/select.wav");

document.querySelector('h2').innerHTML = 'Your Score: ' + localStorage['score'];

let leaderboard = document.querySelector('#leaderboard');
let scores = JSON.parse(localStorage['scoreList']).scores;

setLeaderboard();

function setLeaderboard() {

    let notSorted = true;
    while (notSorted) {
        notSorted = false;
        for (let i = 0; i < scores.length; i++) {
            if (parseInt(scores[i][1]) > parseInt(scores[Math.max(0, i-1)][1])) {
                
                let help = scores[Math.max(0, i-1)];
                scores[Math.max(0, i-1)] = scores[i];
                scores[i] = help;
                notSorted = true;
            
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        leaderboard.innerHTML += `<tr>
            <td ${i <= scores.length-1 ? scores[i][0] == localStorage['name'] ? 'style="background-color:gray;color:black;"' : '' : ''}>${i > scores.length-1 ? 'None': scores[i][0]}</td>
            <td ${i <= scores.length-1 ? scores[i][0] == localStorage['name'] ? 'style="background-color:gray;color:black;"' : '' : ''}>${i > scores.length-1 ? 0 : scores[i][1]}</td>
        </tr>`;
    }
}

function playAgain() {
    click_button.play();
    setTimeout(function() {
        window.location.href = 'spritegame.html';
    }, 180);
}

function menu() {
    click_button.play();
    setTimeout(function() {
        window.location.href = '../index.html';
    }, 180);
}