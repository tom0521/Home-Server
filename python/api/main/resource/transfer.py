from datetime import datetime
from decimal import Decimal

from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.account import Account,accounts_marshal
from ..model.category import Category
from ..model.transaction import Transaction,transactions_marshal


transfer_marshal = {
    **transactions_marshal,
    'account': fields.Nested(accounts_marshal),
}

class TransferApi(Resource):

    def post(self):
        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('timestamp', type=lambda x: dateutil.parser.isoparse(x), default=datetime.now())
        parser.add_argument('from_account_id', type=int, required=True)
        parser.add_argument('to_account_id', type=int, required=True)
        parser.add_argument('amount', type=Decimal, required=True)
        parser.add_argument('category')
        args = parser.parse_args()

        # if any foreign ids do not exist abort
        from_account = Account.query.filter_by(id=args['from_account_id']).first()
        if from_account is None:
            abort(400)
        to_account = Account.query.filter_by(id=args['to_account_id']).first()
        if to_account is None:
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
            Transaction(timestamp=args['timestamp'],amount=(-1*args['amount']),account_id=args['from_account_id'],
                        account_balance=0,address_id=None, category_id=category_id, note=None),
            Transaction(timestamp=args['timestamp'],amount=args['amount'],account_id=args['to_account_id'],
                        account_balance=0,address_id=None, category_id=category_id, note=None)
        ]
        db.session.add_all(transactions)
        db.session.commit()

        for i in range(2):
            # Then update all the later transaction account balances
            # Get index of transaction within account transactions
            index = transactions[i].account.transactions.index(transactions[i])
            transactions[i].account.balance += transactions[i].amount
            transactions[i].account.transactions[-1].account_balance = transactions[i].account.balance
            # Subtract amount of the deleted transaction
            for j in range(len(transactions[i].account.transactions)-2,index-1,-1):
                transactions[i].account.transactions[j].account_balance =      \
                    transactions[i].account.transactions[j+1].account_balance  \
                    - transactions[i].account.transactions[j+1].amount
            db.session.commit()

        # Put eachother's id in the note for explainability
        transactions[0].note = f'transaction_id:{transactions[1].id}'
        transactions[1].note = f'transaction_id:{transactions[0].id}'

        db.session.commit()

        return marshal(transactions, transactions_marshal), 201

