"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Raetsel = __importStar(require("./raetsel"));
const Users = __importStar(require("./users"));
const app = (0, express_1.default)();
const cors = require('cors');
const port = 4000;
app.use(cors());
app.get('/get-raetsel', (_req, res) => {
    let answer = {
        'raetsel': Raetsel.raetselListe
    };
    res.send(answer);
});
app.get('/get-raetsel/:which', (req, res) => {
    let id = parseInt(req.params.which);
    let answer = {};
    if (Number.isNaN(id) || (id > Raetsel.raetselListe.length && id != 89) || id <= 0) {
        answer = {
            'error': 'invalid parameter'
        };
    }
    else if (id == 89) {
        answer = {
            'answer': "3zPz1p7z;:_=)'*!12"
        };
    }
    else {
        answer = {
            'raetsel': Raetsel.raetselListe[id - 1]
        };
    }
    res.send(answer);
});
app.use(express_1.default.json());
app.post('/auth-user', (req, res) => {
    let uname = req.body.uname;
    let upassword = req.body.upassword;
    let answer = { 'success': false };
    if (uname != null && upassword != null) {
        for (let i = 0; i < Users.users.length; i++) {
            if (Users.users[i].name == uname && Users.users[i].password == upassword)
                answer = { 'success': true };
        }
    }
    res.send(answer);
});
app.listen(port, () => {
    console.log('************ Server gestartet ************');
    console.log(`Erreichbar unter http://localhost:${port}`);
});
