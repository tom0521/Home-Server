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
            expenses -= value.amount;
        } else {
            gross_income += value.amount;
        }
    });
    let currency_format = new Intl.NumberFormat('en-US', { style: 'currency' , currency: 'USD' });
    $('#gross-income').text(currency_format.format(gross_income));
    $('#expenses').text(currency_format.format(expenses));
    $('#net-income').text(currency_format.format(gross_income - expenses));
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