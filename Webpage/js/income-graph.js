var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
	.range([0, width])
	.padding(0.1);
var y = d3.scaleLinear()
	.range([height, 0]);

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("php/data.php", function(error, data) {
	if (error) throw error;
	data.forEach(function(d) {
		d.amount=+d.amount;
	});
	
	x.domain(data.map(function(d) { return d.month; }));
	y.domain([0, d3.max(data, function(d) { return d.amount; })]);

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.month); })
		.attr("width", x.bandwidth())
		.attr("y", function(d) { return y(d.amount); })
		.attr("height", function(d) { return height - y(d.amount); });

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.call(d3.axisLeft(y));

});
