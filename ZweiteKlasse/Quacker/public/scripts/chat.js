const write = document.querySelector('#write input:nth-child(2)');
const messages = document.querySelector('#messages');

const ws = new WebSocket('ws://localhost:3000');
let newData = {}

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};
ws.onmessage = (event) => {
    newData = JSON.parse(event.data);
    updateNewMessage();
};
ws.onclose = () => {
    console.log('Connection closed');
};

document.addEventListener('keyup', function(event) {
    if (event.key == 'Enter' && write.value != '') {
        sendMessage();
    }
});


if (localStorage.getItem('quackUser') === null) {
    localStorage.setItem('quackUser', '[NONE]');
}
if (localStorage.getItem('quackUser') === '[NONE]') {
    write.placeholder = 'Log in/Register first!';
    write.disabled = true;
} else {
    document.querySelector('#log-in').innerHTML = 'Log-Out'
}


getMessages();
messages.scrollTop = messages.scrollHeight;

function getMessages() {
    fetch('/get-messages')
    .then( (response) => {
        return response.json();
    })

    .then ( (answer) => {
        console.log(answer);
        for (let i = 0; i < answer.messages.length; i++) {
            
            let colorString = answer.messages[i].color.substring(4);
            colorString = colorString.replace(')', '');
            let colorArr = colorString.split(',');
            let howManyDark = 0;
            for (let j = 0; j < colorArr.length; j++) {
                if (parseInt(colorArr[j]) < 150) howManyDark++;
            }

            messages.innerHTML += `
            <div class="${answer.messages[i].user == localStorage.quackUser ? 'my-message' : 'other-message" style="background-color:'+answer.messages[i].color+(howManyDark == 3 ? ';color:white;':'')}">
                <h2>${answer.messages[i].user}</h2>
                <h3>${answer.messages[i].message}</h3>
                ${answer.messages[i].imagePath != '\\uploads' ? '<img src="'+answer.messages[i].imagePath+'" alt="Image">' : ''}
            </div>
            `;
        }
        messages.scrollTop = messages.scrollHeight;
    })

    .catch( (error) => {
        throw error;
    })
}

let loggedIn = true;
function sendMessage() {
    if (loggedIn) {
        let username = localStorage.getItem('quackUser');
        let message = write.value;
        let password = localStorage.getItem('quackPassword');

        let image = document.getElementById('image').files[0];

        if (write.value != '' || image != undefined) {
            let formData = new FormData();
            formData.append('user', username);
            formData.append('message', message);
            formData.append('password', password);
            formData.append('image', image);
            fetch('/send-message', {
                method: 'POST',
                body: formData
            })
            .then( (response) => {
                return response.json();
            })
            .then( (answer) => {
                console.log(answer);
                if (answer.success) write.value = '';
            })
            .catch( (error) => {
                throw error;
            })
        }
    }
}


function updateNewMessage() {
    let new_messages = newData.new_messages[newData.new_messages.length-1];

    let colorString = new_messages.color.substring(4);
    colorString = colorString.replace(')', '');
    let colorArr = colorString.split(',');
    let howManyDark = 0;
    for (let j = 0; j < colorArr.length; j++) {
        if (parseInt(colorArr[j]) < 150) howManyDark++;
    }

    messages.innerHTML += `
    <div class="${new_messages.user == localStorage.quackUser ? 'my-message' : 'other-message" style="background-color:'+new_messages.color+(howManyDark == 3 ? ';color:white;':'')}">
        <h2>${new_messages.user}</h2>
        <h3>${new_messages.message}</h3>
        ${new_messages.imagePath != '\\uploads' ? '<img src="'+new_messages.imagePath+'" alt="Image">' : ''}
    </div>
    `;
    messages.lastElementChild.style.animation = new_messages.user == localStorage.quackUser ? 'message-added-right 0.4s ease 1' : 'message-added-left 0.4s ease 1';
    messages.scrollTop = messages.scrollHeight;
}

login()
function login() {
    let username = localStorage['quackUser'];
    let upassword = localStorage['quackPassword'];

    if (username.value != '' && upassword.value != '') {
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
            if (!answer) {
                write.placeholder = 'Log in/Register first!';
                write.disabled = true;
                loggedIn = false
            }
        })
        .catch( (error) => {
            throw error;
        })
    }
}