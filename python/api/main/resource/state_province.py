from flask import abort
from flask_restful import marshal,reqparse,Resource

from .. import db
from ..model.country import Country
from ..model.state_province import StateProvince,state_province_marshal


class StateProvinceApi(Resource):

    # TODO: what to do with related addresses?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        state_province = StateProvince.query.filter_by(id=id).first()
        if not state_province:
            abort(404)
        db.session.delete(state_province)
        db.session.commit()
        return marshal(state_province, state_province_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            state_province = StateProvince.query.filter_by(id=id).first()
            if state_province:
                return marshal(state_province, state_province_marshal), 200
            abort(404)
        return marshal(StateProvince.query.all(), state_province_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        state_province = StateProvince.query.filter_by(name=args['name']).first()
        if state_province:
            return marshal(state_province, state_province_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        state_province = StateProvince(name=args['name'])
        db.session.add(state_province)
        db.session.commit()
        return marshal(state_province, state_province_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()

        state_province = StateProvince.query.filter_by(id=id).first()
        if not state_province:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(state_province, state_province_marshal), 202

        if args['name']:
            state_province.name = args['name']

        db.session.commit()
        return marshal(state_province, state_province_marshal), 200
