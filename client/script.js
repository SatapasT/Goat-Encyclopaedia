document.getElementById('getDataButton').addEventListener('click', fetchData);

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