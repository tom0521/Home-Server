from datetime import datetime

from flask_restful import fields

from .. import db
from ..model.tag import tags_marshal


transactions_marshal = {
    'id': fields.Integer,
    'timestamp': fields.DateTime,
    'amount': fields.Float,
    'account_balance': fields.Float,
    'category': fields.String,
    'note': fields.String,
    'tags': fields.List(
        fields.Nested(tags_marshal)
    )
}

transaction_tags = db.Table('transaction_tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'), primary_key=True)
)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    account_balance = db.Column(db.Float, nullable=False)
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    tags = db.relationship('Tag', secondary=transaction_tags, lazy='subquery', backref=db.backref('transactions', lazy=True))
    note = db.Column(db.Text)

    def __repr__(self):
        return f'{self.timestamp}: ${self.amount:.2f}'
