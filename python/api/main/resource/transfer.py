import json

from decimal import Decimal

from flask import abort,current_app,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc,func

from .. import db
from ..model.account import Account,accounts_marshal
from ..model.category import Category
from ..model.transaction import Transaction,transactions_marshal


transfer_marshal = {
    **transactions_marshal,
    'account': fields.Nested(accounts_marshal),
}

class TransactionApi(Resource):

    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('timestamp', type=lambda x: dateutil.parser.isoparse(x), default=datetime.now())
        parser.add_argument('amount', type=Decimal, required=True)
        parser.add_argument('from_account_id', type=int, required=True)
        parser.add_argument('to_account_id', type=int, required=True)
        parser.add_argument('category')
        args = parser.parse_args()

        # if any foreign ids do not exist abort
        account = Account.query.filter_by(id=args['account_id']).first()
        if account is None:
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

        # Otherwise, insert the new entries
        transactions = [
            Transaction(timestamp=args['timestamp'],amount=args['amount'],account_id=args['account_id'],account_balance=0,
                        address_id=args['address_id'], category_id=category_id, note=args['note']),
            Transaction(timestamp=args['timestamp'],amount=args['amount'],account_id=args['account_id'],account_balance=0,
                        address_id=args['address_id'], category_id=category_id, note=args['note'])
        ]

        for i in range(2):
            db.session.add(transaction[i])
            # Then update all the later transaction account balances
            # Get index of transaction within account transactions
            index = transaction[i].account.transactions.index(transaction[i])
            transaction[i].account.balance += args['amount']
            transaction[i].account.transactions[-1].account_balance = transaction[i].account.balance
            # Subtract amount of the deleted transaction
            for j in range(len(transaction[i].account.transactions)-2,index-1,-1):
                transaction[i].account.transactions[j].account_balance =       \
                    transaction[i].account.transactions[j+1].account_balance   \
                    - transaction[i].account.transactions[j+1].amount
            db.session.commit()

        return marshal(transactions, transactions_marshal), 201

