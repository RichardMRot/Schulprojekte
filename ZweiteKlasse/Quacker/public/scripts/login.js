let uname = document.querySelector('#name');
let password = document.querySelector('#password');
let toggle_visible = document.querySelector('#password-visibility');

function showPassword() {
    if (password.type === 'password') password.type = 'text';
    else password.type = 'password';
}

let password_patt = /(?=.*[A-Z]){1,}(?=.*[a-z]){1,}(?=.*[0-9]){1,}.{8,}/;
function login() {
    let username = uname.value;
    let upassword = password.value;

    if (uname.value != '' && password.value != '' && password_patt.test(upassword)) {
        let user_data = {
            'uname': username,
            'password': upassword
        };
        fetch('/login-user', {
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
            if (answer.success) {
                localStorage.setItem('quackUser', username);
                localStorage.setItem('quackPassword', password);
                window.location.href = '../index.html';
            }
            else {
                document.querySelector('h3').innerHTML = 'Wrong name or password';
                document.querySelector('h3').style.display = 'block';
            }
        })
        .catch( (error) => {
            throw error;
        })
    } else {
        document.querySelector('h3').innerHTML = 'Wrong name or password';
        document.querySelector('h3').style.display = 'block';
    }
}