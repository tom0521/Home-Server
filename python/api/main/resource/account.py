import json

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.account import Account,AccountType,accounts_marshal
from ..model.transaction import transactions_marshal


# Marshals a single account to return more data
account_marshal = {
        **accounts_marshal, 
        'transactions': fields.List(fields.Nested(transactions_marshal))
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
        return marshal(account, account_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            account = Account.query.filter_by(id=id).first()
            if account:
                return marshal(account, account_marshal), 200
            abort(404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        args = parser.parse_args()

        account_query = Account.query

        if args['filter']:
            account_query = account_query.filter_by(**args['filter'])

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page
        accounts = account_query.paginate(page,per_page, error_out=False)
 
        response = make_response(json.dumps(marshal(accounts.items, accounts_marshal)), 200)
        response.headers.extend({
            'Content-Range': 
                f"account {args['range'][0]}-{args['range'][1]}/{accounts.total}"
        })
        return response

    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('balance', type=float, default=0)
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'), default='DEBIT')
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        account = Account.query.filter_by(name=args['name']).first()
        if account:
            return marshal(account, account_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        account = Account(name=args['name'], balance=args['balance'],
                            type=AccountType[args['type']])
        db.session.add(account)
        db.session.commit()
        return marshal(account, account_marshal), 201

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
        parser.add_argument('name')
        parser.add_argument('balance', type=float)
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'))
        args = parser.parse_args()

        account = Account.query.filter_by(id=id).first()
        if not account:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(account, account_marshal), 202

        if args['name']:
            account.name = args['name']
        if args['balance']:
            account.balance = args['balance']
        if args['type']:
            account.type = args['type']

        db.session.commit()
        return marshal(account, account_marshal), 200
