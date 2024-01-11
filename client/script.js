document.addEventListener('DOMContentLoaded', fetch_data_default);

document.getElementById('navbar_icon').addEventListener('click', fetch_data_default);
document.getElementById('kiko_goat').addEventListener('click', () => fetch_goat_data('kiko_goat'));
document.getElementById('pygora_goat').addEventListener('click', () => fetch_goat_data('pygora_goat'));
document.getElementById('angora_goat').addEventListener('click', () => fetch_goat_data('angora_goat'));
document.getElementById('pygmy_goat').addEventListener('click', () => fetch_goat_data('pygmy_goat'));

document.getElementById('form_select').addEventListener('change', form_selected);

document.getElementById('img_left').addEventListener('click', change_img_left);
document.getElementById('img_right').addEventListener('click', change_img_right);

const local_host = 'http://127.0.0.1:8080';
let species = ""
let form_selection = "biology"
let current_img = 0

function fetch_goat_data(species_value) {
    species = species_value;
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

function update_page() {
    fetch(`${local_host}/${species}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('display_center').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        fetch(`${local_host}/${species}/information/${form_selection}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('information_div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        fetch(`${local_host}/${species}/comment`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('comment_info_div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function update_img() {
    fetch(`${local_host}/${species}/image/${current_img}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('img_div').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}