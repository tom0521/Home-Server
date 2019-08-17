$.getJSON('php/overall-finances.php', function(jsonData) {
	document.getElementById('gross-income').innerHTML = `$${jsonData.gross_income}`;
	document.getElementById('expenses').innerHTML = `$${jsonData.expenses}`;
	document.getElementById('net-income').innerHTML = `$${jsonData.net_income}`;
});
