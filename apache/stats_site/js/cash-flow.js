var request = new XMLHttpRequest();
request.open('GET', 'php/cash-flow.php', true);
request.onload = function() {
	if (this.status >= 200 & this.status < 400) {
		var jsonData = JSON.parse(this.response);
		const chart = new frappe.Chart('#cash-flow', {
			title: 'Cash-Flow',
			data: jsonData,
			type: 'axis-mixed',
			height: (screen.height / 3)
		});
	} else {
		console.log('Error getting cash-flow data');
	}
}
request.onerror = function() {
	console.log('Error getting cash-flow data');
}
request.send();
