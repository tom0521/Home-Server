const API_URL = 'http://192.168.1.101:81';

/*-------------  GET FUNCTIONS  -------------*/

const get_addresses = function (response_handler) {
    $.ajax({
        url: `${API_URL}/address/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_categories = function (response_handler) {
    $.ajax({
        url: `${API_URL}/category/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_cities = function (response_handler) {
    $.ajax({
        url: `${API_URL}/city/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_payment_methods = function (response_handler) {
    $.ajax({
        url: `${API_URL}/payment_method/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

// TODO: Finish
const get_place = function (place_id, response_handler) {
    $.ajax({
        url: `${API_URL}/place/address/read.php?place_id=${place_id}`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_places = function (response_handler) {
    $.ajax({
        url: `${API_URL}/place/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_tags = function (response_handler) {
    $.ajax({
        url: `${API_URL}/tag/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

const get_transactions = function (response_handler) {
    $.ajax({
        url: `${API_URL}/transaction/read.php`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

// TODO: Finish
const get_transaction_tags = function (transaction_id, response_handler) {
    $.ajax({
        url: `${API_URL}/transaction/tag/read.php?transaction_id=${transaction_id}`,
        type: 'GET',
        success: function (response) {
            response_handler(response);
        }
    });
};

/*-------------  POST FUNCTIONS  ------------*/

const create_address = function (place_id, address, address2, city_id, 
                                postal_code, phone, url, response_handler) {
    $.ajax({
        url: `${API_URL}/address/create.php`,
        type: 'POST',
        data: {
            place_id: place_id,
            address: address,
            address2: address2,
            city_id: city_id,
            postal_code: postal_code,
            phone: phone,
            url: url
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_category = function (category, response_handler) {
    $.ajax({
        url: `${API_URL}/category/create.pbp`,
        type: 'POST',
        data: {
            category: category
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_city = function (city, state, response_handler) {
    $.ajax({
        url: `${API_URL}/city/create.php`,
        type: 'POST',
        data: {
            city: city,
            state: state
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_payment_method = function (payment_method, response_handler) {
    $.ajax({
        url: `${API_URL}/payment_method/create.php`,
        type: 'POST',
        data: {
            payment_method: payment_method
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_place = function (place, category_id, response_handler) {
    $.ajax({
        url: `${API_URL}/place/create.php`,
        type: 'POST',
        data: {
            place: place,
            category_id: category_id
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_tag = function (tag, response_handler) {
    $.ajax({
        url: `${API_URL}/tag/create.php`,
        type: 'POST',
        data: {
            tag: tag
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_transaction = function (timestamp, amount, address_id, 
                                    payment_method_id, note, response_handler) {
    $.ajax({
        url: `${API_URL}/transaction/create.php`,
        type: 'POST',
        data: {
            timestamp: timestamp,
            amount: amount,
            address_id: address_id,
            payment_method_id: payment_method_id,
            note: note
        },
        success: function (response) {
            response_handler(response);
        }
    });
};

const create_transaction_tag = function (transaction_id, tag_id, response_handler) {
    $.ajax({
        url: `${API_URL}/transaction/tag/create.php`,
        type: 'POST',
        data: {
            transaction_id: transaction_id,
            tag_id: tag_id
        },
        success: function (response) {
            response_handler(response);
        }
    });
};