from flask import abort
from flask_restful import fields,marshal,reqparse,Resource

from .. import db
from ..model.address import Address,addresses_marshal
from ..model.city import City
from ..model.country import Country
from ..model.place import Place,places_marshal
from ..model.state_province import StateProvince


address_marshal = {
    **addresses_marshal,
    'place': fields.Nested(places_marshal)
}

class AddressApi(Resource): 

    # TODO: what to do with related transactions?
    def delete(self, id=None):
        # if an id was not specified, what do I delete?
        if not id:
            abort(404)

        address = Address.query,filter_by(id=id).first()
        if not address:
            abort(404)
        db.session.delete(address)
        db.session.commit()
        return marshal(address, address_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            address = Address.query.filter_by(id=id).first()
            if address:
                return marshal(address, address_marshal), 200
            abort(404)
        return marshal(Address.query.all(), addresses_marshal), 200
    
    def post(self, id=None):
        # POST requests do not allow id url
        if id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place_id', type=int, required=True)
        parser.add_argument('line_1')
        parser.add_argument('line_2')
        parser.add_argument('city')
        parser.add_argument('state_province')
        parser.add_argument('country')
        parser.add_argument('postal_code')
        parser.add_argument('phone')
        parser.add_argument('url')
        args = parser.parse_args()

        # make sure the place exists
        if Place.query.filter_by(id=args['place_id']).first() is None:
            abort(400)
        if args['city']:
            city = City.query.filter_by(name=args['city']).first()
            if not city:
                city = City(name=args['city'])
                db.session.add(city)
        if args['state_province']:
            state_province = StateProvince.query.filter_by(name=args['state_province']).first()
            if not state_province:
                state_province = StateProvince(name=args['state_province'])
                db.session.add(state_province)
        if args['country']:
            country = Country.query.filter_by(name=args['country']).first()
            if not country:
                country = Country(name=args['country'])
                db.session.add(country)

        # If the etnry already exists, return the entry with Accepted status code
        address = Address.query.filter_by(place_id=args['place_id'], line_1=args['line_1'],
                    line_2=args['line_2'], city_id=city.id, state_province_id=state_province.id,
                    country_id=country.id, postal_code=args['postal_code'], phone=args['phone'], url=args['url']).first()
        if address:
            return marshal(address, address_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        address = Address(place_id=args['place_id'], line_1=args['line_1'],
                    line_2=args['line_2'], city_id=city.id, state_province_id=state_province.id,
                    country_id=country.id, postal_code=args['postal_code'], phone=args['phone'], url=args['url']).first()
        db.session.add(address)
        db.session.commit()
        return marshal(address, address_marshal), 201

    def put(self, id=None):
        # if an id was not specified, who do I update?
        if not id:
            abort(404)

        # set the arguments for the request
        parser = reqparse.RequestParser()
        parser.add_argument('place_id', type=int)
        parser.add_argument('line_1')
        parser.add_argument('line_2')
        parser.add_argument('city')
        parser.add_argument('state_province')
        parser.add_argument('country')
        parser.add_argument('postal_code')
        parser.add_argument('phone')
        parser.add_argument('url')
        args = parser.parse_args()

        address = Address.query.filter_by(id=id).first()
        if not address:
            abort(404)

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(address, address_marshal), 202

        # TDOO: Check the foreign keys
        if args['place_id']:
            address.place_id = args['place_id']
        if args['line_1']:
            address.line_1 = args['line_1']
        if args['line_2']:
            address.line_2 = args['line_2']
        if args['city']:
            city = City.query.filter_by(name=args['city']).first()
            if not city:
                city = City(name=args['city'])
                db.session.add(city)
            address.city_id = city.id
        if args['state_province']:
            state_province = StateProvince.query.filter_by(name=args['state_province']).first()
            if not state_province:
                state_province = StateProvince(name=args['state_province'])
                db.session.add(state_province)
            address.state_province_id = state_province_id.id
        if args['country']:
            country = Country.query.filter_by(name=args['country']).first()
            if not country:
                country = Country(name=args['country'])
                db.session.add(country)
            address.country_id = country.id
        if args['postal_code']:
            address.postal_code = args['postal_code']
        if args['phone']:
            address.phone = args['phone']
        if args['url']:
            address.url = args['url']

        db.session.commit()
        return marshal(address, address_marshal), 200


class CityAddressApi(Resource):

    def get(self, city_id):
        city = City.query.filter_by(id=city_id).first()
        if city:
            return marshal(city.addresses, addresses_marshal)
        abort(404)

class PlaceAddressApi(Resource):

    def get(self, place_id):
        place = Place.query.filter_by(id=place_id).first()
        if place:
            return marshal(place.addresses, addresess_marshal)
        abort(404)
