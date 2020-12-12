import markdown
import os
import resource

from datetime import datetime
from enum import Enum
from flask import Flask,abort
from flask_restful import Api,Resource
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

'''

    Database Model Definitions

'''
class AccountType(Enum):
    DEBIT = 0
    CREDIT = 1

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account = db.Column(db.String(50), unique=True, nullable=False)
    balance = db.Column(db.Float, nullable=False,default=0)
    account_type = db.Column(db.Enum(AccountType), nullable=False)
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

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), unique=True, nullable=False)
    transactions = db.relationship('Transaction', backref='category', lazy=True)

    def __repr__(self):
        return '%s' % self.category

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), unique=True, nullable=False)
    state_province = db.Column(db.String(50), unique=True, nullable=False)
    country = db.Column(db.String(50), nullable=False)
    addresses = db.relationship('Address', backref='city', lazy=True)

    def __repr__(self):
        return '%s, %s\n%s' % (self.city, self.state_province, self.country)

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place = db.Column(db.String(50), unique=True, nullable=False)
    addresses = db.relationship('Address', backref='place', lazy=True)

    def __repr__(self):
        return '%s' % self.place

tags = db.Table('tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'), primary_key=True)
)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return '%s' % self.tag

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
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

class AddressApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

class CategoryApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

class CityApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

class PlaceApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

class TagApi(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

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
    app.run(debug=True)