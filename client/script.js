document.getElementById('kiko_goat').addEventListener('click', fetchData_kiko);
document.getElementById('pygora_goat').addEventListener('click', fetchData_pygora);
document.getElementById('angora_goat').addEventListener('click', fetchData_angora);
document.getElementById('pygmy_goat').addEventListener('click', fetchData_pygmy);


let species = ""

function fetchData_pygora() {
    species = 'pygora_goat';
    updatePage();
}

function fetchData_kiko() {
    species = 'kiko_goat';
    updatePage();
}

function fetchData_angora() {
    species = 'angora_goat';
    updatePage();
}

function fetchData_pygmy() {
    species = 'pygmy_goat';
    updatePage();
}

function updatePage() {
    fetch(`http://127.0.0.1:8080/${species}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('display_center').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
fetch(`http://127.0.0.1:8080/goat_name/${species}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('display_center').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}