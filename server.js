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
const goatDataPath = 'data/goat_data.json';
const threadDataPath = 'data/thread_data.json';
const userDataPath = 'data/user_data.json';
const imageDataPath = 'data/image_data.json';
const goatData = JSON.parse(fs.readFileSync(goatDataPath));
const threadData = JSON.parse(fs.readFileSync(threadDataPath));
const userData = JSON.parse(fs.readFileSync(userDataPath));
const imageData = JSON.parse(fs.readFileSync(imageDataPath));



const itemColourDict = { 0: "bg-light-subtle", 1: "bg-dark-subtle" };
const proConColourDict = { 1: "bg-success-subtle", 2: "bg-danger-subtle" };

app.get('/:currentSpecies', (request, response) => {
    const species = request.params.currentSpecies;
    const goatEntry = goatData.find(entry => entry.species.includes(species));
    if (goatEntry) {
        response.send(`<strong> > ${goatEntry["name"].toString()} < </strong>`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:currentSpecies/information/:value', (request, response) => {
    const species = request.params.currentSpecies;
    const formValue = request.params.value;
    const goatEntry = goatData.find(entry => entry.species.includes(species));
    if (goatEntry && formValue == "pro_con") {
        const stringFind = ["Pros", "Cons"];
        let list = [];
        let headerPosition = 0;
        for (let i = 0; i < goatEntry[formValue].length; i++) {
            let entry = goatEntry[formValue][i];
            if (entry.includes(stringFind[headerPosition])) {
                headerPosition += 1;
                list.push(`<div class="row"><div class="col text-start ${proConColourDict[headerPosition]} border-bottom"><h2>${entry}</h2></div></div>`);
                continue;
            }
            list.push(`<div class="row"><div class="col text-start ${proConColourDict[headerPosition]}">${entry}</div></div>`);
        }
        response.send(list.join(''));

    } else if (goatEntry) {
        let list = [];
        for (let i = 0; i < goatEntry[formValue].length; i++) {
            let entry = goatEntry[formValue][i];
            list.push(`<div class="row"><div class="col text-start fs-6 ${itemColourDict[i % 2]}">${entry}</div></div>`);
        }
        response.send(list.join(''));

    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/:currentSpecies/image', (request, response) => {
    const species = request.params.currentSpecies;
    const goatEntry = imageData.find(entry => entry.species.includes(species));
    console.log(goatEntry);
    
    if (goatEntry) {
        let list = [];
        list.push(`<div id="carouselItem" class="carousel slide">`);
        list.push(`<div class="carousel-inner">`);

        for (let i = 0; i < goatEntry["image"].length; i++) {
            let activeClass = i === 0 ? ' active' : '';
            list.push(`<div class="carousel-item${activeClass}">`);
            list.push()
            list.push(`<img src="assets/images/${species}/${goatEntry.image[i]}.jpg" class="d-block w-100" alt="${species} image ${goatEntry.image[i]}" />`);
            list.push(`</div>`);
        }

        list.push(`</div>`);
        list.push(`<button class="carousel-control-prev" type="button" data-bs-target="#carouselItem" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselItem" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>`);

        response.send(list.join(''));
    } else {
        console.log(`Loading error for species: ${species}`);
        response.status(404).send(`Loading error, try again`);
    }
});

app.get('/:currentSpecies/formInfo', (request, response) => {
    const species = request.params.currentSpecies;
    const goatEntry = goatData.find(entry => entry.species.includes(species));

    if (goatEntry) {
        response.send(`<p class="lead fst-italic fs-4 text-end">Viewing <b>${goatEntry["name"].toString()}</b> form</p>`);
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.post('/:currentSpecies/commentData', (request, response) => {
    let commentData = request.body;
    console.log(commentData);
    response.send("Successfully posted");
    threadData.push(commentData);
    fs.writeFileSync(threadDataPath, JSON.stringify(threadData));
    response.send();
});

app.get('/:currentSpecies/commentThread', (request, response) => {
    const species = request.params.currentSpecies;
    const commentEntry = threadData.filter(entry => entry.species.includes(species));
    if (commentEntry.length === 0) {
        let list = []
        list.push(`<div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[0]}">`)
        list.push(`<div class="col">`)
        list.push(`<div class="text-center"><strong>No one commented yet, be the first to do so!</div>`);
        list.push(`</div></div>`)
        response.send(list.join(''));
    } else if (commentEntry) {
        let list = []
        for (let i = 0; i < commentEntry.length; i++) {
            list.push(`<div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[i % 2]}">`)
            list.push(`<div class="col-4 border-end border-dark p-3">`)
            list.push(`<label for="name_${i}" class="form-label">${commentEntry[i]["date"]} at ${commentEntry[i]["time"]}</label>`);
            list.push(`<div class="text-center" id="name_${i}">From : ${commentEntry[i]["name"]}</div>`);
            list.push(`</div>`)
            list.push(`<div class="col-8 d-flex align-items-center justify-content-center">`)
            list.push(`<div class="text-center">${commentEntry[i]["comment"]}</div>`);
            list.push(`</div></div>`)
        }
        response.send(list.join(''));
    } else {
        response.status(404).send('Loading error, try again');
        console.log('loading error');
    }
});

app.get('/loginStatus/:user', (request, response) => {
    const username = request.params.user;
    console.log()
    const userEntry = userData.find(entry => entry.username.includes(username));
    if (userEntry) {
        response.send(`<button type="submit" id="login-button" class="btn btn-primary">Login</button>`);
    } else {
        response.send('<button type="submit" id="login-button" class="btn btn-danger">Logout</button>');
        console.log('loading error');
    }
});


const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});
