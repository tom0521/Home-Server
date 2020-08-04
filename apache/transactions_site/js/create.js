/**
 * 1. Query locations and create location if does not already exist
 * 2. Create Transaction
 * 3. Reset form
 */
function submitForm() {
    // Parse the location form
    var locationData = new FormData(document.getElementById('location_form'));
    var locationJSON = {};
    locationData.forEach((value, key) => {locationJSON[key] = (value === "") ? null : value});
    // Parse the transaction form
    var transactionData = new FormData(document.getElementById('transaction_form'));
    var transactionJSON = {};
    transactionData.forEach((value, key) => {transactionJSON[key] = (value === "") ? null : value});

    var request = new XMLHttpRequest();
    request.open("GET", "http://192.168.1.101:81/location/read.php");
    request.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE) {
            var responseJSON = JSON.parse(request.response);
            var location = responseJSON['data'].find(function (entry) {
                return entry['address'].toUpperCase() === locationJSON['address'].toUpperCase();
            });
            if (location === undefined) {
                createLocationAndTransaction(locationJSON, transactionJSON);
            } else {
                transactionJSON['location_id'] = location['id'];
                createTransaction(transactionJSON);
            }
        }
    }
    request.send();
}

function createLocationAndTransaction(locationJSON, transactionJSON){
    var request = new XMLHttpRequest();
    request.open("POST", "http://192.168.1.101:81/location/create.php?Content-Type=application/json");
    request.onreadystatechange = function(){
        if(this.readyState === XMLHttpRequest.DONE) {
            transactionJSON['location_id'] = JSON.parse(request.response)['id'];
            createTransaction(transactionJSON);
        }
    }
    request.send(JSON.stringify(locationJSON));
}

function createTransaction(transactionJSON){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
            console.log(this.response);
        }
    }
    request.open("POST", "http://192.168.1.101:81/transaction/create.php?Content-Type=application/json");
    request.send(JSON.stringify(transactionJSON));
}