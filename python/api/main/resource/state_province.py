from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.country import Country
from ..model.state_province import StateProvince


mfields = {
    'id': fields.Integer,
    'state_province': fields.String,
    'country_id': fields.Integer
}

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
        return marshal(state_province, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            state_province = StateProvince.query.filter_by(id=id).first()
            if state_province:
                return marshal(state_province, mfields), 200
            abort(404)
        return marshal(StateProvince.query.all(), mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('state_province', required=True)
        parser.add_argument('country_id', type=int, required=True)
        args = parser.parse_args()

        # If the foreign id does not exist then abort
        if Country.query.filter_by(id=args['country_id']).first() is None:
            abort(400)

        # If the etnry already exists, return the entry with Accepted status code
        state_province = StateProvince.query.filter_by(state_province=args['state_province'], country_id=args['country_id']).first()
        if state_province:
            return marshal(state_province, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        state_province = StateProvince(state_province=args['state_province'], country_id=args['country_id'])
        db.session.add(state_province)
        db.session.commit()
        return marshal(state_province, mfields), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('state_province')
        parser.add_argument('country_id')
        args = parser.parse_args()

        state_province = StateProvince.query.filter_by(id=id).first()
        if not state_province:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(state_province, mfields), 202

        if args['country_id']:
            # if the foreign id does not exist then abort
            if Country.query.filter_by(id=args['country_id']).first() is None:
                abort(400)
            state_province.country_id = args['country_id']
        if args['state_province']:
            state_province.state_province = args['state_province']

        db.session.commit()
        return marshal(state_province, mfields), 200
