from flask import abort
from flask_restful import marshal,reqparse,Resource

from .. import db
from ..model.category import Category,category_marshal


class CategoryApi(Resource):

    # TODO: what to do with related transactions?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        category = Category.query,filter_by(id=id).first()
        if not category:
            abort(404)
        db.session.delete(category)
        db.session.commit()
        return marshal(category, category_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            category = Category.query.filter_by(id=id).first()
            if category:
                return marshal(category, category_marshal), 200
            abort(404)
        return marshal(Category.query.all(), category_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        category = Category.query.filter_by(name=args['name']).first()
        if category:
            return marshal(category, category_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        category = Category(name=args['name'])
        db.session.add(category)
        db.session.commit()
        return marshal(category, category_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()

        category = Category.query.filter_by(id=id).first()
        if not category:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(category, category_marshal), 202

        if args['name']:
            category.name = args['name']

        db.session.commit()
        return marshal(category, category_marshal), 200
