import json

from flask import abort
from flask_restful import marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.tag import Tag,tags_marshal
from ..model.transaction import Transaction


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
        return marshal(tag, tags_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            tag = Tag.query.filter_by(id=id).first()
            if tag:
                return marshal(tag, tags_marshal), 200
            abort(404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        # TODO: Remove default and allow query all
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        parser.add_argument('sort', type=lambda x: json.loads(x))
        args = parser.parse_args()

        tag_query = Tag.query

        if args['filter']:
            # TODO: filter only columns in the table
            tag_query = tag_query.filter_by(**args['filter'])
        if args['sort']:
            order = desc(args['sort'][0]) if args['sort'][1] == "DESC" else args['sort'][0]
            tag_query = tag_query.order_by(order)

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page
        tags = tag_query.paginate(page,per_page, error_out=False)
 
        response = make_response(json.dumps(marshal(tags.items, tags_marshal)), 200)
        response.headers.extend({
            'Content-Range': 
                f"tag {args['range'][0]}-{args['range'][1]}/{tags.total}"
        })
        return response
    
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
            return marshal(tag, tags_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        tag = Tag(name=args['name'])
        db.session.add(tag)
        db.session.commit()
        return marshal(tag, tags_marshal), 201

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
            return marshal(tag, tags_marshal), 202

        if args['name']:
            tag.name = args['name']

        db.session.commit()
        return marshal(tag, tags_marshal), 200


class TransactionTagApi(Resource):

    def get(self, transaction_id):
        transaction = Transaction.query.filter_by(id=transaction_id).first()
        if transaction:        
            return marshal(transaction.tags, tags_marshal), 200
        abort(404)
