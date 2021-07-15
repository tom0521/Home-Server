import json

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

from .. import db
from ..model.address import addresses_marshal
from ..model.place import Place,places_marshal


place_marshal = {
    **places_marshal,
    'addresses': fields.List(fields.Nested(addresses_marshal))
}

class PlaceApi(Resource):

    # TODO: what to do with related addresses?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        place = place.query,filter_by(id=id).first()
        if not place:
            abort(404)
        db.session.delete(place)
        db.session.commit()
        return marshal(place, place_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            place = Place.query.filter_by(id=id).first()
            if place:
                return marshal(place, place_marshal), 200
            abort(404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        # TODO: Remove default and allow query all
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        parser.add_argument('sort', type=lambda x: json.loads(x))
        args = parser.parse_args()

        place_query = Place.query

        if args['filter']:
            # TODO: filter only columns in the table
            if args['filter']['q']:
                place_query = place_query.filter(Place.name.like(f"%{args['filter']['q']}%"))
                del args['filter']['q']
            place_query = place_query.filter_by(**args['filter'])
        if args['sort']:
            order = desc(args['sort'][0]) if args['sort'][1] == "DESC" else args['sort'][0]
            place_query = place_query.order_by(order)

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page
        places = place_query.paginate(page,per_page, error_out=False)
 
        response = make_response(json.dumps(marshal(places.items, places_marshal)), 200)
        response.headers.extend({
            'Content-Range': 
                f"place {args['range'][0]}-{args['range'][1]}/{places.total}"
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
        place = Place.query.filter_by(name=args['name']).first()
        if place:
            return marshal(place, place_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        place = Place(name=args['name'])
        db.session.add(place)
        db.session.commit()
        return marshal(place, place_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()

        place = Place.query.filter_by(id=id).first()
        if not place:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(place, place_marshal), 202

        if args['name']:
            place.name = args['name']

        db.session.commit()
        return marshal(place, place_marshal), 200
