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

app.get('/:species', (req, resp) => {
    const species = req.params.species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        resp.send(`<strong>${goatEntry["name"].toString()}</strong>`);
        console.log(species, goatEntry);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:species/:value', (req, resp) => {
    const species = req.params.species;
    const value = req.params.value;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry && value == "pro_con"){
        let list = [];
        let colour_selection = 0
        let string_find = "<h2>"
        const pro_con_colour_dict = {1:"bg-success-subtle", 2:"bg-danger-subtle"};
        for (let i =0; i < goatEntry[value].length; i++) {
            let entry = goatEntry[value][i]
            if (entry.includes(string_find)){
                colour_selection += 1
            }
            list.push(`<div class="row"><div class="col text-start ${pro_con_colour_dict[colour_selection]}">${entry}</div></div>`);
        }
        resp.send(list.join(''));
        console.log(species,value, goatEntry);
    } else if (goatEntry) {
        let list = [];
        const colour_dict = {0:"bg-light-subtle", 1:"bg-dark-subtle"}; 
        for (let i =0; i < goatEntry[value].length; i++) {
            list.push(`<div class="row"><div class="col text-start fs-6 ${colour_dict[i%2]}">${goatEntry[value][i]}</div></div>`);
        }
        resp.send(list.join(''));
        console.log(species,value, goatEntry);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:species/image/:current_img', (req, resp) => {
    const species = req.params.species;
    const current_img = req.params.current_img;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        resp.send(`<img src="assets/images/${species}/${parseInt(current_img) + 1}.jpg" class="img-fluid" alt="${species} img ${parseInt(current_img) + 1}">`);
        console.log(species,current_img, goatEntry);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});