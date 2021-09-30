import dateutil.parser
import json

from decimal import Decimal

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.account import Account,AccountType
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

    def __missing_transactions(self, transactions, target, partial=[], partial_sum=Decimal(0)):
        if partial_sum == target:
            yield partial
        if partial_sum >= target:
            return
        for i, n in enumerate(transactions):
            remaining = transactions[i+1:]
            yield from self.__missing_transactions(remaining, target, partial + [n], partial_sum - n.amount)
