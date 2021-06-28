import dateutil.parser
from datetime import datetime

from flask import abort,Request
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.account import Account,accounts_marshal
from ..model.address import Address
from ..model.category import Category
from ..model.transaction import Transaction,transactions_marshal
from ..resource.address import address_marshal


transaction_marshal = {
    **transactions_marshal,
    'account': fields.Nested(accounts_marshal),
    'address': fields.Nested(address_marshal)
}

class TransactionApi(Resource):

    # TODO: Need to update account and all transactions after this one
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        transaction = Transaction.query,filter_by(id=id).first()
        if not transaction:
            abort(404)
        db.session.delete(transaction)
        db.session.commit()
        return marshal(transaction, transactions_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            transaction = Transaction.query.filter_by(id=id).first()
            if transaction:
                return marshal(transaction, transaction_marshal), 200
            abort(404)
        return marshal(Transaction.query.all(), transactions_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('timestamp', type=lambda x: dateutil.parser.isoparse(x), default=datetime.now())
        parser.add_argument('amount', type=float, required=True)
        parser.add_argument('account_id', type=int, required=True)
        parser.add_argument('address_id', type=int)
        parser.add_argument('category')
        parser.add_argument('tag', action='append', default=[])
        parser.add_argument('note')
        args = parser.parse_args()

        # if any foreign ids do not exist abort
        account = Account.query.filter_by(id=args['account_id']).first()
        if account is None:
            abort(400)
        if args['address_id'] and Address.query.filter_by(id=args['address_id']).first() is None:
            abort(400)
        if args['category']:
            category = Category.query.filter_by(name=args['category']).first()
            if not category:
                category = Category(name=args['category'])
                db.session.add(category)
                db.session.commit()

        # Otherwise, insert the new entry and return Created status code
        new_balance = account.balance + args['amount']
        transaction = Transaction(timestamp=args['timestamp'],amount=args['amount'],account_id=args['account_id'],account_balance=new_balance,
                        address_id=args['address_id'], category_id=category.id, note=args['note'])
        db.session.add(transaction)
        account.balance = new_balance
        # TODO: Does this return a value?
        # account.balance += transaction.amount

        # create and associate all tags with this transaction
        for t in args['tag']:
            # if the tag does not exist, create it
            tag = Tag.query.filter_by(tag=t).first()
            if tag is None:
                tag = Tag(tag=t)
                db.session.add(tag)
            transaction.tags.append(tag)

        db.session.commit()
        return marshal(transaction, transactions_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('timestamp', type=lambda x: dateutil.parser.isoparse(x))
        parser.add_argument('amount', type=float)
        parser.add_argument('account_id', type=int)
        parser.add_argument('address_id', type=int)
        parser.add_argument('category')
        parser.add_argument('tag', action='append')
        parser.add_argument('note')
        args = parser.parse_args()

        transaction = Transaction.query.filter_by(id=id).first()
        if not transaction:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(transaction, transactions_marshal), 202

        if args['timestamp']:
            transaction.timestamp = args['timestamp']
        if args['amount']:
            transaction.amount = args['amount']
        if args['account_id']:
            transaction.account_id = args['account_id']
        if args['address_id']:
            transaction.address_id = args['address_id']
        if args['category']:
            category = Category.query.filter_by(name=args['category']).first()
            if not category:
                category = Category(name=args['category'])
                db.session.add(category)
                db.session.commit()
            transaction.category_id = category.id
        # TODO: what to do with tags?
        if args['note']:
            transaction.note = args['note']

        db.session.commit()
        return marshal(transaction, transactions_marshal), 200

class AccountTransactionApi(Resource):

    def get(self, account_id):
        account = Account.query.filter_by(id=account_id).first()
        if account:
            return marshal(account.transactions, transactions_marshal), 200
        abort(404)


class AddressTransactionApi(Resource):

    def get(self, address_id):
        address = Address.query.filter_by(id=address_id).first()
        if address:
            return marshal(address.transactions, transactions_marshal)
        abort(404)


class CategoryTransactionApi(Resource):

    def get(self, category_id):
        category = Category.query.filter_by(id=category_id).first()
        if category:
            return marshal(category.transactions, transactions_marshal)
        abort(404)
