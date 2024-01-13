document.addEventListener('DOMContentLoaded', fetch_data_default);

document.getElementById('navbar_icon').addEventListener('click', fetch_data_default);
document.getElementById('kiko_goat').addEventListener('click', () => fetch_goat_data('kiko_goat'));
document.getElementById('pygora_goat').addEventListener('click', () => fetch_goat_data('pygora_goat'));
document.getElementById('angora_goat').addEventListener('click', () => fetch_goat_data('angora_goat'));
document.getElementById('pygmy_goat').addEventListener('click', () => fetch_goat_data('pygmy_goat'));

document.getElementById('form_select').addEventListener('change', form_selected);

document.getElementById('img_left').addEventListener('click', change_img_left);
document.getElementById('img_right').addEventListener('click', change_img_right);

document.getElementById('comment_submit').addEventListener('click', submit_comment);

const local_host = 'http://127.0.0.1:8080';
let current_species;
let form_selection = "biology";
let current_img = 0;

function fetch_goat_data(species_value) {
    current_species = species_value;
    current_img = 1;
    update_page();
    update_img();
    form_selected();
}

function fetch_data_default() {
    fetch_goat_data('defult_goat');
    let nav_item = document.querySelectorAll('.nav-link');
    for (let i = 0; i < nav_item.length; i++) {
        nav_item[i].classList.remove('active');
    }
}

function form_selected() {
    form_selection = document.getElementById('form_select').value;
    console.log('Form Selection Updated:', form_selection);
    update_page();
}

function change_img_left() {
    current_img = (current_img + 3) % 4;
    console.log(current_img);
    update_img();
}

function change_img_right() {
    current_img = (current_img + 1) % 4;
    console.log(current_img);
    update_img();
}

function format_date(current_date){
    let year = current_date.getFullYear();
    let month = current_date.getMonth() + 1;
    let day = current_date.getDate();
    return `${day}/${month}/${year}`;
}

function format_time(current_date){
    let hour = current_date.getHours();
    let minute = current_date.getMinutes() + 1;
    let second = current_date.getSeconds();
    return `${hour}:${minute}:${second}`;
}

async function update_page() {
    await fetch(`${local_host}/${current_species}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('display_center').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await fetch(`${local_host}/${current_species}/information/${form_selection}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('information_div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    await fetch(`${local_host}/${current_species}/form_info`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment_info_div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function update_img() {
    await fetch(`${local_host}/${current_species}/image/${current_img}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('img_div').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

async function submit_comment() {
    const current_date = new Date();
    let date_data = await format_date(current_date);
    let time_data = await format_time(current_date);
    let comment_data = document.getElementById("comment_input").value;
    let name_data = document.getElementById("name_input").value;
    
    if (comment_data === "") {
        document.getElementById("comment_label").innerHTML = "<strong>You can't submit a empty comment!</strong>";
        return;
    } else {
        document.getElementById("comment_label").innerHTML = "Leave a comment!";
    }
    if (name_data === "") {
        name_data = "Anonymous"
    }
    let data = {
        species: current_species,
        name: name_data,
        comment: comment_data,
        date: date_data,
        time: time_data
    }
    data = JSON.stringify(data)
    console.log(data);
    const response = await fetch(`${local_host}/${current_species}/comment_data`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: data
        });
        console.log(response)
    document.getElementById("comment_input").value = "";
    document.getElementById("name_input").value = "";
}
