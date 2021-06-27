from flask_restful import fields

from .. import db


addresses_marshal = {
    'id': fields.Integer,
    'line_1': fields.String,
    'line_2': fields.String,
    'city': fields.String,
    'state_province': fields.String,
    'country': fields.String,
    'postal_code': fields.String,
    'phone': fields.String,
    'url': fields.String
}

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    line_1 = db.Column(db.String(50))
    line_2 = db.Column(db.String(50))
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    state_province_id = db.Column(db.Integer, db.ForeignKey('state_province.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    postal_code = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    url = db.Column(db.String(255))
    transactions = db.relationship('Transaction', backref='address', lazy=True)

    def __repr__(self):
        return f'{self.line_1} {self.line_2}'
