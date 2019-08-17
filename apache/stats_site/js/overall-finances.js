$.getJSON('php/overall-finances.php', function(jsonData) {
	document.getElementById('gross-income').innerHTML = `$${numberWithCommas(jsonData.gross_income)}`;
	document.getElementById('expenses').innerHTML = `$${numberWithCommas(jsonData.expenses)}`;
	document.getElementById('net-income').innerHTML = `$${numberWithCommas(jsonData.net_income)}`;
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
