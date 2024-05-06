showRaetsel();
function showRaetsel() {
    fetch(`${window.location.protocol}//${window.location.hostname}:4000/get-raetsel/`)
        .then( (response) => {
            return response.json();
        })

        .then( (raetsel) => {

            for (let i = 0; i < raetsel.raetsel.length; i++) {
                document.querySelector('#raetsel').innerHTML += `
                <div>
                    <h2>Rätsel #${raetsel.raetsel[i].id}</h2>
                    <h3>${raetsel.raetsel[i].raetsel}</h3>
                    <h4 class="${raetsel.raetsel[i].input == '' ? 'empty' : ''}">${raetsel.raetsel[i].input}</h4>
                    <h3>Tipp: ${raetsel.raetsel[i].hint}</h3>
                    <h3>Antwort: <span>${raetsel.raetsel[i].antwort}</span></h3>
                </div>`;
            }
        })
        
        .catch( (error) => {
            throw error;
        })
}


function restart() {
    localStorage.level = 1;
    window.location.href = 'raetsel.html';
}

function checkOnload() {
    if (localStorage.loggedIn == 'false') {
        window.location.href = '../index.html';
    }
    if (localStorage.level < 10) {
        window.location.href = 'raetsel.html';
    }
}

function logout() {
    localStorage.loggedIn = 'false';
    window.location.href = '../index.html';
}