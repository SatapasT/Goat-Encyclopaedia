const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// from https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const species = req.query.species;
    const filePath = path.join('client', 'assets', 'images', species);
    fs.mkdirSync(filePath, { recursive: true });
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const newFilename = file.originalname;
    cb(null, newFilename);
  }
});

const upload = multer({ storage });

app.use(express.static('client'));
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');
  response.header('Access-Control-Allow-Methods', '*');
  response.header('Access-Control-Allow-Credentials', '*');
  next();
});

app.use(express.json());
const goatDataPath = path.join('data', 'goat_data.json');
const threadDataPath = path.join('data', 'thread_data.json');
const userDataPath = path.join('data', 'user_data.json');
const imageDataPath = path.join('data', 'image_data.json');

let goatData, threadData, userData, imageData;

try {
  goatData = JSON.parse(fs.readFileSync(goatDataPath));
  threadData = JSON.parse(fs.readFileSync(threadDataPath));
  userData = JSON.parse(fs.readFileSync(userDataPath));
  imageData = JSON.parse(fs.readFileSync(imageDataPath));
} catch (error) {
  console.error('Error loading data files: ', error.message);
}

function validateData (data) {
  if (data) {
    return true;
  } else {
    return false;
  }
}

app.get('/goatData', (request, response) => {
  try {
    const species = request.query.species;
    const goatEntry = goatData.find((entry) => entry.species.includes(species));
    if (!validateData(goatEntry)) {
      response.send('Error fetching data');
      return;
    }
    response.send(goatEntry);
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

app.get('/imageData', (request, response) => {
  try {
    const species = request.query.species;
    const goatImg = imageData.find((entry) => entry.species.includes(species));

    if (!validateData(goatImg)) {
      response.send('Error fetching data');
      return;
    }
    response.send(goatImg);
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

app.get('/commentData', (request, response) => {
  try {
    const species = request.query.species;
    const ordering = request.query.ordering;
    const commentEntry = threadData.filter((entry) =>
      entry.species.includes(species)
    );

    if (!validateData(commentEntry)) {
      response.status(500).send('Internal server error');
      return;
    }

    if (ordering === 'ascending') {
      commentEntry.sort((a, b) => a.like - b.like);
    } else if (ordering === 'descending') {
      commentEntry.sort((a, b) => b.like - a.like);
    } else if (ordering === 'timeNewest') {
      commentEntry.reverse();
    }

    response.send(commentEntry);
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

app.post('/post/commentData', (request, response) => {
  try {
    const commentData = request.body;
    threadData.push(commentData);
    fs.writeFileSync(threadDataPath, JSON.stringify(threadData));
    response.send('success');
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

app.post('/post/signupData', (request, response) => {
  try {
    const data = request.body;
    const nameEntry = userData.find(
      (entry) => entry.username === data.username
    );
    if (nameEntry) {
      response.send('usernameTaken');
      return;
    }
    userData.push(data);
    fs.writeFileSync(userDataPath, JSON.stringify(userData));
    response.send('Successfully posted the data');
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

app.post('/post/loginStatus', (request, response) => {
  try {
    const data = request.body;
    const usernameEntry = data.username;
    const passwordEntry = data.password;
    const usernameMatching = userData.find(
      (entry) => entry.username === usernameEntry
    );
    if (!usernameMatching) {
      response.send('invalidLogin');
      return;
    }
    if (usernameMatching.password === passwordEntry) {
      response.send(usernameEntry);
    } else {
      response.send('invalidLogin');
    }
  } catch (error) {
    response.status(500).send('Internal server error');
    console.error(error.message);
  }
});

// From https://www.npmjs.com/package/multer

app.post('/post/uploadImage', upload.single('photo'), function (request, response) {
    try {
      if (!request.file) {
        return response.status(400).send('No file uploaded.');
      }
      response.send('success');
    } catch (error) {
      console.error(error);
      response.status(500).send(`Internal server error: ${error.message}`);
    }
  }
);

app.post('/post/imageData',
  upload.single('photo'),
  function (request, response) {
    try {
      const species = request.query.species;
      const fileName = request.body.image;
      const usernameData = request.body.uploader;

      const goatImg = imageData.find((entry) =>
        entry.species.includes(species)
      );

      goatImg.image.push(fileName);
      goatImg.uploader.push(usernameData);

      fs.writeFileSync(imageDataPath, JSON.stringify(imageData));
      response.send('success');
    } catch (error) {
      console.error(error);
      response.status(500).send(`Internal server error: ${error.message}`);
    }
  }
);

app.post('/post/like', (request, response) => {
  try {
    const data = request.body;
    const name = data.name;
    const date = data.date;
    const time = data.time;
    const currentUser = data.currentUser;
    const likeEntryName = threadData.filter((entry) =>
      entry.name.includes(name)
    );

    if (!likeEntryName) {
      response.send('error');
      return;
    }

    const likeEntryDate = threadData.filter((entry) =>
      entry.date.includes(date)
    );
    if (!likeEntryDate) {
      response.send('error');
      return;
    }

    const likeEntry = threadData.filter((entry) => entry.time.includes(time));
    if (!likeEntry) {
      response.send('error');
      return;
    }

    const matchingEntry = likeEntry[0];
    const likeBy = matchingEntry.likeBy;
    for (let i = 0; i < likeBy.length; i++) {
      if (likeBy[i] === currentUser) {
        response.send('alreadyLiked');
        return;
      }
    }

    const index = threadData.findIndex(
      (entry) =>
        entry.name === name && entry.date === date && entry.time === time
    );
    matchingEntry.likeBy.push(currentUser);
    matchingEntry.like = likeEntry[0].likeBy.length;
    threadData[index] = matchingEntry;

    fs.writeFileSync(threadDataPath, JSON.stringify(threadData));
    response.send('success');
  } catch (error) {
    console.error(error);
    response.status(500).send(`Internal server error: ${error.message}`);
  }
});

module.exports = app;
