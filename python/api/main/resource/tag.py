from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.tag import Tag


mfields = {
    'id': fields.Integer,
    'tag': fields.String
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
        return marshal(tag, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            tag = Tag.query.filter_by(id=id).first()
            if tag:
                return marshal(tag, mfields), 200
            abort(404)
        return marshal(Tag.query.all(), mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('tag', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        tag = Tag.query.filter_by(tag=args['tag']).first()
        if tag:
            return marshal(tag, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        tag = Tag(tag=args['tag'])
        db.session.add(tag)
        db.session.commit()
        return marshal(tag, mfields), 201

    def update(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('tag')
        args = parser.parse_args()

        tag = Tag.query.filter_by(id=id).first()
        if not tag:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(tag, mfields), 202

        if args['tag']:
            tag.tag = args['tag']

        db.session.commit()
        return marshal(tag, mfields), 200


class TransactionTagApi(Resource):

    def get(self, transaction_id):
        transaction = Transaction.query.filter_by(id=transaction_id).first()
        if transaction:        
            return marshal(transaction.tags, mfields), 200
        abort(404)
