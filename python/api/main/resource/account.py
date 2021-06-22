from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.account import Account,AccountType

mfields = {
    'id': fields.Integer,
    'account': fields.String,
    'balance': fields.Float,
    'type': fields.String
}

class AccountApi(Resource):

    # TODO: what to do with related transactions?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        account = Account.query,filter_by(id=id).first()
        if not account:
            abort(404)
        db.session.delete(account)
        db.session.commit()
        return marshal(account, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            account = Account.query.filter_by(id=id).first()
            if account:
                return marshal(account, mfields), 200
            abort(404)
        return marshal(Account.query.all(), mfields), 200

    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('account', required=True)
        parser.add_argument('balance', type=float, default=0)
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'), default='DEBIT')
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        account = Account.query.filter_by(account=args['account']).first()
        if account:
            return marshal(account, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        account = Account(account=args['account'], balance=args['balance'], type=AccountType[args['type']])
        db.session.add(account)
        db.session.commit()
        return marshal(account, mfields), 201

    """
      TODO: if balance changed, should the transactions be updated?
            or do not allow balance to be updated. Need to create a
            transaction to update.
    """
    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('account')
        parser.add_argument('balance', type=float)
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'))
        args = parser.parse_args()

        account = Account.query.filter_by(id=id).first()
        if not account:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(account, mfields), 202

        if args['account']:
            account.account = args['account']
        if args['balance']:
            account.balance = args['balance']
        if args['type']:
            account.type = args['type']

        db.session.commit()
        return marshal(account, mfields), 200
