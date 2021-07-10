import os
import markdown

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, expose_headers=['Content-Range'])
    api = Api(app)
    app.config.from_mapping(
        SECRET_KEY="dev",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{app.instance_path}/app.db',
        RECEIPT_PATH=os.path.join(app.instance_path, 'receipts'),
    )

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.update(test_config)

    try:
        os.makedirs(app.instance_path, exist_ok=True)
        os.makedirs(app.config['RECEIPT_PATH'], exist_ok=True)
    except OSError:
        pass

    app.app_context().push()

    from .model import account,address,category,city,country,place,state_province,tag,transaction

    db.init_app(app)
    db.create_all()

    from .resource.account import AccountApi
    from .resource.address import AddressApi,CityAddressApi,PlaceAddressApi
    from .resource.category import CategoryApi
    from .resource.city import CityApi
    from .resource.country import CountryApi
    from .resource.place import PlaceApi
    from .resource.receipt import ReceiptApi
    from .resource.state_province import StateProvinceApi
    from .resource.tag import TagApi,TransactionTagApi
    from .resource.transaction import TransactionApi,AccountTransactionApi,AddressTransactionApi,CategoryTransactionApi

    api.add_resource(AccountApi, '/account', '/account/<int:id>')
    api.add_resource(AccountTransactionApi, '/account/<int:account_id>/transaction')
    api.add_resource(AddressApi, '/address', '/address/<int:id>')
    api.add_resource(AddressTransactionApi, '/address/<int:address_id>/transaction')
    api.add_resource(CategoryApi, '/category', '/category/<int:id>')
    api.add_resource(CategoryTransactionApi, '/category/<int:category_id>/transaction')
    api.add_resource(CityApi, '/city', '/city/<int:id>')
    api.add_resource(CityAddressApi, '/city/<int:city_id>/address')
    api.add_resource(CountryApi, '/country', '/country/<int:id>')
    api.add_resource(PlaceApi, '/place', '/place/<int:id>')
    api.add_resource(PlaceAddressApi, '/place/<int:place_id>/address')
    api.add_resource(ReceiptApi, '/receipt/<path:receipt>')
    api.add_resource(StateProvinceApi, '/state_province', '/state_province/<int:id>')
    api.add_resource(TagApi, '/tag', '/tag/<int:id>')
    api.add_resource(TransactionApi, '/transaction', '/transaction/<int:id>')
    api.add_resource(TransactionTagApi, '/transaction/<int:transaction_id>/tag')

    # index path displays documentation
    @app.route('/')
    def index():
        with open(os.path.dirname(app.instance_path) + '/README.md', 'r') as readme:
            return markdown.markdown(readme.read())

    return app
