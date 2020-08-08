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

function post (path, data, response_handler) {
    $.ajax({
        url: `${API_URL}${path}?Content-Type=application/json`,
        type: 'POST',
        data: JSON.stringify(data),
        success: function (response) {
            response_handler(response);
        }
    });
}

function create_address (place_id, address, address2, city_id, 
                                postal_code, phone, url, response_handler) {
    post('/address/create.php', 
        {
            place_id: place_id,
            address: address,
            address2: address2,
            city_id: city_id,
            postal_code: postal_code,
            phone: phone,
            url: url
        },
        response_handler);
}

function create_category (category, response_handler) {
    post('/category/create.php',
        {
            category: category
        },
        response_handler
    );
}

function create_city (city, state, response_handler) {
    post('/city/create.php',
        {
            city: city,
            state: state
        },
        response_handler
    );
}

function create_payment_method (payment_method, response_handler) {
    post('/payment_method/create.php',
        {
            payment_method: payment_method
        },
        response_handler
    );
}

function create_place (place, response_handler) {
    post('/place/create.php',
        {
            place: place
        },
        response_handler
    );
}

function create_tag (tag, response_handler) {
    post('/tag/create.php',
        {
            tag: tag
        },
        response_handler);
}

function create_transaction (timestamp, amount, address_id, 
                                    payment_method_id, category_id, note, response_handler) {
    post('/transaction/create.php',
        {
            timestamp: timestamp,
            amount: amount,
            address_id: address_id,
            payment_method_id: payment_method_id,
            category_id: category_id,
            note: note
        },
        response_handler
    );
}

function create_transaction_tag (transaction_id, tag_id, response_handler) {
    post('/transaction/tag/create.php',
        {
            transaction_id: transaction_id,
            tag_id: tag_id
        },
        response_handler
    );
}