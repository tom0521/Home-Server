import dateutil.parser
import json

from datetime import datetime
from decimal import Decimal

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.account import Account,AccountType
from ..model.category import Category
from ..model.transaction import Transaction,transactions_marshal


class ReconcileApi(Resource):

    def get(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('end_date', type=lambda x: dateutil.parser.isoparse(x), required=True)
        parser.add_argument('amount', type=Decimal, required=True)
        args = parser.parse_args()
        
        account = Account.query.filter_by(id=id).first()
        if not account or account.type != AccountType.CREDIT:
            abort(400)
    
        transactions = Transaction.query                                       \
                    .filter_by(account_id=id, payment_id=None)                 \
                    .filter(Transaction.timestamp < args['end_date'])          \
                    .order_by(Transaction.timestamp).all()
        
        options = self.__missing_transactions(transactions, args['amount'])

        return make_response(json.dumps([ marshal(x, transactions_marshal) for x in options ]), 200)

    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('account_id', type=int, required=True)
        parser.add_argument('payment_date', type=lambda x: dateutil.parser.isoparse(x), default=datetime.now())
        parser.add_argument('option', type=int, required=True)
        parser.add_argument('end_date', type=lambda x: dateutil.parser.isoparse(x), required=True)
        parser.add_argument('amount', type=Decimal, required=True)
        args = parser.parse_args()
        
        to_account = Account.query.filter_by(id=id).first()
        if not to_account or to_account.type != AccountType.CREDIT:
            abort(400)

        # check transfer account
        from_account = Account.query.filter_by(id=args['account_id']).first()
        if not from_account:
            abort(400)

        if args['amount'] <= 0:
            abort(400)
    
        transactions = Transaction.query                                       \
                    .filter_by(account_id=id, payment_id=None)                 \
                    .filter(Transaction.timestamp < args['end_date'])          \
                    .order_by(Transaction.timestamp).all()
        
        options = [ x for x in self.__missing_transactions(transactions, args['amount']) ]

        # verify option choice
        if args['option'] >= len(options):
            abort(400)

        # get the debt category
        category = Category.query.filter_by(name='Debt').first()
        if not category:
            category = Category(name='Debt')
            db.session.add(category)
            db.session.commit()
        category_id = category.id

        # if everything checks out, create a transfer
        transfer = [
            Transaction(timestamp=args['payment_date'],amount=(-1*args['amount']),account_id=args['account_id'],
                        account_balance=0,address_id=None, category_id=category_id, note=None),
            Transaction(timestamp=args['payment_date'],amount=args['amount'],account_id=id,
                        account_balance=0,address_id=None, category_id=category_id, note=None)
        ]
        db.session.add_all(transfer)
        db.session.commit()

        for i in range(2):
            # Then update all the later transaction account balances
            # Get index of transaction within account transactions
            index = transfer[i].account.transactions.index(transfer[i])
            transfer[i].account.balance += transfer[i].amount
            transfer[i].account.transactions[-1].account_balance = transfer[i].account.balance
            # Subtract amount of the deleted transaction
            for j in range(len(transfer[i].account.transactions)-2,index-1,-1):
                transfer[i].account.transactions[j].account_balance =          \
                    transfer[i].account.transactions[j+1].account_balance      \
                    - transfer[i].account.transactions[j+1].amount
            db.session.commit()

        # Put eachother's id in the note for explainability
        transfer[0].note = f'transaction_id:{transfer[1].id}'
        transfer[1].note = f'transaction_id:{transfer[0].id}'
        transfer[1].payment_id = transfer[1].id

        # set payment id on all transactions
        for transaction in options[args['option']]:
            transaction.payment_id = transfer[1].id
        db.session.commit()

        return marshal(options[args['option']], transactions_marshal), 201

    def __missing_transactions(self, transactions, target, partial=[], partial_sum=Decimal(0)):
        if partial_sum == target:
            yield partial
        if partial_sum >= target:
            return
        for i, n in enumerate(transactions):
            remaining = transactions[i+1:]
            yield from self.__missing_transactions(remaining, target, partial + [n], partial_sum - n.amount)
