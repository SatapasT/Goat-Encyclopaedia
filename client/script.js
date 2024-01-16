document.addEventListener('DOMContentLoaded', fetchDataDefault);

document.getElementById('navbar-icon').addEventListener('click', fetchDataDefault);
document.getElementById('kiko-goat').addEventListener('click', () => fetchGoatData('kiko_goat'));
document.getElementById('pygora-goat').addEventListener('click', () => fetchGoatData('pygora_goat'));
document.getElementById('angora-goat').addEventListener('click', () => fetchGoatData('angora_goat'));
document.getElementById('pygmy-goat').addEventListener('click', () => fetchGoatData('pygmy_goat'));

document.getElementById('form-select').addEventListener('change', formSelected);

document.getElementById('img-left').addEventListener('click', changeImgLeft);
document.getElementById('img-right').addEventListener('click', changeImgRight);

document.getElementById('comment-submit').addEventListener('click', submitComment);

const localhost = 'http://127.0.0.1:8080';
let currentSpecies;
let formSelection = 'biology';
let currentImg;
let user;

function fetchGoatData(speciesValue) {
    currentSpecies = speciesValue;
    currentImg = 1;
    updatePage();
    updateImg();
    formSelected();
}

function fetchDataDefault() {
    fetchGoatData('default_goat');
    const navItem = document.querySelectorAll('.nav-link');
    for (let i = 0; i < navItem.length; i++) {
        navItem[i].classList.remove('active');
    }
}

function formSelected() {
    formSelection = document.getElementById('form-select').value;
    console.log(`Form Selection Updated: %{formSelection}`);
    updatePage();
}

function changeImgLeft() {
    currentImg = (currentImg + 3) % 4;
    console.log(`Image Selection Updated: ${currentImg}`);
    updateImg();
}

function changeImgRight() {
    currentImg = (currentImg + 1) % 4;
    console.log(`Image Selection Updated: ${currentImg}`);
    updateImg();
}

function formatDate(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day}/${month}/${year}`;
}

function formatTime(currentDate) {
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes() + 1;
    const second = currentDate.getSeconds();
    return `${hour}:${minute}:${second}`;
}

async function updatePage() {
    await fetch(`${localhost}/${currentSpecies}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('display-center').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await fetch(`${localhost}/${currentSpecies}/information/${formSelection}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('information-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await fetch(`${localhost}/${currentSpecies}/formInfo`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment-info-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await fetch(`${localhost}/${currentSpecies}/commentThread`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment-thread-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    
    await fetch(`${localhost}/loginStatus/${user}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('login-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function updateImg() {
    await fetch(`${localhost}/${currentSpecies}/image/${currentImg}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('img-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function submitComment() {
    const currentDate = new Date();
    const dateData = await formatDate(currentDate);
    const timeData = await formatTime(currentDate);
    const commentData = document.getElementById('comment-input').value;
    let nameData = document.getElementById('name-input').value;

    if (commentData === '') {
        document.getElementById('comment-warning-div').innerHTML = "<strong>You Can't Submit An Empty Comment!</strong>";
        return;
    } else {
        document.getElementById('comment-warning-div').innerHTML = '';
    }
    if (nameData === '') {
        nameData = 'Anonymous';
    } else if (nameData.length > 10) {
        document.getElementById('comment-warning-div').innerHTML = '<strong>10 Character Limit For Username</strong>';
        return;
    } else {
        document.getElementById('comment-warning-div').innerHTML = '';
    }

    let data = {
        species: currentSpecies,
        name: nameData,
        comment: commentData,
        date: dateData,
        time: timeData
    };

    data = JSON.stringify(data);
    console.log(data);
    const response = await fetch(`${localhost}/${currentSpecies}/commentData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
    console.log(response);
    document.getElementById('comment-input').value = '';
    document.getElementById('name-input').value = '';
    await fetch(`${localhost}/${currentSpecies}/commentThread`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment-thread-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}