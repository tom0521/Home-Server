from datetime import datetime,timedelta,timezone

from flask import request
from flask_restful import fields

from .. import db
from ..model.tag import tags_marshal

class DateTimezone(fields.DateTime):
    def format(self, value):
        tz = timezone(
                timedelta(
                    hours=int(
                        request.headers.get('Timezone-Offset', default=0)
                    )
                )
            )
        return super(DateTimezone, self).format(value.astimezone(tz))

class ReceiptUrl(fields.Url):
    def output(self, key, obj):
        return fields.Url.output(self, key, obj) if obj.__dict__[key] else None

transactions_marshal = {
    'id': fields.Integer,
    'timestamp': DateTimezone(dt_format='iso8601'),
    'amount': fields.Float,
    'account_id': fields.Integer,
    'account_balance': fields.Float,
    'category': fields.String,
    'receipt': ReceiptUrl('receiptapi', absolute=True),
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
    amount = db.Column(db.Numeric(precision=2), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    account_balance = db.Column(db.Numeric(precision=2), nullable=False)
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    receipt = db.Column(db.String(255))
    tags = db.relationship('Tag', secondary=transaction_tags, lazy='subquery', backref=db.backref('transactions', lazy=True))
    note = db.Column(db.Text)

    def __repr__(self):
        return f'{self.timestamp}: ${self.amount:.2f}'
