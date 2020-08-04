var places = [];
var categories = [];

const init = function () {
    get_places(function (res) { places = res.data || []; });
    get_categories(function (res) { categories = res.data || []; });
};

const create = function () {
    var form = document.getElementById('transaction_form');
    console.log(places);
    
    create_category('test', 
    function (category) {
        create_place('test', category.category_id,
        function (place) {
            create_city('test', 'test',
            function (city) {
                create_address(place.place_id, 'address', 'address2', city.city_id, 'postal_code', 'phone', 'url',
                function (address) {
                    create_payment_method('payment_method',
                    function (payment_method) {
                        create_transaction('timestamp',  'amount', address.address_id, payment_method.payment_method_id, 'note',
                        function (transaction) {
                            create_tags(['test','test2'],
                            function (tags) {
                                create_transaction_tags (transaction.transaction_id, tags, console.log);
                            });
                        });
                    });
                });
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', init);