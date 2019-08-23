var request = new XMLHttpRequest();
request.open('GET', 'php/overall-finances.php', true);
request.onload = function() {
	if (this.status >= 200 && this.status < 400) {
		var jsonData = JSON.parse(this.response);
		document.getElementById('gross-income').innerHTML = `$${numberWithCommas(jsonData.gross_income)}`;
		document.getElementById('expenses').innerHTML = `$${numberWithCommas(jsonData.expenses)}`;
		document.getElementById('net-income').innerHTML = `$${numberWithCommas(jsonData.net_income)}`;
	} else {
		console.log('Error getting overall financial data');
	}
}
request.onerror = function() {
	console.log('Error getting overall financial data');
}
request.send();

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
