let gridBackground = document.querySelectorAll('#gridBackground table')[0];
let pressed = true;
setTimeout(() => {
    pressed = false;
}, 1200);

for (let i = 0; i < 19; i++) {
    let tds = '';
    for (let j = 0; j < 49; j++) {
        tds += '<td>     </td>';
    }
    gridBackground.innerHTML += '<tr>'+tds+'</tr>';
}

if (sessionStorage.getItem('animation') == 'left') {
    document.getElementById('paper').style.animation = 'pageToLeft 1.2s ease-in 1';
    sessionStorage.setItem('animation', 'none');
}


if (localStorage.getItem('money1') == null) localStorage.setItem('money1', 0);
if (localStorage.getItem('money2') == null) localStorage.setItem('money2', 0);
if (localStorage.getItem('color1') == null) localStorage.setItem('color1', '#ffffff');
if (localStorage.getItem('color2') == null) localStorage.setItem('color2', '#ffffff');
if (localStorage.getItem('taunt1') == null) localStorage.setItem('taunt1', 'simple');
if (localStorage.getItem('taunt2') == null) localStorage.setItem('taunt2', 'simple');
if (localStorage.getItem('price1.10') == null) localStorage.setItem('price1.10', 10);
if (localStorage.getItem('price1.15') == null) localStorage.setItem('price1.15', 15);
if (localStorage.getItem('price2.10') == null) localStorage.setItem('price2.10', 10);
if (localStorage.getItem('price2.15') == null) localStorage.setItem('price2.15', 15);
if (localStorage.getItem('wins1') == null) localStorage.setItem('wins1', 0);
if (localStorage.getItem('wins2') == null) localStorage.setItem('wins2', 0);


document.querySelector('#wins h3:nth-child(1)').innerHTML = 'Player 1 (X) won '+localStorage.getItem('wins1')+' times';
document.querySelector('#wins h3:nth-child(2)').innerHTML = 'Player 2 (O) won '+localStorage.getItem('wins2')+' times';


function play() {
    if (!pressed) {
        document.getElementById('paper').style.animation = '';
        document.getElementById('paper').classList += 'fromRight';
        setTimeout(() => {
            sessionStorage.setItem('animation', 'right');
            window.location.href = 'subpages/game.html';
        }, 1100);
        pressed = true;
    }
}

function shop() {
    if (!pressed) {
        document.getElementById('paper').style.animation = '';
        document.getElementById('paper').classList += 'fromLeft';
        setTimeout(() => {
            sessionStorage.setItem('animation', 'left');
            window.location.href = 'subpages/shop.html';
        }, 1000);
        pressed = true;
    }
}


function clearSave() {
    localStorage.clear();
    window.location.href = 'index.html';
}