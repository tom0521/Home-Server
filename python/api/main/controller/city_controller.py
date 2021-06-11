from flask_restful import marshal,Resource

from .. import db


mfields = {
    'id': fields.Integer,
    'city': fields.String,
    'state_province': fields.String,
    'country': fields.String
}

# TODO: state_province and country tables
class CityApi(Resource):
    

    # TODO: what to do with related addresses?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        city = City.query,filter_by(id=id).first()
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
        parser.add_argument('city', required=True)
        parser.add_argument('state_province', required=True)
        parser.add_argument('country', default="United States of America")
        args = parser.parse_args()

        # If the etnry already exists, return the entry with Accepted status code
        city = City.query.filter_by(city=args['city'], state_province=args['state_province'], country=args['country']).first()
        if city:
            return marshal(city, mfields), 202

        # Otherwise, insert the new entry and return Created status code
        city = City(city=args['city'], state_province=args['state_province'], country=args['country'])
        db.session.add(city)
        db.session.commit()
        return marshal(city, mfields), 201

    def update(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('city')
        parser.add_argument('state_province')
        parser.add_argument('country')
        args = parser.parse_args()

        city = City.query.filter_by(id=id).first()
        if not city:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(city, mfields), 202

        if args['city']:
            city.city = args['city']
        if args['state_province']:
            city.state_province = args['state_province']
        if args['country']:
            city.country = args['country']

        db.session.commit()
        return marshal(city, mfields), 200