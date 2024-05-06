let revealed = false;

function changePage() {
    window.location.href = 'raetsel.html';
}

function reveal() {
    if(!revealed) {
        fetch(`${window.location.protocol}//${window.location.hostname}:4000/get-raetsel/`+localStorage.level)
            .then( (response) => {
                return response.json();
            })

            .then( (tipp) => {

                document.querySelector('h2').innerHTML = tipp.raetsel.hint;
            })
            
            .catch( (error) => {
                throw error;
            })
    }
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