import express from 'express';
import fsp from 'fs/promises';
import WebSocket from 'ws';
import multer from 'multer';
import path from 'path';




//******** Consts */

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log('************ Server gestartet ************');
    console.log(`Erreichbar unter http://localhost:${port}`);
});
const wss = new WebSocket.Server({server});

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '/../uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage});




//*******APP USE */

app.use(express.json());
//EXPRESS SERVER
app.use(express.static(__dirname + '/../public') );
//UPLOAD - MULTER
app.use('/uploads', express.static(__dirname + '/../uploads'));
//MIDDLEWARE für POST Daten
app.use(express.json());
//MIDDLEWARE für FORM Daten
app.use(express.urlencoded({extended: true}));



/******* INTERFACES */

interface Message {
    user: string,
    message: string,
    id: string,
    color: string,
    imagePath: string
}
interface User {
    uname: string,
    email: string,
    password: string,
    color: string
}    



/***** Lets */

let messages: Message[] = [];
let users: User[] = [];
let latest_id:string = '';
let ws: WebSocket | null = null;

let password_patt = /(?=.*[A-Z]){1,}(?=.*[a-z]){1,}(?=.*[0-9]){1,}.{8,}/;




/****** Async functions + start-up stuff */

async function readMessages() {
    const data:string = await fsp.readFile(__dirname + '/../data/messages.json', 'utf-8');
    messages = JSON.parse(data);
    if (messages.length == 0) latest_id = 'a';
    else latest_id = messages[messages.length-1].id;
    
    if (latest_id != 'a') nextId();
}    
async function getUsers() {
    const data:string = await fsp.readFile(__dirname + '/../data/users.json', 'utf-8');
    users = JSON.parse(data);
}    
readMessages();
getUsers();

function nextId() {
    latest_id = latest_id;
}    

wss.on('connection', (client) => {
    console.log('Client connected');

    ws = client;
    client.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    client.on('close', () => {
        console.log('Client disconnected');
        ws = null;
    });
});


/****** App.gets */

app.get('/get-messages', (_req, res)=>{

    
    let answer:object = {
        'messages': messages
    };    
    res.send(answer);

});    

app.get('/clear', (_req, res)=> {
    messages = [];
    fsp.writeFile(__dirname + '/../data/messages.json', JSON.stringify(messages, null, 2), 'utf-8');
    res.send({'success': true});
})    
app.get('/get-messages/:id', (req, res)=> {

    let id = req.params.id;

    let answer:Object = {};

    let exists = false;
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id == id) {
            exists = true;
            answer = {
                'message': messages[i]
            }    
            res.send(answer);
            break;
        }    
    }    
    if (!exists) {
        answer = {'error': 'invalid parameter'};
        res.send(answer);
    }    
    
})    




/****** App.post */

app.post('/send-message', upload.single('image'), (req, res) => {

    let user = req.body.user;
    let message = req.body.message;
    let color = '';

    let image_filename = req.file ? req.file.filename : '';
    let image_path = path.join('/uploads', image_filename);
    console.log(req.file);

    for (let i = 0; i < users.length; i++) {
        if (users[i].uname == user) {
            color = users[i].color;
        }    
    }    
    if (color == '') color = 'rgb(0, 0, 0)';

    let new_message:Message = {
        'user': user,
        'message': message,
        'id': latest_id,
        'color': color,
        'imagePath': image_path
    };    
    nextId();

    messages.push(new_message);

    try {
        fsp.writeFile(__dirname + '/../data/messages.json', JSON.stringify(messages, null, 2), 'utf-8');
        let answer = {'success': true};
        res.send(answer);

        if (ws && ws.readyState === WebSocket.OPEN) {
            const data = {new_messages: messages};
            console.log(data)
            ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection is not open.');
        }    

    } catch (error) {
        console.log(error);
        let answer = {'success': false};
        res.send(answer);
    }    
});    

//REGISTER
app.post('/register-user', (req, res) => {

    let uname = req.body.uname;
    let email = req.body.email;
    let password = req.body.password;
    let check_password = req.body.password2;
    let success = false;
    let color = 'rgb('+Math.round(Math.random() * 255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')';

    if (password == check_password && password_patt.test(password)) {
        success = true;
        for (let i = 0; i < users.length; i++) {
            if (users[i].uname == uname) success = false;
        }    
        if (success) {
            let new_user:User = {
                'uname': uname,
                'email': email,
                'password': password,
                'color': color
            };    

            users.push(new_user);
        }    
    }    

    let answer = {};
    try {
        if (success) {
            fsp.writeFile(__dirname + '/../data/users.json', JSON.stringify(users, null, 2), 'utf-8');
            answer = {'success': true};
        } else answer = {'success': false};    
    } catch (error) {
        console.log(error);
        answer = {'success': false};
    }    
    res.send(answer);
});    

//LOGIN
app.post('/login-user', (req, res) => {

    let uname = req.body.uname;
    let password = req.body.password;

    let success = false;
    for (let i = 0; i < users.length; i++) {
        if (uname == users[i].uname && password == users[i].password) {
            if (password_patt.test(password)) {
                success = true;
                break;
            }    
        }    
    }    

    let answer;
    if (success) {
        answer = {'success': true};
    } else answer = {'success': false};    
    res.send(answer);

});    



//NGROK SERVER
/*
import ngrok from 'ngrok';
(async function() {
    const url = await ngrok.connect({
        authtoken: '[your_authtoken]',
        addr: port
    });    
    console.log('********** ngrok Tunnel offen ***************');
    console.log(url);
    console.log('');
})();*/