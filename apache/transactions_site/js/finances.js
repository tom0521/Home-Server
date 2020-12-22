let currency_format = new Intl.NumberFormat('en-US', { style: 'currency' , currency: 'USD' });

let category_stats = {};

function init () {
    $.each(get_accounts(), function(index, value) {
        $('#account').append(`<option value=${value.id}>${value.account}</option>`);
    });
    $.each(get_categories(), function(index, value) {
        $('#categories').append(`<option value=${value.category}>`);
    });
    let gross_income = 0, expenses = 0;
    $.each(get_transactions(), function(index, value) {
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
    init_pie_chart();
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
            .value(d => d[1]);

    color = d3.scaleOrdinal()
        .domain(data.map(d => d[0]))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
        
    const arcs = pie(data);

    arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1)

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
        .text(d => `${d.data[0]}: ${d.data[1].toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
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
    create_transaction(data);
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