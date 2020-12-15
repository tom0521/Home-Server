const API_URL = 'http://192.168.1.101:5000';

/*-------------  GET FUNCTIONS  -------------*/

function get (path) {
    return $.ajax({
        url: `${API_URL}${path}`,
        type: 'GET',
        async: false
    }).responseJSON;
};

function accounts () {
    return get(`/account`);
}

function get_addresses() {
    return get(`/address`);
}

function get_categories () {
    return get(`/category`);
}

function get_cities () {
    return get(`/city`);
}

function get_places () {
    return get(`/place`);
}

function get_tags () {
    return get(`/tag`);
}

function get_transactions () {
    return get(`/transaction`);
}

/*-------------  POST FUNCTIONS  ------------*/

function post (path, data) {
    return $.ajax({
        url: `${API_URL}${path}`,
        type: 'POST',
        data: data,
        traditional: true,
        async: false
    }).responseJSON;
}

function create_account (account, balance=0, type) {
    return post('/account',
        {
            account: account,
            balance: balance,
            type: type
        }
    );
}

function create_address (place_id, address, address2, city_id, 
                                postal_code, phone, url) {
    return post('/address', 
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
    return post('/category',
        {
            category: category
        }
    );
}

function create_city (city, state_province, country="United States of America") {
    return post('/city',
        {
            city: city,
            state_province: state_province,
            country: country
        }
    );
}

function create_place (place) {
    return post('/place',
        {
            place: place
        }
    );
}

function create_transaction (timestamp, amount, address_id, 
                                    account_id, category_id, tag, note) {
    return post('/transaction',
        {
            timestamp: timestamp,
            amount: amount,
            address_id: address_id,
            account_id: account_id,
            category_id: category_id,
            tag: tag,
            note: note
        }
    );
}