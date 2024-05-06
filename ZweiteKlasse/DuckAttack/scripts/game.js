let characterChooseArray = document.getElementsByClassName('choose')
let type1
let type2
let game = document.getElementById('game')
let canRoll = true
let username1
let username2
let musicFirstTime = true
let current
let sfx1 = document.getElementById('sfx1')
let sfx2 = document.getElementById('sfx2')

function music(i, outside) {
    if (musicFirstTime || outside == false) {
        current = i
        document.getElementsByClassName('music')[i].play()
        setTimeout(() => {
            if (i == 0) music(1, false)
            else music(0, false)
        }, 5710);
        musicFirstTime = false
    }
}
let ducks = {
    normalduck: {
        health: 10,
        damage: 2
    },
    gentleentchen: {
        health: 6,
        damage: 3
    },
    knightduck: {
        health: 15,
        damage: 1
    },
    duolingo: {
        health: 10,
        damage: 4
    },
    bomb: {
        health: 1,
        damage: 18_9_3_8_1_18_4
    }

}

let duck1 = {
    originalHealth: 0,
    health: 0,
    damage: 0
}
let duck2 = {
    originalHealth: 0,
    health: 0,
    damage: 0
}

for (let i = 0; i < characterChooseArray.length; i++) {
    characterChooseArray[i].addEventListener('click', function () {
        choose(i)
    })
}

function choose(i) {
    sfx1.play()
    if (i != 3 && i != 7) {
        if (Math.floor(i / 4) == 0) {
            document.getElementById('choose1').style = "display:none;"
            fallAnimation(characterChooseArray[i].getElementsByTagName('img')[0].alt, i)
            if (document.getElementById('choose2').style.display == 'none') {
                document.getElementById('choosetemp').remove()
                start()
            }
        }
        else if (Math.floor(i / 4) == 1) {
            document.getElementById('choose2').style = "display:none;"
            fallAnimation(characterChooseArray[i].getElementsByTagName('img')[0].alt, i)
            if (document.getElementById('choose1').style.display == 'none') {
                document.getElementById('choosetemp').remove()
                start()
            }
        }
    }
    else {
        if (i == 3) which = 0
        if (i == 7) which = 1
        if (document.getElementsByClassName('secretInput')[which].value.toLowerCase() in ducks) {
            fallAnimation(document.getElementsByClassName('secretInput')[which].value, i)
            if (i == 3) {
                document.getElementById('choose1').style = "display:none;"
                if (document.getElementById('choose2').style.display == 'none') {
                    document.getElementById('choosetemp').remove()
                    start()
                }
            }
            if (i == 7) {
                document.getElementById('choose2').style = "display:none;"
                if (document.getElementById('choose1').style.display == 'none') {
                    document.getElementById('choosetemp').remove()
                    start()
                }
            }
        }
    }
}

function fallAnimation(name, i) {
    if (Math.floor(i / 4) == 0) {
        username1 = document.getElementById('choose1').getElementsByTagName('input')[0].value.replaceAll(' ', '᲼')
        duck1['originalHealth'] = ducks[name.toLowerCase()]['health']
        duck1['health'] = duck1.originalHealth
        duck1['damage'] = ducks[name.toLowerCase()]['damage']
        game.innerHTML += `<div id="hp1"><img src="../assets/heart.png" alt="Health"><p>${duck1['health']}</p>
        <div class="name"><p>${username1} </p><p>${name}</p></div></div>
        <div class="fighters" id="fighter1">
        <img src="../assets/Fighters/${name}.gif" alt="Fighter 1">
        </div>`
        document.getElementById('fighter1').style.animation = 'fall 0.65s ease 1'
        setTimeout(() => {
            document.getElementById('fighter1').style.animation = ''
        }, 650);
    }
    else {
        username2 = document.getElementById('choose2').getElementsByTagName('input')[0].value.replaceAll(' ', '᲼')
        duck2['originalHealth'] = ducks[name.toLowerCase()]['health']
        duck2['health'] = duck2.originalHealth
        duck2['damage'] = ducks[name.toLowerCase()]['damage']
        game.innerHTML += `<div id="hp2"><img src="../assets/heart.png" alt="Health"><p>${duck2['health']}</p>
        <div class="name"><p>${username2} </p><p>${name}</p></div></div>
        <div class="fighters" id="fighter2">
        <img src="../assets/Fighters/${name}.gif" alt="Fighter 2">
        </div>`
        document.getElementById('fighter2').style.animation = 'fall2 0.65s ease 1'
        setTimeout(() => {
            document.getElementById('fighter2').style.animation = ''
        }, 650);
    }
}

function start() {
    game.innerHTML += `
    <div class="button" onclick="rollDice()">Roll</div>
    <div id="dice">
        <img src="../assets/1.png" alt="Dice" class="dice" id="dice1">
        <img src="../assets/1.png" alt="Dice" class="dice" id="dice2">
    </div>`
}

function rollDice() {
    if (canRoll) {
        canRoll = false
        sfx1.play()
        let dice1 = randomDice()
        let dice2 = randomDice()
        document.getElementsByClassName('button')[0].style.animation = 'disableRoll 1.6s ease 1'
        document.getElementById('dice1').style.animation = 'roll1 0.6s ease 1'
        document.getElementById('dice2').style.animation = 'roll2 0.6s ease 1'
        let timeout = setTimeout(function () {
            document.getElementById('dice1').src = '../assets/' + dice1 + '.png'
            document.getElementById('dice2').src = '../assets/' + dice2 + '.png'
            clearTimeout(timeout)
        }, 300)
        let timeout2 = setTimeout(() => {
            document.getElementById('dice1').style.animation = ''
            document.getElementById('dice2').style.animation = ''
            clearTimeout(timeout2)
            if (dice1 > dice2) hurtAnimation(1)
            else if (dice2 > dice1) hurtAnimation(2)
            else hurtAnimation(3)
        }, 600);
    }
}

function randomDice() {
    return Math.ceil(Math.random() * 6)
}

function hurtAnimation(i) {
    let lost = false;
    if (i == 1) {
        if (duck1['originalHealth'] != 1 && duck1['originalHealth'] != 3 && duck1['damage'] != 4) {
            document.getElementById('fighter1').style.animation = 'attack1 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/hit.wav'
                sfx2.play()
            }, 400);
        }
        else if (duck1['originalHealth'] == 3) {
            document.getElementById('fighter1').style.animation = 'attack1 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/bene.wav'
                console.log('huh')
                sfx2.play()
            }, 200);
        }
        else if (duck1['damage'] == 4) {
            document.getElementById('fighter1').style.animation = 'attack1 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/duolingo-correct.mp3'
                sfx2.play()
            }, 200);
        }
        else {
            document.getElementById('fighter1').getElementsByTagName('img')[0].style.width = '500vw'
            document.getElementById('fighter1').getElementsByTagName('img')[0].style.transform = 'translate(-180vw, -330vh)'
            sfx2.src = '../assets/explosion.wav'
            sfx2.play()
        }
        if (duck2['health'] - duck1['damage'] > 0) {
            document.getElementById('fighter2').style.animation = 'hurt2 1s ease 1'
            document.getElementById('hp2').getElementsByTagName('img')[0].style.animation = 'hit 0.4s ease 1'
        }
        else {
            document.getElementById('fighter2').style.animation = 'lost2 1s ease 1'
            document.getElementById('hp2').style.animation = 'lose2 1s ease 1'
            lost = true
            for (let j = 0; j < 2; j++) {
                document.getElementsByClassName('music')[j].pause
                document.getElementsByClassName('music')[j].src = '../assets/wintheme.wav'
            }
            current = 0
            music(0, false)
        }
    }
    else if (i == 2) {
        if (duck2['originalHealth'] != 1 && duck2['originalHealth'] != 3 && duck2['damage'] != 4) {
            document.getElementById('fighter2').style.animation = 'attack2 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/hit.wav'
                sfx2.play()
            }, 400);
        }
        else if (duck2['originalHealth'] == 3) {
            document.getElementById('fighter2').style.animation = 'attack2 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/bene.wav'
                sfx2.play()
            }, 200);
        }
        else if (duck2['damage'] == 4) {
            document.getElementById('fighter2').style.animation = 'attack2 1s ease 1'
            setTimeout(() => {
                sfx2.src = '../assets/duolingo-correct.mp3'
                sfx2.play()
            }, 200);
        }
        else {
            document.getElementById('fighter2').getElementsByTagName('img')[0].style.width = '500vw'
            document.getElementById('fighter2').getElementsByTagName('img')[0].style.transform = 'translate(-120vw, -330vh)'
            sfx2.src = '../assets/explosion.wav'
            sfx2.play()
        }
        if (duck1['health'] - duck2['damage'] > 0) {
            document.getElementById('fighter1').style.animation = 'hurt1 1s ease 1'
            document.getElementById('hp1').getElementsByTagName('img')[0].style.animation = 'hit 0.4s ease 1'
        }
        else {
            document.getElementById('fighter1').style.animation = 'lost1 1s ease 1'
            document.getElementById('hp1').style.animation = 'lose1 1s ease 1'
            lost = true
            for (let j = 0; j < 2; j++) {
                document.getElementsByClassName('music')[j].pause
                document.getElementsByClassName('music')[j].src = '../assets/wintheme.wav'
            }
            current = 0
            music(0, false)
        }
    }
    else {
        document.getElementById('fighter1').style.animation = 'tie1 1s ease 1'
        document.getElementById('fighter2').style.animation = 'tie2 1s ease 1'
    }

    let timeout = setTimeout(() => {
        if (i == 1) {
            duck2['health'] -= duck1['damage']
            if (!lost) {
                document.getElementById('hp2').getElementsByTagName('p')[0].innerHTML = duck2['health']
                document.getElementById('hp2').getElementsByTagName('img')[0].style.animation = ''
            }
            else {
                document.getElementById('hp2').remove()
                document.getElementById('dice').remove()
                document.getElementsByClassName('button')[0].remove()
            }
        }
        else if (i == 2) {
            duck1['health'] -= duck2['damage']
            if (!lost) {
                document.getElementById('hp1').getElementsByTagName('p')[0].innerHTML = duck1['health']
                document.getElementById('hp1').getElementsByTagName('img')[0].style.animation = ''
            }
            else {
                document.getElementById('hp1').remove()
                document.getElementById('dice').remove()
                document.getElementsByClassName('button')[0].remove()
            }
        }
    }, 600);
    let timeout2 = setTimeout(() => {
        canRoll = true
        if (i == 1 && lost) {
            document.getElementById('fighter2').remove()
            if (duck1['originalHealth'] != 1) {
                document.getElementById('fighter1').style.animation = 'victory 1s ease infinite'
                document.getElementById('fighter1').style.transform = 'scaleX(-1)'
            }
            gameOver(i)
        }
        else if (i == 2 && lost) {
            document.getElementById('fighter1').remove()
            if (duck2['originalHealth'] != 1) document.getElementById('fighter2').style.animation = 'victory 1s ease infinite'
            gameOver(i)
        }
        if (!lost) {
            document.getElementById('fighter2').style.animation = ''
            document.getElementById('fighter1').style.animation = ''
            document.getElementsByClassName('button')[0].style.animation = ''
        }
    }, 1000);
}

let secrets = ["Duolingo", "Bomb"]

function gameOver(i) {

    game.innerHTML += `
    <div id="gameOver">
    <h2>${i+1==2?username1:username2} won!</h2>
    <div class="button" onclick="link('game.html')">Play again</div>
    <div class="button" onclick="link('../start.html')">Main Menu</div>
    <h3>Secret code: ${chooseRandom(secrets)}</h3>
    </div>
    `
    document.getElementById('gameOver').style.animation = 'fallGameOver 1.2s ease 1'

}

function link(path) {
    window.location.href = path
}

function chooseRandom(arr) {
    return secrets[Math.floor(Math.random() * arr.length)]
}