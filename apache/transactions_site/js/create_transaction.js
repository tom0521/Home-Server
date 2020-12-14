function init () {

}

function create () {
    /* Form data to dictionary */
    var form = $('#transaction_form').serializeArray();
    var data  = {};
    for (i in form) {
        data[form[i].name] = form[i].value;
    }
    // Split up the tags to be an array
    data.tag = data.tag.split(',');

    // Get the timestamp
    var timestamp = new Date(`${data.date} ${data.time}`);
    data.timestamp = timestamp.toISOString().slice(0, 19);
    
    let place_res = create_place(data.place);
    let city_res = create_city(data.city, data.state_province, data.country);
    let address_res = create_address(place_res.id, data.address, data.address2,
                            city_res.id, data.postal_code, data.phone, data.url);
    let account_res = create_account(data.account, data.balance, data.type);
    let category_res = create_category(data.category);
    let transaction_res = create_transaction(data.timestamp, data.amount, address_res.id, 
                        account_res.id, category_res.id, data.tag, data.note);
}

document.addEventListener('DOMContentLoaded', init);