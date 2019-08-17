$.getJSON('php/cash-flow.php', function(jsonData) {
	const chart = new frappe.Chart("#cash-flow", {
		title: "Cash-Flow",
		data: jsonData,
		type: 'axis-mixed',
		colors: ['green', 'red', 'light-blue'],
		height: (screen.height / 2)
	});
});
