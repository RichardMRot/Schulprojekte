"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const ws_1 = __importDefault(require("ws"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
const server = app.listen(port, () => {
    console.log('************ Server gestartet ************');
    console.log(`Erreichbar unter http://localhost:${port}`);
});
const wss = new ws_1.default.Server({ server });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '/../uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + '/../public'));
app.use('/uploads', express_1.default.static(__dirname + '/../uploads'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
let messages = [];
let users = [];
let latest_id = '';
let ws = null;
let password_patt = /(?=.*[A-Z]){1,}(?=.*[a-z]){1,}(?=.*[0-9]){1,}.{8,}/;
function readMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield promises_1.default.readFile(__dirname + '/../data/messages.json', 'utf-8');
        messages = JSON.parse(data);
        if (messages.length == 0)
            latest_id = 'a';
        else
            latest_id = messages[messages.length - 1].id;
        if (latest_id != 'a')
            nextId();
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield promises_1.default.readFile(__dirname + '/../data/users.json', 'utf-8');
        users = JSON.parse(data);
    });
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
app.get('/get-messages', (_req, res) => {
    let answer = {
        'messages': messages
    };
    res.send(answer);
});
app.get('/clear', (_req, res) => {
    messages = [];
    promises_1.default.writeFile(__dirname + '/../data/messages.json', JSON.stringify(messages, null, 2), 'utf-8');
    res.send({ 'success': true });
});
app.get('/get-messages/:id', (req, res) => {
    let id = req.params.id;
    let answer = {};
    let exists = false;
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id == id) {
            exists = true;
            answer = {
                'message': messages[i]
            };
            res.send(answer);
            break;
        }
    }
    if (!exists) {
        answer = { 'error': 'invalid parameter' };
        res.send(answer);
    }
});
app.post('/send-message', upload.single('image'), (req, res) => {
    let user = req.body.user;
    let message = req.body.message;
    let color = '';
    let image_filename = req.file ? req.file.filename : '';
    let image_path = path_1.default.join('/uploads', image_filename);
    console.log(req.file);
    for (let i = 0; i < users.length; i++) {
        if (users[i].uname == user) {
            color = users[i].color;
        }
    }
    if (color == '')
        color = 'rgb(0, 0, 0)';
    let new_message = {
        'user': user,
        'message': message,
        'id': latest_id,
        'color': color,
        'imagePath': image_path
    };
    nextId();
    messages.push(new_message);
    try {
        promises_1.default.writeFile(__dirname + '/../data/messages.json', JSON.stringify(messages, null, 2), 'utf-8');
        let answer = { 'success': true };
        res.send(answer);
        if (ws && ws.readyState === ws_1.default.OPEN) {
            const data = { new_messages: messages };
            console.log(data);
            ws.send(JSON.stringify(data));
        }
        else {
            console.error('WebSocket connection is not open.');
        }
    }
    catch (error) {
        console.log(error);
        let answer = { 'success': false };
        res.send(answer);
    }
});
app.post('/register-user', (req, res) => {
    let uname = req.body.uname;
    let email = req.body.email;
    let password = req.body.password;
    let check_password = req.body.password2;
    let success = false;
    let color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
    if (password == check_password && password_patt.test(password)) {
        success = true;
        for (let i = 0; i < users.length; i++) {
            if (users[i].uname == uname)
                success = false;
        }
        if (success) {
            let new_user = {
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
            promises_1.default.writeFile(__dirname + '/../data/users.json', JSON.stringify(users, null, 2), 'utf-8');
            answer = { 'success': true };
        }
        else
            answer = { 'success': false };
    }
    catch (error) {
        console.log(error);
        answer = { 'success': false };
    }
    res.send(answer);
});
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
        answer = { 'success': true };
    }
    else
        answer = { 'success': false };
    res.send(answer);
});
