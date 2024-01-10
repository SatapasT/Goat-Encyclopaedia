document.getElementById('navbar_icon').addEventListener('click', fetch_data_defult);
document.getElementById('kiko_goat').addEventListener('click', fetch_data_kiko);
document.getElementById('pygora_goat').addEventListener('click', fetch_data_pygora);
document.getElementById('angora_goat').addEventListener('click', fetch_data_angora);
document.getElementById('pygmy_goat').addEventListener('click', fetch_data_pygmy);

document.getElementById('form_select').addEventListener('change', form_selected);

document.getElementById('img_left').addEventListener('click', change_img_left);
document.getElementById('img_right').addEventListener('click', change_img_right);

let species = ""
let form_selection = "biology"
let current_img = 0

function fetch_data_defult() {
    species = 'defult_goat';
    current_img = 1;
    update_page();
    update_img();
    form_selected();
}

function fetch_data_kiko() {
    species = 'kiko_goat';
    current_img = 1;
    update_page();
    update_img();
    form_selected();
}

function fetch_data_pygora() {
    species = 'pygora_goat';
    current_img = 1;
    update_page();
    update_img();
    form_selected();
}

function fetch_data_angora() {
    species = 'angora_goat';
    current_img = 1;
    update_page();
    update_img();
    form_selected();
}

function fetch_data_pygmy() {
    species = 'pygmy_goat';
    current_img = 1;
    update_page();
    update_img();
    form_selected();
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
    fetch(`http://127.0.0.1:8080/${species}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('display_center').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        fetch(`http://127.0.0.1:8080/${species}/${form_selection}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('information_div').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function update_img() {
    fetch(`http://127.0.0.1:8080/${species}/image/${current_img}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('img_div').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}