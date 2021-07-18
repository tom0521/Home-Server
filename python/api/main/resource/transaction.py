import dateutil.parser
import json
import os
import werkzeug

from datetime import datetime

from flask import abort,current_app,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.account import Account,accounts_marshal
from ..model.address import Address
from ..model.category import Category
from ..model.tag import Tag
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
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        # TODO: Remove default and allow query all
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        parser.add_argument('sort', type=lambda x: json.loads(x))
        args = parser.parse_args()

        transaction_query = Transaction.query

        if args['filter']:
            # TODO: filter only columns in the table
            if args['filter']['q']:
                del args['filter']['q']
            transaction_query = transaction_query.filter_by(**args['filter'])
        if args['sort']:
            order = desc(args['sort'][0]) if args['sort'][1] == "DESC" else args['sort'][0]
            transaction_query = transaction_query.order_by(order)

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page + 1
        transactions = transaction_query.paginate(page=page, per_page=per_page, error_out=False)
 
        response = make_response(json.dumps(marshal(transactions.items, transactions_marshal)), 200)
        response.headers.extend({
            'Content-Range': 
                f"transaction {args['range'][0]}-{args['range'][1]}/{transactions.total}"
        })
        return response
    
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
        parser.add_argument('tags', action='append', default=[])
        parser.add_argument('note')
        parser.add_argument('receipt', type=werkzeug.datastructures.FileStorage, location='files')
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
            category_id = category.id
        else:
            category_id = None

        # Otherwise, insert the new entry and return Created status code
        new_balance = account.balance + args['amount']
        transaction = Transaction(timestamp=args['timestamp'],amount=args['amount'],account_id=args['account_id'],account_balance=new_balance,
                        address_id=args['address_id'], category_id=category_id, note=args['note'])
        db.session.add(transaction)
        account.balance = new_balance
        # TODO: Does this return a value?
        # account.balance += transaction.amount

        # create and associate all tags with this transaction
        for t in args['tags']:
            # if the tag does not exist, create it
            tag = Tag.query.filter_by(name=t).first()
            if tag is None:
                tag = Tag(name=t)
                db.session.add(tag)
            transaction.tags.append(tag)

        db.session.commit()

        # Need to make the transaction to create a unique receipt filename
        if args['receipt']:
            receipt_dir = args['timestamp'].strftime('%Y/%B/%A')
            os.makedirs(os.path.join(current_app.config['RECEIPT_PATH'], receipt_dir), exist_ok=True)
            receipt_name = f"{args['timestamp'].strftime('%X')}-{transaction.id}{os.path.splitext(args['receipt'].filename)[-1]}"
            receipt_path = f'{receipt_dir}/{receipt_name}'
            args['receipt'].save(os.path.join(current_app.config['RECEIPT_PATH'], receipt_path))
            transaction.receipt = receipt_path

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
        parser.add_argument('tags', action='append')
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
