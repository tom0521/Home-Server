let currency_format = new Intl.NumberFormat('en-US', { style: 'currency' , currency: 'USD' });

let category_stats = {};
let transaction_stats = [];

function init () {
    $.each(get_accounts(), function(index, value) {
        $('#account').append(`<option value="${value.id}">${value.account}</option>`);
    });
    $.each(get_categories(), function(index, value) {
        $('#categories').append(`<option value="${value.category}">`);
    });
    let gross_income = 0, expenses = 0;
    let funds = 0;
    $.each(get_accounts(), function(index, value) {
        funds += value.balance;
    });
    $.each(get_transactions().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), function(index, value) {
        value['cumulative'] = funds;
        funds -= value.amount;
        transaction_stats.unshift(value);
        if (value.amount < 0) {
            category_stats[value.category_id] = (category_stats[value.category_id] || 0) - value.amount;
            expenses -= value.amount;
        } else {
            gross_income += value.amount;
        }
        $('#gross-income').text(currency_format.format(gross_income));
        $('#expenses').text(currency_format.format(expenses));
        $('#net-income').text(currency_format.format(gross_income - expenses));
    });
    init_line_graph();
    init_pie_chart();
}

function init_line_graph () {
    var data = transaction_stats;
    var height = 500;
    var width = height;
    var margin = ({top: 20, right: 30, bottom: 30, left: 40});
    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    y = d3.scaleLinear()
        .domain([d3.min(data, d => d.cumulative), d3.max(data, d => d.cumulative)]).nice()
        .range([height - margin.bottom, margin.top]);

    x = d3.scaleUtc()
        .domain(d3.extent(data, d => new Date(d.timestamp)))
        .range([margin.left, width - margin.right]);

    line = d3.line()
        .defined(d => !isNaN(d.cumulative))
        .x(d => x(new Date(d.timestamp)))
        .y(d => y(d.cumulative));

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    $('#rolling-income').append(svg.node());
}

function init_pie_chart () {
    var data = Object.entries(category_stats)
        .map(([key, val]) => ([get(`/category/${key}`).category, val]));
    var width = 500;
    var height = width;

    arcLabel = function() {
        const radius = Math.min(width, height) / 2 * 0.8;
        return d3.arc().innerRadius(radius).outerRadius(radius);
      }
    
    pie = d3.pie()
            .sort(null)
            .padAngle(0.03)
            .value(d => d[1]);

    color = d3.scaleOrdinal()
        .domain(data.map(d => d[0]))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
        
    const arcs = pie(data);

    arc = d3.arc()
        .innerRadius(70)
        .outerRadius(Math.min(width, height) / 2 - 1)
        .cornerRadius(15);

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
    
    svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data[0]))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data[0]}: ${currency_format.format(d.data[1])}`);

    svg.append("g")
        .attr("font-family", "var(--bs-font-sans-serif)")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel().centroid(d)})`)
        .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data[0]))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => currency_format.format(d.data[1])));

    $('#category-stats').append(svg.node());
}

function create () {
    /* Form data to dictionary */
    var form = $('#transaction-form').serializeArray();
    var data  = {};
    for (i in form) {
        if (form[i].value) {
            data[form[i].name] = form[i].value;
        }
    }
    // Split up the tags to be an array
    if (data.tag) {
        data.tag = data.tag.split(',');
    }

    // Get the timestamp
    var timestamp = new Date(`${data.date} ${data.time}`);
    data.timestamp = timestamp.toISOString().slice(0, 19);
    
    data.place_id = create_place(data).id;
    data.city_id = create_city(data).id;
    data.address_id = create_address(data).id;
    // data.account_id = create_account(data).id;
    data.category_id = create_category(data).id;
    var transaction_res = create_transaction(data);
    if (transaction_res.id) {
        alert('Transaction created!');
    } else {
        alert(`Failed to create Transaction\n${transaction_res}`);
    }
}

function show_transaction_popup () {
    $('#transaction-popup').css('display', 'block');
    $('#transaction-popup-btn').css('display', 'none');
}

function hide_transaction_popup () {
    $('#transaction-popup').css('display', 'none');
    $('#transaction-popup-btn').css('display', 'block');
}

document.addEventListener('DOMContentLoaded', init);