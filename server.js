const express = require('express');
const app = express();

app.use(express.static('client'));


let list = ["yes", "no"];

app.post('/getData', (req, resp) => {
    resp.send(list);
});

app.get('/list', function (req, resp){
    resp.send(list);
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});