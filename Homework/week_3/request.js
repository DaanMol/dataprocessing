// Daan Molleman

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        console.log(JSON.parse(txtFile.responseText));
    }
}
txtFile.open("GET", fileName);
txtFile.send();
