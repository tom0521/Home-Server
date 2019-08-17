$.getJSON('php/expenses.php', function(jsonData){
	const chart = new frappe.Chart("#expenses-pie", {
		title: "Expenses",
		data: jsonData,
		type: 'pie'
	});
});
