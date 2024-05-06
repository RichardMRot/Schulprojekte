let uname = document.querySelector('#name');
let email = document.querySelector('#email');
let password1 = document.querySelector('#password1');
let password2 = document.querySelector('#password2');
let toggle_visible1 = document.querySelector('#password-visibility1');
let toggle_visible2 = document.querySelector('#password-visibility2');

function showPassword1() {
    if (password1.type === 'password') password1.type = 'text';
    else password1.type = 'password';
}

function showPassword2() {
    if (password2.type === 'password') password2.type = 'text';
    else password2.type = 'password';
}

let password_patt = /(?=.*[A-Z]){1,}(?=.*[a-z]){1,}(?=.*[0-9]){1,}.{8,}/;
function register() {
    let username = uname.value;
    let uemail = email.value;
    let upassword1 = password1.value;
    let upassword2 = password2.value;

    if (username.value != '' && password1.value != '' && password2.value != '' && uemail.value != '') {
        if (password_patt.test(upassword1)) {
            let user_data = {
                'uname': username,
                'email': uemail,
                'password': upassword1,
                'password2': upassword2
            };
            fetch('/register-user', {
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
                    window.location.href = 'login.html';
                }
                else {
                    document.querySelector('h3').innerHTML = 'Name used or password not the same';
                    document.querySelector('h3').style.display = 'block';
                }
            })
            .catch( (error) => {
                throw error;
            })
        } else {
            document.querySelector('h3').innerHTML = 'Password must have large-, small letters, numbers and min. 8 characters.';
            document.querySelector('h3').style.display = 'block';
        }
    } else {
        document.querySelector('h3').innerHTML = 'Fill out all input-fields.';
        document.querySelector('h3').style.display = 'block';
    }
}