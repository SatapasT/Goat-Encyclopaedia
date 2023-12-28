document.getElementById('pygora_goat').addEventListener('click', fetchData_pygora);


function fetchData_pygora() {
    console.log("GOATS?");
    fetch('http://127.0.0.1:8080/pygora') 
        .then(response => response.text())  
        .then(data => {
            document.getElementById('result').innerHTML = data;
            console.log("GOATS?");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    console.log("GOATS?");
    fetch('http://127.0.0.1:8080/pygora/name') 
        .then(response => response.text())  
        .then(data => {
            document.getElementById('display_center').innerHTML = data;
            console.log("GOATS?");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}