from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.city import City
from ..model.state_province import StateProvince


mfields = {
    'id': fields.Integer,
    'name': fields.String,
    'state_province_id': fields.Integer
}

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
        return marshal(city, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            city = City.query.filter_by(id=id).first()
            if city:
                return marshal(city, mfields), 200
            abort(404)
        return marshal(City.query.all(), mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('state_province_id', type=int, required=True)
        args = parser.parse_args()

        # if the foreign id does not exist then abort
        if StateProvince.query.filter_by(id=args['state_province_id']).first() is None:
            abort(400)

        # If the etnry already exists, return the entry with Accepted status code
        city = City.query.filter_by(name=args['name'], state_province_id=args['state_province_id']).first()

        if city:
            return marshal(city, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        city = City(name=args['name'], state_province_id=args['state_province_id'])
        db.session.add(city)
        db.session.commit()
        return marshal(city, mfields), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('state_province_id')
        args = parser.parse_args()

        city = City.query.filter_by(id=id).first()
        if not city:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(city, mfields), 202

        if args['state_province_id']:
            # if the foreign id does not exist then abort
            if StateProvince.query.filter_by(id=args['state_province_id']).first() is None:
                abort(400)
            city.state_province_id = args['state_province_id']
        if args['name']:
            city.name = args['name']

        db.session.commit()
        return marshal(city, mfields), 200
