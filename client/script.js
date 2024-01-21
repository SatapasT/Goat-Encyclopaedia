const localhost = 'http://127.0.0.1:8080';
let currentSpecies;
let formSelection;
let currentUser = "Anonymous";

function initializeHTML() {
    document.getElementById('login-button').style.display = 'block';
    fetchDataDefault()
    
}
function hideModal(id){
    let modalElement = document.getElementById(id);
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop').remove();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
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

function fetchGoatData(speciesValue) {
    currentSpecies = speciesValue;
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
    updatePage();
}

function updatePage() {
    updateTitle()
    updateInformation()
    updateCommentInfo()
    updateCommentThread()
    updateImg()
    updateNameDisplay()
}

async function updateTitle() {
    await fetch(`${localhost}/goatData/${currentSpecies}/title`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('display-center').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

async function updateInformation() {
    await fetch(`${localhost}/goatData/${currentSpecies}/form/${formSelection}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('information-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function updateCommentInfo() {
    await fetch(`${localhost}/goatData/${currentSpecies}/formInfo`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment-info-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function updateCommentThread() {
    await fetch(`${localhost}/goatData/${currentSpecies}/commentThread`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment-thread-div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function updateImg() {
    await fetch(`${localhost}/goatData/${currentSpecies}/image`)
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

    if (commentData === '') {
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('comment-alert-div').innerHTML = `<div class="alert alert-danger" role="alert">You can't leave a empty comment!</div>`;
        return;
    } else {
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('comment-alert-div').innerHTML = '';
    }

    let data = {
        species: currentSpecies,
        name: currentUser,
        comment: commentData,
        date: dateData,
        time: timeData
    };

    data = JSON.stringify(data);
    const response = await fetch(`${localhost}/post/commentData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
    document.getElementById('comment-input').value = '';
    updateCommentThread()
}

async function signUpUser(){
    const passwordData = document.getElementById('password-signup').value;
    const usernameData = document.getElementById('username-signup').value;

    if (usernameData === ""){
        document.getElementById('modal-signup-alert').innerHTML = `<div class="alert alert-danger" role="alert">You Can't Have A Empty Username!</div>`;
        return;
    } else {
        document.getElementById('modal-signup-alert').innerHTML = ``;
    }

    if (passwordData === ""){
        document.getElementById('modal-signup-alert').innerHTML = `<div class="alert alert-danger" role="alert">You Can't Have A Empty Password!</div>`;
        return;
    } else {
        document.getElementById('modal-signup-alert').innerHTML = ``;
    }

    

    let data = {
        username: usernameData,
        password: passwordData,
    }
    data = JSON.stringify(data);

    const response = await fetch(`${localhost}/post/signupData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    const responseText = await response.text();
    if (responseText === "usernameTaken") {
        document.getElementById('modal-signup-alert').innerHTML = `<div class="alert alert-danger" role="alert">That Username Is Already Taken!</div>`;
        return;
    }
    document.getElementById('username-signup').value = '';
    document.getElementById('password-signup').value = '';
    hideModal('signup-modal')
}


function userLogout(){
    currentUser = "Anonymous"
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('logout-button').style.display = 'none';
    updateNameDisplay()
}

async function userLogin(){
    const usernameData = document.getElementById('username-login').value;
    const passwordData = document.getElementById('password-login').value;

    if (usernameData === ""){
        document.getElementById('modal-login-alert').innerHTML = `<div class="alert alert-danger" role="alert">You Can't Have A Empty Username!</div>`;
        return;
    } else {
        document.getElementById('modal-login-alert').innerHTML = ``;
    }

    if (passwordData === ""){
        document.getElementById('modal-login-alert').innerHTML = `<div class="alert alert-danger" role="alert">You Can't Have A Empty Password!</div>`;
        return;
    } else {
        document.getElementById('modal-login-alert').innerHTML = ``;
    }
    
    let data = {
        username : usernameData,
        password : passwordData
    };
    data = JSON.stringify(data);

    const response = await fetch(`${localhost}/post/loginStatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    
    const responseText = await response.text();
    if (responseText === "invalidLogin") {
        document.getElementById('modal-login-alert').innerHTML = `<div class="alert alert-danger" role="alert">Login Does Not To Any In The Database!</div>`;
        return;
    }
    
    currentUser = responseText;
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'block';
    hideModal('login-modal')
    updateNameDisplay()
}

function updateNameDisplay() {
    document.getElementById('name-div').innerHTML = currentUser;
}

async function uploadPhoto() {
    const photoUpload = document.getElementById('photo-input');

    if (document.getElementById('photo-input').value === '') {
        document.getElementById('upload-alert-div').innerHTML = `<div class="alert alert-danger" role="alert">No Photo Selected!</div>`;
        return
    } else {
        document.getElementById('upload-alert-div').innerHTML = ``;
    }

    if (currentUser === "Anonymous") {
        document.getElementById('upload-alert-div').innerHTML = `<div class="alert alert-danger" role="alert">You Must Be Login To Upload A Image!</div>`;
        return
    }
    
    const data = new FormData();
    data.append('photo', photoUpload.files[0]);
    let fileName = photoUpload.files[0].name;
    fileName = fileName.substring(0, fileName.length-4);

    const response = await fetch(`${localhost}/post/${currentSpecies}/uploadPhoto`, {
        method: 'POST',
        body: data
    });

    let data2 = {
        species : currentSpecies,
        image : fileName,
        uploader : currentUser
    }
    data2 = JSON.stringify(data2);

    const response2 = await fetch(`${localhost}/post/${currentSpecies}/photoData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data2
    });

    document.getElementById('photo-input').value = '';
    updateImg();
}

async function likeComment(name, date, time) {
    try {
        if (currentUser === "Anonymous") {
            document.getElementById(`${name}-${date}-${time}`).innerHTML = `<div class="alert alert-danger" role="alert">Login to Like!</div>`;
            return
        } else {
            document.getElementById(`${name}-${date}-${time}`).innerHTML = ``;
        }
        let data = {
            name : name,
            date : date,
            time : time,
            currentUser : currentUser,
        }

        data = JSON.stringify(data);

        const response = await fetch(`${localhost}/post/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        const responseText = await response.text();

        if (responseText === "error") {
            document.getElementById(`${name}-${date}-${time}`).innerHTML = `<div class="alert alert-danger" role="alert">Error Fetching Data!</div>`;
        } else if (responseText === "alreadyLiked") {
            document.getElementById(`${name}-${date}-${time}`).innerHTML = `<div class="alert alert-danger" role="alert">You Already Liked!</div>`;
        } else {
            document.getElementById(`${name}-${date}-${time}`).innerHTML = ``;
            updateCommentThread()
        }
        
    
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeHTML);
document.getElementById('navbar-icon').addEventListener('click', fetchDataDefault);
document.getElementById('kiko-goat').addEventListener('click', () => fetchGoatData('kiko_goat'));
document.getElementById('pygora-goat').addEventListener('click', () => fetchGoatData('pygora_goat'));
document.getElementById('angora-goat').addEventListener('click', () => fetchGoatData('angora_goat'));
document.getElementById('pygmy-goat').addEventListener('click', () => fetchGoatData('pygmy_goat'));
document.getElementById('form-select').addEventListener('change', formSelected);
document.getElementById('comment-submit').addEventListener('click', submitComment);
document.getElementById('modal-signup-button').addEventListener('click', signUpUser);
document.getElementById('logout-button').addEventListener('click', userLogout);
document.getElementById('modal-login-button').addEventListener('click', userLogin);
document.getElementById('upload-button').addEventListener('click', uploadPhoto);