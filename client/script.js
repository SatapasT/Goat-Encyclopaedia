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

async function fetchGoatData(speciesValue) {
  currentSpecies = speciesValue;
  currentImg = 1;
  updatePage();
  updateImg();
  formSelected();
}

function fetchDataDefault() {
  fetchGoatData('defult_goat');
  const navItems = document.querySelectorAll('.nav-link');
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove('active');
  }
}

function formSelected() {
  formSelection = document.getElementById('form-select').value;
  console.log('Form Selection Updated:', formSelection);
  updatePage();
}

function changeImgLeft() {
  currentImg = (currentImg + 3) % 4;
  console.log(currentImg);
  updateImg();
}

function changeImgRight() {
  currentImg = (currentImg + 1) % 4;
  console.log(currentImg);
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
  try {
    const response = await fetch(`${localhost}/${currentSpecies}`);
    const data = await response.text();
    document.getElementById('display-center').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  try {
    const response = await fetch(`${localhost}/${currentSpecies}/information/${formSelection}`);
    const data = await response.text();
    document.getElementById('information-div').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  try {
    const response = await fetch(`${localhost}/${currentSpecies}/form_info`);
    const data = await response.text();
    document.getElementById('comment-info-div').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  try {
    const response = await fetch(`${localhost}/${currentSpecies}/comment_thread`);
    const data = await response.text();
    document.getElementById('comment-thread-div').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateImg() {
  try {
    const response = await fetch(`${localhost}/${currentSpecies}/image/${currentImg}`);
    const data = await response.text();
    document.getElementById('img-div').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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

  const data = {
    species: currentSpecies,
    name: nameData,
    comment: commentData,
    date: dateData,
    time: timeData
  };

  const jsonData = JSON.stringify(data);
  console.log(jsonData);

  try {
    const response = await fetch(`${localhost}/${currentSpecies}/comment_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    });
    console.log(response);
    document.getElementById('comment-input').value = '';
    document.getElementById('name-input').value = '';
  } catch (error) {
    console.error('Error posting comment data:', error);
  }

  try {
    const response = await fetch(`${localhost}/${currentSpecies}/comment_thread`);
    const data = await response.text();
    document.getElementById('comment-thread-div').innerHTML = data;
  } catch (error) {
    console.error('Error fetching comment thread data:', error);
  }
}
