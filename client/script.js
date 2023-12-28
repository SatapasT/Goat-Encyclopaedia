document.getElementById('getDataButton').addEventListener('click', fetchData);
document.getElementById('pygora_goat').addEventListener('click', fetchData_pygora);


function fetchData() {
    console.log("IS MY GAY ASS WORKING?");
    fetch('http://127.0.0.1:8080/list') 
        .then(response => response.text())  
        .then(data => {
            document.getElementById('result').innerHTML = data;
            console.log("IS MY GAY ASS WORKING 2?");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

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
}