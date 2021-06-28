from enum import Enum,auto

from flask_restful import fields

from .. import db

accounts_marshal = {
    'id': fields.Integer,
    'name': fields.String,
    'balance': fields.Float,
    'type': fields.String,
}

class AccountType(Enum):
    DEBIT = auto()
    CREDIT = auto()

    def __str__(self):
        return f'{self.name}'

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    balance = db.Column(db.Float, nullable=False,default=0)
    type = db.Column(db.Enum(AccountType), nullable=False)
    transactions = db.relationship('Transaction', backref='account', lazy=True)
    
    def __repr__(self):
        return '%s - $%.2f' % (self.name, self.balance)
