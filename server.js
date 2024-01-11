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
        resp.send(`<strong> > ${goatEntry["name"].toString()} < </strong>`);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:species/information/:value', (req, resp) => {
    const species = req.params.species;
    const form_value = req.params.value;
    const goatEntry = data.find(entry => entry.species.includes(species));
    const item_colour_dict = {0:"bg-light-subtle", 1:"bg-dark-subtle"};
    const pro_con_colour_dict = {1:"bg-success-subtle", 2:"bg-danger-subtle"};
    if (goatEntry && form_value == "pro_con"){
        let list = [];
        let header_position = 0
        let string_find = ["Pros","Cons"]
        
        for (let i =0; i < goatEntry[form_value].length; i++) {
            let entry = goatEntry[form_value][i]
            if (entry.includes(string_find[header_position])){
                header_position += 1
                list.push(`<div class="row"><div class="col text-start ${pro_con_colour_dict[header_position]} border-bottom"><h2>${entry}</h2></div></div>`);
                continue;
            }
            list.push(`<div class="row"><div class="col text-start ${pro_con_colour_dict[header_position]}">${entry}</div></div>`);
        }
        resp.send(list.join(''));
    } else if (goatEntry) {
        let list = [];
        
        for (let i =0; i < goatEntry[form_value].length; i++) {
            let entry = goatEntry[form_value][i]
            list.push(`<div class="row"><div class="col text-start fs-6 ${item_colour_dict[i%2]}">${entry}</div></div>`);
        }
        resp.send(list.join(''));
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
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});