let gridBackground = document.querySelectorAll('#gridBackground table')[0];
for (let i = 0; i < 19; i++) {
    let tds = '';
    for (let j = 0; j < 49; j++) {
        tds += '<td>     </td>';
    }
    gridBackground.innerHTML += '<tr>'+tds+'</tr>';
}


document.querySelector('#money h2:nth-child(1)').innerHTML = 'Money Player 1: '+localStorage.getItem('money1')+'$';
document.querySelector('#money h2:nth-child(2)').innerHTML = 'Money Player 2: '+localStorage.getItem('money2')+'$'; 

if (sessionStorage.getItem('animation') == 'left') {
    document.getElementById('paper').style.animation = 'pageToRight 1.2s ease-in 1';
    sessionStorage.setItem('animation', 'none');
}

function back() {
    document.getElementById('paper').style.animation = 'pageFromLeft 1.2s ease-in 1';
    setTimeout(() => {
        document.getElementById('paper').style.animationDirection = 'normal';
        sessionStorage.setItem('animation', 'left');
        window.location.href = '../index.html';
    }, 1100);
}

document.querySelector('#taunts1 .buy:nth-child(2)').addEventListener('click', function () {
    buy('taunt', 'trophy', localStorage.getItem('price1.10'), 1, this);
})
document.querySelector('#taunts1 .buy:nth-child(2) h3').innerHTML = localStorage.getItem('price1.10')+'$';
document.querySelector('#taunts1 .buy:nth-child(3)').addEventListener('click', function () {
    buy('taunt', 'mean', localStorage.getItem('price1.15'), 1, this);
})
document.querySelector('#taunts1 .buy:nth-child(3) h3').innerHTML = localStorage.getItem('price1.15')+'$';
document.querySelector('#color1 input').value = localStorage.getItem('color1');
document.querySelector('#color2 input').value = localStorage.getItem('color2');
document.querySelector('#taunts2 .buy:nth-child(2)').addEventListener('click', function () {
    buy('taunt', 'trophy', localStorage.getItem('price2.10'), 2, this);
})
document.querySelector('#taunts2 .buy:nth-child(2) h3').innerHTML = localStorage.getItem('price2.10')+'$';
document.querySelector('#taunts2 .buy:nth-child(3)').addEventListener('click', function () {
    buy('taunt', 'mean', localStorage.getItem('price2.15'), 2, this);
})
document.querySelector('#taunts2 .buy:nth-child(3) h3').innerHTML = localStorage.getItem('price2.15')+'$';


function buy(type, which, price, player, sell) {
    if (localStorage.getItem('money'+player) >= price) {
        if (type == 'color') {
            if (sell.querySelector('input').value != localStorage.getItem('color'+player)) {
                localStorage.setItem('color'+player, sell.querySelector('input').value);
                let money = localStorage.getItem('money'+player);
                money -= price;
                localStorage.setItem('money'+player, money);
                sell.style.backgroundColor = 'rgba(50, 170, 50, 0.4)';
            }
        }
        else {
            localStorage.setItem(type+player, which);
            let money = localStorage.getItem('money'+player);
            money -= price;
            localStorage.setItem('money'+player, money);
            localStorage.setItem('price'+player+'.'+price, 0);
            sell.style.backgroundColor = 'rgba(50, 170, 50, 0.4)';
        }
    }
    document.querySelector('#money h2:nth-child(1)').innerHTML = 'Money Player 1: '+localStorage.getItem('money1')+'$';
    document.querySelector('#money h2:nth-child(2)').innerHTML = 'Money Player 2: '+localStorage.getItem('money2')+'$'; 
}