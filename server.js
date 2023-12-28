const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static('client'));

let list = ["yes", "no", "test"];
let pygora_goat = { Name: "Pygora Goat" };

app.post('/getData', (req, resp) => {
    resp.send(list);
});

app.post('/pygora', (req, resp) => {
    resp.send(pygora_goat);
});

app.get('/pygora/name', (req, resp) => {
    resp.send(pygora_goat["Name"]);
});

app.get('/pygora', (req, resp) => {
    resp.send(pygora_goat);
});

app.get('/list', function (req, resp) {
    resp.send(pygora_goat);
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});