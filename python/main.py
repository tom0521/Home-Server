import markdown
import os
import resource

from datetime import datetime
from enum import Enum,auto
from flask import Flask,abort
from flask_restful import Api,Resource,fields,marshal,reqparse
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

'''

    Database Model Definitions

'''
class AccountType(Enum):
    DEBIT = auto()
    CREDIT = auto()

    def __str__(self):
        return f'{self.name}'

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account = db.Column(db.String(50), unique=True, nullable=False)
    balance = db.Column(db.Float, nullable=False,default=0)
    type = db.Column(db.Enum(AccountType), nullable=False)
    transactions = db.relationship('Transaction', backref='account', lazy=True)
    
    def __repr__(self):
        return '%s - $%.2f' % (self.account, self.balance)

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    address = db.Column(db.String(50))
    address2 = db.Column(db.String(50))
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    postal_code = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    url = db.Column(db.String(255))
    transactions = db.relationship('Transaction', backref='address', lazy=True)

    def __repr__(self):
        return f'{self.address} {self.address2}'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), unique=True, nullable=False)
    transactions = db.relationship('Transaction', backref='category', lazy=True)

    def __repr__(self):
        return f'{self.category}'

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    state_province = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    addresses = db.relationship('Address', backref='city', lazy=True)

    def __repr__(self):
        return f'{self.city}, {self.state}'

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place = db.Column(db.String(50), unique=True, nullable=False)
    addresses = db.relationship('Address', backref='place', lazy=True)

    def __repr__(self):
        return f'{self.place}'

tags = db.Table('tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'), primary_key=True)
)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'{self.tag}'

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    tags = db.relationship('Tag', secondary=tags, lazy='subquery', backref=db.backref('transactions', lazy=True))
    note = db.Column(db.Text)

'''

    API Method Definitions

'''
class AccountApi(Resource):
    mfields = {
        'id': fields.Integer,
        'account': fields.String,
        'balance': fields.Float,
        'type': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            account = Account.query.filter_by(id=id).first()
            if account:
                return marshal(account, self.mfields), 200
            abort(404)
        return marshal(Account.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('account', required=True)
        parser.add_argument('balance', type=float, default=0)
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'), required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        account = Account.query.filter_by(account=args['account']).first()
        if account:
            return marshal(account, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        account = Account(account=args['account'], balance=args['balance'], type=AccountType[args['type']])
        db.session.add(account)
        db.session.commit()
        return marshal(account, self.mfields), 201

class AddressApi(Resource):
    mfields = {
        'id': fields.Integer,
        'place_id': fields.Integer,
        'address': fields.String,
        'address2': fields.String,
        'city_id': fields.Integer,
        'postal_code': fields.String,
        'phone': fields.String,
        'url': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            address = Address.query.filter_by(id=id).first()
            if address:
                return marshal(address, self.mfields), 200
            abort(404)
        return marshal(Address.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place_id', type=int, required=True)
        parser.add_argument('address')
        parser.add_argument('address2')
        parser.add_argument('city_id', type=int)
        parser.add_argument('postal_code')
        parser.add_argument('phone')
        parser.add_argument('url')
        args = parser.parse_args()

        # if any foreign ids do not exist abort
        if Place.query.filter_by(id=args['place_id']).first() is None:
            abort(400)
        if args['city_id'] and City.query.filter_by(id=args['city_id']).first is None:
            abort(400)

        # If the etnry already exists, return the entry with Accepted status code
        address = Address.query.filter_by(place_id=args['place_id'], address=args['address'],
                    address2=args['address2'], city_id=args['city_id'], postal_code=args['postal_code'],
                    phone=args['phone'], url=args['url']).first()
        if address:
            return marshal(address, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        address = Address(place_id=args['place_id'], address=args['address'],
                    address2=args['address2'], city_id=args['city_id'], 
                    postal_code=args['postal_code'], phone=args['phone'], url=args['url'])
        db.session.add(address)
        db.session.commit()
        return marshal(address, self.mfields), 201

class CategoryApi(Resource):
    mfields = {
        'id': fields.Integer,
        'category': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            category = Category.query.filter_by(id=id).first()
            if category:
                return marshal(category, self.mfields), 200
            abort(404)
        return marshal(Category.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('category', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        category = Category.query.filter_by(category=args['category']).first()
        if category:
            return marshal(category, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        category = Category(category=args['category'])
        db.session.add(category)
        db.session.commit()
        return marshal(category, self.mfields), 201

class CityApi(Resource):
    mfields = {
        'id': fields.Integer,
        'city': fields.String,
        'state_province': fields.String,
        'country': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            city = City.query.filter_by(id=id).first()
            if city:
                return marshal(city, self.mfields), 200
            abort(404)
        return marshal(City.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('city', required=True)
        parser.add_argument('state_province', required=True)
        parser.add_argument('country', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        city = City.query.filter_by(city=args['city'], state_province=args['state_province'], country=args['country']).first()
        if city:
            return marshal(city, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        city = City(city=args['city'], state_province=args['state_province'], country=args['country'])
        db.session.add(city)
        db.session.commit()
        return marshal(city, self.mfields), 201

class PlaceApi(Resource):
    mfields = {
        'id': fields.Integer,
        'place': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            place = Place.query.filter_by(id=id).first()
            if place:
                return marshal(place, self.mfields), 200
            abort(404)
        return marshal(Place.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        place = Place.query.filter_by(place=args['place']).first()
        if place:
            return marshal(place, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        place = Place(place=args['place'])
        db.session.add(place)
        db.session.commit()
        return marshal(place, self.mfields), 201

class TagApi(Resource):
    mfields = {
        'id': fields.Integer,
        'tag': fields.String
    }

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            tag = Tag.query.filter_by(id=id).first()
            if tag:
                return marshal(tag, self.mfields), 200
            abort(404)
        return marshal(Tag.query.all(), self.mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('tag', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        tag = Tag.query.filter_by(tag=args['tag']).first()
        if tag:
            return marshal(tag, self.mfields), 202

        # Otherwise, insert the new entry and return Created status code
        tag = Tag(tag=args['tag'])
        db.session.add(tag)
        db.session.commit()
        return marshal(tag, self.mfields), 201

class TransactionApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

'''

    API Path Definitions

'''
api.add_resource(AccountApi, '/account', '/account/<int:id>')
api.add_resource(AddressApi, '/address', '/address/<int:id>')
api.add_resource(CategoryApi, '/category', '/category/<int:id>')
api.add_resource(CityApi, '/city', '/city/<int:id>')
api.add_resource(PlaceApi, '/place', '/place/<int:id>')
api.add_resource(TagApi, '/tag', '/tag/<int:id>')
api.add_resource(TransactionApi, '/transaction', '/transaction/<int:id>')

# index path displays documentation
@app.route('/')
def index():
    with open(os.path.dirname(app.instance_path) + '/README.md', 'r') as readme:
        return markdown.markdown(readme.read())

'''

    Main

'''
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)