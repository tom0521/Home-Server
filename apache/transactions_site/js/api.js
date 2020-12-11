const API_URL = 'http://192.168.1.101:81';

/*-------------  GET FUNCTIONS  -------------*/

function get (path) {
    return $.ajax({
        url: `${API_URL}${path}`,
        type: 'GET',
        async: false
    }).responseJSON;
};

function get_addresses() {
    return get(`/address/read.php`);
};

function get_categories () {
    return get(`/category/read.php`);
};

function get_cities () {
    return get(`/city/read.php`);
};

function get_payment_methods () {
    return get(`/payment_method/read.php`);
};

function get_place (place_id) {
    return get(`/place/address/read.php?place_id=${place_id}`);
};

function get_places () {
    return get(`/place/read.php`);
};

function get_tags () {
    return get(`/tag/read.php`);
};

function get_transactions () {
    return get(`/transaction/read.php`);
};

function get_transaction_tags (transaction_id) {
    return get(`/transaction/tag/read.php?transaction_id=${transaction_id}`);
};

/*-------------  POST FUNCTIONS  ------------*/

function post (path, data) {
    return $.ajax({
        url: `${API_URL}${path}?Content-Type=application/json`,
        type: 'POST',
        data: JSON.stringify(data),
        async: false
    }).responseJSON;
}

function create_address (place_id, address, address2, city_id, 
                                postal_code, phone, url) {
    return post('/address/create.php', 
        {
            place_id: place_id,
            address: address,
            address2: address2,
            city_id: city_id,
            postal_code: postal_code,
            phone: phone,
            url: url
        }
    );
}

function create_category (category) {
    return post('/category/create.php',
        {
            category: category
        }
    );
}

function create_city (city, state_province, country="USA") {
    return post('/city/create.php',
        {
            city: city,
            state_province: state_province,
            country: country
        }
    );
}

function create_payment_method (payment_method) {
    return post('/payment_method/create.php',
        {
            payment_method: payment_method
        }
    );
}

function create_place (place) {
    return post('/place/create.php',
        {
            place: place
        }
    );
}

function create_tag (tag) {
    return post('/tag/create.php',
        {
            tag: tag
        }
    );
}

function create_transaction (timestamp, amount, address_id, 
                                    payment_method_id, category_id, note) {
    return post('/transaction/create.php',
        {
            timestamp: timestamp,
            amount: amount,
            address_id: address_id,
            payment_method_id: payment_method_id,
            category_id: category_id,
            note: note
        }
    );
}

function create_transaction_tag (transaction_id, tag_id) {
    return post('/transaction/tag/create.php',
        {
            transaction_id: transaction_id,
            tag_id: tag_id
        }
    );
}