import express from 'express';
import * as Raetsel from './raetsel';
import * as Users from './users';


const app = express();
const cors = require('cors');

const port = 4000;

app.use(cors());


app.get('/get-raetsel', (_req, res)=>{
    let answer:Object = {
        'raetsel': Raetsel.raetselListe
    }
    res.send(answer);
});

app.get('/get-raetsel/:which', (req, res)=>{
    let id = parseInt(req.params.which);

    let answer:Object = {};

    if (Number.isNaN(id) || (id > Raetsel.raetselListe.length && id != 89) || id <= 0) {
        answer = {
            'error': 'invalid parameter'
        };
    }
    else if (id == 89) {
        answer = {
            'answer': "3zPz1p7z;:_=)'*!12"
        }
    }
    else {
        answer = {
            'raetsel': Raetsel.raetselListe[id-1]
        }
    }
    res.send(answer);
});
app.use(express.json());
app.post('/auth-user', (req, res)=>{
    let uname:String = req.body.uname;
    let upassword:String = req.body.upassword;

    let answer:Object = {'success': false};

    if (uname != null && upassword != null) {
        for (let i = 0; i < Users.users.length; i++) {
            if (Users.users[i].name == uname && Users.users[i].password == upassword) answer = {'success': true};
        }
    }
    res.send(answer);
});

app.listen(port, () => {
    console.log('************ Server gestartet ************');
    console.log(`Erreichbar unter http://localhost:${port}`);
})