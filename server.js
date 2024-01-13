const express = require('express');
const app = express();
const fs = require('fs');


app.use(express.static('client'));
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(express.json());
const goat_data_file = 'data/goat_data.json';
const data = JSON.parse(fs.readFileSync(goat_data_file));

app.get('/:current_species', (request, response) => {
    const species = request.params.current_species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        response.send(`<strong> > ${goatEntry["name"].toString()} < </strong>`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/information/:value', (request, response) => {
    const species = request.params.current_species;
    const form_value = request.params.value;
    const goat_entry = data.find(entry => entry.species.includes(species));
    const item_colour_dict = {0:"bg-light-subtle", 1:"bg-dark-subtle"};
    const pro_con_colour_dict = {1:"bg-success-subtle", 2:"bg-danger-subtle"};
    if (goat_entry && form_value == "pro_con"){
        let list = [];
        let header_position = 0
        let string_find = ["Pros","Cons"]
        for (let i =0; i < goat_entry[form_value].length; i++) {
            let entry = goat_entry[form_value][i]
            if (entry.includes(string_find[header_position])){
                header_position += 1
                list.push(`<div class="row"><div class="col text-start ${pro_con_colour_dict[header_position]} border-bottom"><h2>${entry}</h2></div></div>`);
                continue;
            }
            list.push(`<div class="row"><div class="col text-start ${pro_con_colour_dict[header_position]}">${entry}</div></div>`);
        }
        response.send(list.join(''));
    } else if (goat_entry) {
        let list = [];
        
        for (let i =0; i < goat_entry[form_value].length; i++) {
            let entry = goat_entry[form_value][i]
            list.push(`<div class="row"><div class="col text-start fs-6 ${item_colour_dict[i%2]}">${entry}</div></div>`);
        }
        response.send(list.join(''));
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/image/:current_img', (request, response) => {
    const species = request.params.current_species;
    const current_img = request.params.current_img;
    const goat_entry = data.find(entry => entry.species.includes(species));
    if (goat_entry) { 
        response.send(`<img src="assets/images/${species}/${parseInt(current_img) + 1}.jpg" class="img-fluid" alt="${species} img ${parseInt(current_img) + 1}">`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/form_info', (request, response) => {
    const species = request.params.current_species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        response.send(`<p class="lead fst-italic fs-4 text-end">Viewing <b>${goatEntry["name"].toString()}</b> form`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.post('/:species/comment_data', (request, response) => {
    console.log("hello", request.body);
    let comment_data = request.body;
    console.log(comment_data)
    response.send("WE SO WORKING")
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});