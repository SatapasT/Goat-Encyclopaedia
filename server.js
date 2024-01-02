const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('client'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());
const json_file = 'data/data.json';
const data = JSON.parse(fs.readFileSync(json_file));

app.get('/goat_name/:species', (req, resp) => {
    const species = req.params.species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        resp.send(goatEntry.name[0]);
        console.log(species, goatEntry);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});



const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});