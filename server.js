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
const goat_data_path = 'data/goat_data.json';
const goat_data = JSON.parse(fs.readFileSync(goat_data_path));
const thread_data_path = 'data/thread_data.json';
const thread_data = JSON.parse(fs.readFileSync(thread_data_path));

const item_colour_dict = {0:"bg-light-subtle", 1:"bg-dark-subtle"};
const pro_con_colour_dict = {1:"bg-success-subtle", 2:"bg-danger-subtle"};

app.get('/:current_species', (request, response) => {
    const species = request.params.current_species;
    const goatEntry = goat_data.find(entry => entry.species.includes(species));
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
    const goat_entry = goat_data.find(entry => entry.species.includes(species));
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
    const goat_entry = goat_data.find(entry => entry.species.includes(species));
    if (goat_entry) { 
        response.send(`<img src="assets/images/${species}/${parseInt(current_img) + 1}.jpg" class="img-fluid" alt="${species} img ${parseInt(current_img) + 1}">`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:current_species/form_info', (request, response) => {
    const species = request.params.current_species;
    const goat_entry = goat_data.find(entry => entry.species.includes(species));
    if (goat_entry) {
        response.send(`<p class="lead fst-italic fs-4 text-end">Viewing <b>${goat_entry["name"].toString()}</b> form</p>`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.post('/:species/comment_data', (request, response) => {
    let comment_data = request.body;
    console.log(comment_data);
    response.send("Successfully posted");
    thread_data.push(comment_data)
    fs.writeFileSync(thread_data_path, JSON.stringify(thread_data));
    response.send()
});

app.get('/:current_species/comment_thread', (request, response) => {
    const species = request.params.current_species;
    const comment_entry = thread_data.filter(entry => entry.species.includes(species));
    console.log(comment_entry);
    if (comment_entry.length === 0) {
        response.send(`<div class="row"><div class="col ${pro_con_colour_dict[1]} fs-4"><strong>No one commented yet, be the first to do so!</strong></div></div>`);
    } else if (comment_entry){
        let list = []
        console.log("hello", comment_entry.length);
        for (let i = 0; i < comment_entry.length; i++) {
            list.push(`<div class="row">`)
            list.push(`<div class="col-2">`)
            list.push(`<label for="comment_${i}" class="form-label">${comment_entry[i]["date"]} at ${comment_entry[i]["time"]}</label>`);
            list.push(`<div id="comment_${i}">${comment_entry[i]["name"]}</div>`);
            list.push(`</div>`)
            list.push(`<div class="col-8">`)
            list.push(`${comment_entry[i]["comment"]}`);
            list.push(`</div>`)
            list.push(`</div>`)
        }
        console.log(list.join(''));
        response.send(list.join(''));
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});


const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});