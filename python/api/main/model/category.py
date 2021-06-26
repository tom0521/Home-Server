from flask_restful import fields

from .. import db


category_marshal = {
    'id': fields.Integer,
    'name': fields.String
}

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    transactions = db.relationship('Transaction', backref='category', lazy=True)

    def __repr__(self):
        return f'{self.name}'
