from flask import abort
from flask_restful import marshal,reqparse,Resource

from .. import db
from ..model.city import City,cities_marshal
from ..model.state_province import StateProvince


class CityApi(Resource):

    # TODO: what to do with related addresses?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        city = City.query.filter_by(id=id).first()
        if not city:
            abort(404)
        db.session.delete(city)
        db.session.commit()
        return marshal(city, cities_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            city = City.query.filter_by(id=id).first()
            if city:
                return marshal(city, cities_marshal), 200
            abort(404)
        return marshal(City.query.all(), cities_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        city = City.query.filter_by(name=args['name']).first()

        if city:
            return marshal(city, cities_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        city = City(name=args['name'])
        db.session.add(city)
        db.session.commit()
        return marshal(city, cities_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()

        city = City.query.filter_by(id=id).first()
        if not city:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(city, cities_marshal), 202

        if args['name']:
            city.name = args['name']

        db.session.commit()
        return marshal(city, cities_marshal), 200
