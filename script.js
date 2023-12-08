document.getElementById('getDataButton').addEventListener('click', fetchData);

function fetchData() {
    console.log("IS MY GAY ASS WORKING?");
    fetch('/getData') 
        .then(response => response.text())  
        .then(data => {
            document.getElementById('result').innerHTML = data;
            console.log("IS MY GAY ASS WORKING 2?");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}