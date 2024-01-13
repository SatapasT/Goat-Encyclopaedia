const express = require('express');
const app = express();
const fs = require('fs');


app.use(express.static('client'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.json());
const goat_data_file = 'data/goat_data.json';
const data = JSON.parse(fs.readFileSync(goat_data_file));

app.get('/:current_species', (req, resp) => {
    const species = req.params.current_species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        resp.send(`<strong> > ${goatEntry["name"].toString()} < </strong>`);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/information/:value', (req, resp) => {
    const species = req.params.current_species;
    const form_value = req.params.value;
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
        resp.send(list.join(''));
    } else if (goat_entry) {
        let list = [];
        
        for (let i =0; i < goat_entry[form_value].length; i++) {
            let entry = goat_entry[form_value][i]
            list.push(`<div class="row"><div class="col text-start fs-6 ${item_colour_dict[i%2]}">${entry}</div></div>`);
        }
        resp.send(list.join(''));
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/image/:current_img', (req, resp) => {
    const species = req.params.current_species;
    const current_img = req.params.current_img;
    const goat_entry = data.find(entry => entry.species.includes(species));
    if (goat_entry) { 
        resp.send(`<img src="assets/images/${species}/${parseInt(current_img) + 1}.jpg" class="img-fluid" alt="${species} img ${parseInt(current_img) + 1}">`);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/form_info', (req, resp) => {
    const species = req.params.current_species;
    const goatEntry = data.find(entry => entry.species.includes(species));
    if (goatEntry) {
        resp.send(`<p class="lead fst-italic fs-4 text-end">Viewing <b>${goatEntry["name"].toString()}</b> form`);
    } else {
        resp.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

//app.post('/:species/comment_data', (req, res) => {
//    let comment_data = req.body;
//    let username_data = req.body;
 //   });

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});