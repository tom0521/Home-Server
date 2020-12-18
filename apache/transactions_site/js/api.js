const API_URL = 'http://localhost:5000';

/*-------------  GET FUNCTIONS  -------------*/

function get (path) {
    return $.ajax({
        url: `${API_URL}${path}`,
        type: 'GET',
        async: false
    }).responseJSON;
};

function get_accounts () {
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

function create_account (data) {
    return post('/account', data);
}

function create_address (data) {
    return post('/address', data);
}

function create_category (data) {
    return post('/category', data);
}

function create_city (data) {
    return post('/city', data);
}

function create_place (data) {
    return post('/place', data);
}

function create_transaction (data) {
    return post('/transaction', data);
}