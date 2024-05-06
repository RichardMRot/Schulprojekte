let input_name = document.querySelector('#name');
let input_password = document.querySelector('#password');
let error = document.querySelector('#error');

document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' && (input_name.value != '' || input_password.value != '')) {
        logIn();
    }
});


function logIn() {
    let user_data = {
        'uname': input_name.value,
        'upassword': input_password.value
    }
    fetch(`${window.location.protocol}//${window.location.hostname}:4000/auth-user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
    })
        .then( (response) => {
            return response.json();
        })

        .then( (answer) => {
            
            console.log(answer);
            if (answer.success == true) {
                localStorage.loggedIn = 'true';
                window.location.href = 'subpages/raetsel.html';
            }
            else {
                wrong();
            }
        })
        
        .catch( (error) => {
            throw error;
        })
}

function wrong() {
    input_name.classList.remove('inputAnimation');
    input_name.offsetHeight;
    input_name.classList.add('inputAnimation');
    input_password.classList.remove('inputAnimation');
    input_password.offsetHeight;
    input_password.classList.add('inputAnimation');

    error.style.animation = 'none';
    error.offsetHeight;
    error.style.animation = 'errorFade 1.2s ease 1';
}

function logout() {
    localStorage.loggedIn = 'false';
}