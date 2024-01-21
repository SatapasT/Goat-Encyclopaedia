const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');

// from https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const species = req.params.species;
        const filePath = `client/assets/images/${species}`;
        fs.mkdirSync(filePath, { recursive: true });
        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('client'));
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');
    response.header('Access-Control-Allow-Methods', '*');
    response.header('Access-Control-Allow-Credentials', '*');
    next();
});

app.use(express.json());
const goatDataPath = 'data/goat_data.json';
const threadDataPath = 'data/thread_data.json';
const userDataPath = 'data/user_data.json';
const imageDataPath = 'data/image_data.json';
const itemColourDict = { 0: "bg-light-subtle", 1: "bg-dark-subtle"};

let goatData, threadData, userData, imageData;

try {
    goatData = JSON.parse(fs.readFileSync(goatDataPath));
    threadData = JSON.parse(fs.readFileSync(threadDataPath));
    userData = JSON.parse(fs.readFileSync(userDataPath));
    imageData = JSON.parse(fs.readFileSync(imageDataPath));
} catch (error) {
    console.error('Error loading data files: ', error.message);
}

function validateData(data) {
    if (data) {
        return true;
    } else {
        return false;
    }
}

function upperCase(word) {
    try {
        const firstLetter = word.charAt(0)
        const newWord = firstLetter.toUpperCase() + word.substring(1)
        return newWord

    } catch (error) {
        return word
    }
    
}

app.get('/goatData/:species/title', (request, response) => {
    try {
        const species = request.params.species;
        const goatEntry = goatData.find(entry => entry.species.includes(species));
        if (!validateData(goatEntry)) {
            response.send(`Error fetching data`)
            return;
        }
        response.send(`<strong> > ${goatEntry["name"].toString()} < </strong>`);
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});


app.get('/goatData/:species/form/:value', (request, response) => {
    try {
        const species = request.params.species;
        const queryType = request.params.value;
        const goatEntry = goatData.find(entry => entry.species.includes(species));

        if (!validateData(goatEntry)) {
            response.status(500).send('Internal server error');
            return;
        }

        const stringFind = ["Pros", "Cons"];
        const proConColourDict = { 1: "bg-success-subtle", 2: "bg-danger-subtle"};

        let headerPosition = 0;
        let list = [];
        
        switch (queryType) {

            case 'pro-con':
                for (let i = 0; i < goatEntry[queryType].length; i++) {
                    let entry = goatEntry[queryType][i];
                    if (entry.includes(stringFind[headerPosition])) {
                        headerPosition += 1;
                        list.push(`
                        <div class="col text-start ${proConColourDict[headerPosition]} border border-dark p-3 text-center">
                        <h2> > ${entry} < </h2>
                        </div>
                        `);
                        continue;
                    }
                    list.push(`
                    <div class="col text-start ${proConColourDict[headerPosition]} border border-dark p-2">
                    ${entry}
                    </div>
                    `);
                }
                response.send(list.join(''));
                break;

            case 'biology':
            case 'history':
            case 'faq':
                for (let i = 0; i < goatEntry[queryType].length; i++) {
                    let entry = goatEntry[queryType][i];
                    list.push(`
                    <div class="col text-start fs-6 ${itemColourDict[i % 2]} border border-dark p-2">
                    ${entry}
                    </div>
                    `);
                }
                response.send(list.join(''));
                break;
            }
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.get('/goatData/:species/image', (request, response) => {
    try {
        const species = request.params.species;
        const goatImg = imageData.find(entry => entry.species.includes(species));

        if (!validateData(goatImg)) {
            response.status(500).send('Internal server error');
            return;
        }

        let list = [];

        list.push(`
            <div id="carouselExampleCaptions" class="carousel slide">
            <div class="carousel-indicators">
                `);

            for (let i = 0; i < goatImg["image"].length; i++) {
                let activeClass = i;
                if (i === 0) {
                    activeClass = ` class="active" aria-current="true"`
                } else {
                    activeClass = ``
                }
                list.push(`
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}"${activeClass} aria-label="Uploaded by ${goatImg.uploader[i]}">
                </button>
                `);
            }

            list.push(`
                </div>
                <div class="carousel-inner">
                `);

        
            for (let i = 0; i < goatImg["image"].length; i++) {
                let activeClass = i;
                if (i === 0) {
                    activeClass = ` active`
                } else {
                    activeClass = ``
                }
                list.push(`
                <div class="carousel-item${activeClass}">
                <img id="carousel-img" class="p-2" src="assets/images/${species}/${goatImg.image[i]}.jpg" class="d-block w-100" alt="${species} image ${goatImg.image[i]}">
                    <div class="carousel-caption d-none d-md-block text-dark">
                        <h5><strong class="carousel-text glow">${upperCase(goatImg.image[i])}</strong></h5>
                        <p><strong class="carousel-text glow">Uploaded by ${goatImg.uploader[i]}</strong></p>        
                    </div>
                </div>
                `);
            }

            list.push(`
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
            </div>
            `);
            response.send(list.join(''));
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.get('/goatData/:species/formInfo', (request, response) => {
    try {
        const species = request.params.species;
        const goatEntry = goatData.find(entry => entry.species.includes(species));

        if (!validateData(goatEntry)) {
            response.status(500).send('Internal server error');
            return;
        }

        response.send(`<p class="lead fst-italic fs-4 text-end">Viewing <b>${goatEntry["name"].toString()}</b> form</p>`);
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.get('/goatData/:species/commentThread', (request, response) => {
    try {
        const species = request.params.species;
        const commentEntry = threadData.filter(entry => entry.species.includes(species));

        if (!validateData(commentEntry)) {
            response.status(500).send('Internal server error');
            return;
        }

        let list = [];
        if (commentEntry.length === 0) {
            list.push(`
            <div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[0]}">
            <div class="col">
            <div class="text-center"><strong>No one commented yet, be the first to do so!</div>
            </div>
            </div>
            `);
            
        } else {
            for (let i = 0; i < commentEntry.length; i++) {
                list.push(`
                <div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[i % 2]}">
                <div class="col-4 border-end border-dark p-3">
                <div class="text-center" id="date_time_${i}">${commentEntry[i]["date"]} at ${commentEntry[i]["time"]}</div>
                <div class="text-center p-1" id="name_${i}">From : ${commentEntry[i]["name"]}</div>
                <button type="button" class="btn btn-success" onclick="likeComment('${commentEntry[i]["name"]}', '${commentEntry[i]["date"]}','${commentEntry[i]["time"]}')">Like</button>
                <div class="text-center p-1" id="likes_${i}">Likes : ${commentEntry[i]["like"]}</div>
                <div id="${commentEntry[i]["name"]}-${commentEntry[i]["date"]}-${commentEntry[i]["time"]}"></div>
                </div>
                <div class="col-8 d-flex align-items-center justify-content-center">
                <div class="text-center scroll-item">${commentEntry[i]["comment"]}</div>
                </div>
                </div>
                `);
            }
        }
        response.send(list.join(''));
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.post('/post/commentData', (request, response) => {
    try{
        let commentData = request.body;
        threadData.push(commentData);
        fs.writeFileSync(threadDataPath, JSON.stringify(threadData));
        response.send("Successfully posted the data");
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.post('/post/signupData', (request, response) => {
    try{
        const data =  request.body;
        const nameEntry = userData.find(entry => entry.username === data.username);
            if (nameEntry) {
                response.send("usernameTaken");
                return
            }
            userData.push(data);
            fs.writeFileSync(userDataPath, JSON.stringify(userData));
            response.send(`Successfully posted the data`);
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

app.post('/post/loginStatus', (request, response) => {
    try{
        const data =  request.body;
        const usernameEntry = data.username
        const passwordEntry = data.password
        const usernameMatching = userData.find(entry => entry.username === usernameEntry);
        if (usernameMatching["password"] === passwordEntry) {
            response.send(usernameEntry);
        } else {
            response.send("invalidLogin");
        }
    } catch (error) {
        response.status(500).send('Internal server error');
        console.error(error.message);
    }
});

// From https://www.npmjs.com/package/multer

app.post('/post/:species/uploadPhoto', upload.single('photo'), function (request, response) {
    try {
        if (!request.file) {
            return response.status(400).send('No file uploaded.');
        }
        response.send('success');
    } catch (error) {
        console.error(error);
        response.status(500).send(`Internal server error: ${error.message}`);
    }
});

app.post('/post/:species/photoData', upload.single('photo'), function (request, response) {
    try {
        const species = request.params.species;
        const fileName = request.body.image;
        const usernameData =  request.body.uploader;
    
        const goatImg = imageData.find(entry => entry.species.includes(species));

        goatImg.image.push(fileName);
        goatImg.uploader.push(usernameData);
        
        fs.writeFileSync(imageDataPath, JSON.stringify(imageData));
        response.send(`Successfully posted the data`);
        
    } catch (error) {
        console.error(error);
        response.status(500).send(`Internal server error: ${error.message}`);
    }
});

app.post('/post/like', (request, response) => {
    try {
        const data = request.body;
        const name = data.name;
        const date = data.date;
        const time = data.time;
        const currentUser = data.currentUser;
        const likeEntryName = threadData.filter(entry => entry.name.includes(name));


        if (!(likeEntryName)){
            response.send("error")
            return
        }

        const likeEntryDate = threadData.filter(entry => entry.date.includes(date));
        if (!(likeEntryDate)){
            response.send("error")
            return
        }

        const likeEntry = threadData.filter(entry => entry.time.includes(time));
        if (!(likeEntry)){
            response.send("error")
            return
        }

        const matchingEntry = likeEntry[0]
        const likeBy = matchingEntry.likeBy;
        for (let i = 0; i < likeBy.length; i++) {
            if (likeBy[i] === currentUser) {
                response.send("alreadyLiked")
                return
            }
        }

        let index = threadData.findIndex(entry => entry.name === name && entry.date === date && entry.time === time);
        matchingEntry.likeBy.push(currentUser);
        matchingEntry.like = likeEntry[0].likeBy.length;
        threadData[index] = matchingEntry;
        
        fs.writeFileSync(threadDataPath, JSON.stringify(threadData));
        response.send("success") 

    } catch (error) {
        console.error(error);
        response.status(500).send(`Internal server error: ${error.message}`);
    }
});

const server = app.listen(8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});
