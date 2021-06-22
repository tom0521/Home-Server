from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.place import Place


mfields = {
    'id': fields.Integer,
    'place': fields.String
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
        return marshal(place, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            place = Place.query.filter_by(id=id).first()
            if place:
                return marshal(place, mfields), 200
            abort(404)
        return marshal(Place.query.all(), mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        place = Place.query.filter_by(place=args['place']).first()
        if place:
            return marshal(place, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        place = Place(place=args['place'])
        db.session.add(place)
        db.session.commit()
        return marshal(place, mfields), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place')
        args = parser.parse_args()

        place = Place.query.filter_by(id=id).first()
        if not place:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(place, mfields), 202

        if args['place']:
            place.place = args['place']

        db.session.commit()
        return marshal(place, mfields), 200
