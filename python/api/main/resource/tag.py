from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.tag import Tag
from ..model.transaction import Transaction


tag_marshal = {
    'id': fields.Integer,
    'name': fields.String
}

class TagApi(Resource):

    # TODO: what to do with transaction_tag entries?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        tag = Tag.query,filter_by(id=id).first()
        if not tag:
            abort(404)
        db.session.delete(tag)
        db.session.commit()
        return marshal(tag, tag_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            tag = Tag.query.filter_by(id=id).first()
            if tag:
                return marshal(tag, tag_marshal), 200
            abort(404)
        return marshal(Tag.query.all(), tag_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        tag = Tag.query.filter_by(name=args['name']).first()
        if tag:
            return marshal(tag, tag_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        tag = Tag(name=args['name'])
        db.session.add(tag)
        db.session.commit()
        return marshal(tag, tag_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()

        tag = Tag.query.filter_by(id=id).first()
        if not tag:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(tag, tag_marshal), 202

        if args['name']:
            tag.name = args['name']

        db.session.commit()
        return marshal(tag, tag_marshal), 200


class TransactionTagApi(Resource):

    def get(self, transaction_id):
        transaction = Transaction.query.filter_by(id=transaction_id).first()
        if transaction:        
            return marshal(transaction.tags, tag_marshal), 200
        abort(404)
