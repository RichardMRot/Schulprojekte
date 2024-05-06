import express from 'express';


const app = express();

const port = 3000;


app.use(express.static(__dirname + '/../public'));

app.listen(port, () => {
    console.log('************ Server gestartet ************');
    console.log(`Erreichbar unter http://localhost:${port}`);
})