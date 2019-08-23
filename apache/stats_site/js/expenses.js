var request = new XMLHttpRequest();
request.open('GET', 'php/expenses.php', true);
request.onload = function () {
	if (this.status >= 200 && this.status < 400) {
		var jsonData = JSON.parse(this.response);	
		const chart = new frappe.Chart('#expenses-pie', {
			title: 'Expenses',
			data: jsonData,
			type: 'pie',
			height: (screen.height / 2.5)
		});
	} else {
		console.log('Error getting expense data');
	}
};
request.onerror = function() {
	console.log('Error getting expense data');
};
request.send();
