function init () {

}

function create () {
    /* Form data to dictionary */
    var form = $('#transaction_form').serializeArray();
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
    data.account_id = create_account(data).id;
    data.category_id = create_category(data).id;
    create_transaction(data);
}

document.addEventListener('DOMContentLoaded', init);