function init () {
    fill_datalist ('addresses', get_addresses().data, 'address');
    fill_datalist ('categories', get_categories().data, 'category');
    fill_datalist ('cities', get_cities().data, 'city');
    fill_datalist ('places', get_places().data, 'place');
    fill_datalist ('tag_list', get_tags().data, 'tag');
};

function fill_datalist (id, arr, mbr) {
    var datalist = document.getElementById(id);
    for(i in arr) {
        datalist.innerHTML += `<option>${arr[i][mbr]}</option>`;
    }
}

function create () {
    /* Form data to dictionary */
    var form = $('#transaction_form').serializeArray();
    var data  = {};
    for (i in form) {
        data[form[i].name] = form[i].value;
    }
    // Split up the tags to be an array
    data.tags = data.tags.split(',');

    // Get the timestamp
    var timestamp = new Date(`${data.date} ${data.time} `);
    data.timestamp = timestamp.toISOString().slice(0, 19).replace('T', ' ');
    
    let place_res = create_place(data.place);
    let city_res = create_city(data.city);
    let address_res = create_address(place_res.place_id, data.address, data.address2,
                            city_res.city_id, data.postal_code, data.phone, data.url);
    let payment_method_res = create_payment_method(data.payment_method);
    let category_res = create_category(data.category);
    let transaction_res = create_transaction(data.timestamp, data.amount, address_res.address_id, 
                        payment_method_res.payment_method_id, category_res.category_id, data.note);
    
    data.tags.forEach(tag => {
        let tag_res = create_tag(tag);
        create_transaction_tag(transaction_res.transaction_id, tag_res.tag_id);
    });

}

document.addEventListener('DOMContentLoaded', init);