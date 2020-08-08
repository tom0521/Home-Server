const init = function () {
    get_places(function (res) { places = res.data || []; });
    get_categories(function (res) { categories = res.data || []; });
};

const create = function () {
    /* Form data to dictionary */
    var form = $('#transaction_form').serializeArray();
    var data  = {};
    for (i in form) {
        data[form[i].name] = form[i].value;
    }
    // Split up the tags to be an array
    data.tags = data.tags.split(',');

    /* Cascading API calls */
    create_place(data.place,
    function (place) {
        create_city(data.city, data.state,
        function (city) {
            create_address(place.place_id, data.address, data.address2, city.city_id, data.postal_code, data.phone, data.url,
            function (address) {
                create_payment_method(data.payment_method,
                function (payment_method) {
                    create_category(data.category, 
                    function (category) {
                        create_transaction(data.timestamp, data.amount, address.address_id, payment_method.payment_method_id, category.category_id, data.note,
                        function (transaction) {
                            // For every tag, associate it with the transaction
                            for (i in data.tags) {
                                create_tag(data.tags[i], function (tag) {
                                    create_transaction_tag(transaction.transaction_id, tag.tag_id, console.log);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', init);