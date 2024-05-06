let antwort = '';
if (localStorage.getItem('level') == null) localStorage.setItem('level', 1);
generateRaetsel();

let inputAntwort = document.querySelector('#antwort');

document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        if (document.activeElement == document.querySelector('#antwort')) {
            answer();
        }
    }
});

function generateRaetsel() {
    let i = localStorage.level;
    fetch(`${window.location.protocol}//${window.location.hostname}:4000/get-raetsel/`+i)
        .then( (response) => {
            return response.json();
        })

        .then( (raetsel) => {

            document.querySelector('#raetsel #generate').innerHTML = `
            <h2>Rätsel #${raetsel.raetsel.id}</h2>
            <h3>${raetsel.raetsel.raetsel}</h3>
            <h4 class="${raetsel.raetsel.input == '' ? 'empty' : ''}">${raetsel.raetsel.input}</h4>
            `;

            antwort = raetsel.raetsel.antwort;
        })
        
        .catch( (error) => {
            throw error;
        })
}
//GH46lp*+#sdjyxNA12/);CX:

function answer() {
    if (localStorage.level <= 9) {
        if (inputAntwort.value == antwort) {
            localStorage.level++;
            generateRaetsel()
            inputAntwort.value = null;
        }
        else {
            let box = document.querySelector('#submit_box')
            box.classList.remove('inputAnimation');
            box.offsetHeight;
            box.classList.add('inputAnimation');
        }
    }
    if (localStorage.level > 9) window.location.href = 'all.html';
}

function changePage() {
    window.location.href = 'tipps.html';
}

function checkOnload() {
    if (localStorage.loggedIn == 'false') {
        window.location.href = '../index.html';
    }
    if (localStorage.level > 9) {
        window.location.href = 'all.html';
    }
}

function logout() {
    localStorage.loggedIn = 'false';
    window.location.href = '../index.html';
}