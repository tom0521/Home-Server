import json

from decimal import Decimal

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.account import Account,AccountType,accounts_marshal
from ..model.transaction import transactions_marshal


# Marshals a single account to return more data
account_marshal = {
        **accounts_marshal, 
        'transactions': fields.List(fields.Nested(transactions_marshal))
    }

class AccountApi(Resource):

    def delete(self, id=None):
        # if the id is specified via url
        if id:
            account = Account.query.filter_by(id=id).first()
            if account:
                db.session.delete(account)
                db.session.commit()
                return marshal(account, account_marshal), 200
            abort(404)

        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x), location='args')
        args = parser.parse_args()

        accounts = Account.query.filter(
                    Account.id.in_(args['filter'].get('id',[]))).all()
        for account in accounts:
            db.session.delete(account)
            db.session.commit()

        return marshal(accounts, accounts_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            account = Account.query.filter_by(id=id).first()
            if account:
                return marshal(account, account_marshal), 200
            abort(404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        # TODO: Remove default and allow query all
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        parser.add_argument('sort', type=lambda x: json.loads(x))
        args = parser.parse_args()

        account_query = Account.query

        if args['filter']:
            # TODO: filter only columns in the table
            if args['filter'].get('q'):
                account_query = account_query.filter(Account.name.like(f"%{args['filter']['q']}%"))
                del args['filter']['q']
            if isinstance(args['filter'].get('id'), list):
                account_query = account_query.filter(Account.id.in_(args['filter']['id']))
                del args['filter']['id']
            account_query = account_query.filter_by(**args['filter'])
        if args['sort']:
            order = desc(args['sort'][0]) if args['sort'][1] == "DESC" else args['sort'][0]
            account_query = account_query.order_by(order)

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page + 1
        accounts = account_query.paginate(page=page, per_page=per_page, error_out=False)
 
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
        parser.add_argument('balance', type=Decimal, default=0)
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

    def put(self, id=None):
        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('balance', type=Decimal)
        parser.add_argument('id', type=lambda x: json.loads(x))
        parser.add_argument('name')
        parser.add_argument('type', choices=('DEBIT', 'CREDIT'))
        args = parser.parse_args()

        # if the id was specified via url
        if id:
            account = Account.query.filter_by(id=id).first()
            if not account:
                abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(account, account_marshal), 202

        if args['name']:
            account.name = args['name']
        if args['balance']:
            # Update all related transactions
            account_diff = args['balance'] - account.balance
            for transaction in account.transactions:
                transaction.account_balance += account_diff
            account.balance = args['balance']
        if args['type']:
            account.type = args['type']

        db.session.commit()
        return marshal(account, account_marshal), 200

    def __put(self, account, args):
        if args['name']:
            account.name = args['name']
        if args['balance']:
            # Update all related transactions
            account_diff = args['balance'] - account.balance
            for transaction in account.transactions:
                transaction.account_balance += account_diff
            account.balance = args['balance']
        if args['type']:
            account.type = args['type']
        db.session.commit()

