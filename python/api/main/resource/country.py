from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.country import Country


mfields = {
    'id': fields.Integer,
    'country': fields.String
}

# TODO: state_province and country tables
class CountryApi(Resource):
    

    # TODO: what to do with related addresses?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        country = Country.query,filter_by(id=id).first()
        if not country:
            abort(404)
        db.session.delete(country)
        db.session.commit()
        return marshal(country, mfields), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            country = Country.query.filter_by(id=id).first()
            if country:
                return marshal(country, mfields), 200
            abort(404)
        return marshal(Country.query.all(), mfields), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('country', required=True)
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        country = Country.query.filter_by(country=args['country']).first()
        if country:
            return marshal(country, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        country = Country(country=args['country'])
        db.session.add(country)
        db.session.commit()
        return marshal(country, mfields), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('country')
        args = parser.parse_args()

        country = Country.query.filter_by(id=id).first()
        if not country:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(country, mfields), 202

        if args['country']:
            city.country = args['country']

        db.session.commit()
        return marshal(country, mfields), 200
