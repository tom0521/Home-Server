from flask_restful import fields

from .. import db


country_marshal = {
    'id': fields.Integer,
    'name': fields.String
}

class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    addresses = db.relationship('Address', backref='country', lazy=True)

    def __repr__(self):
        return f'{self.name}'
