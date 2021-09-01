import json

from flask import abort,make_response
from flask_restful import fields,marshal,reqparse,Resource

from sqlalchemy import desc

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

    def delete(self, id=None):
        # if the id is specified via url
        if id:
            address = Address.query.filter_by(id=id).first()
            if address:
                db.session.delete(address)
                db.session.commit()
                return marshal(address, address_marshal), 200
            abort(404)

        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x), location='args')
        args = parser.parse_args()

        addresses = Address.query.filter(
                    Address.id.in_(args['filter'].get('id',[]))).all()
        for address in addresses:
            db.session.delete(address)
            db.session.commit()

        return marshal(addresses, addresses_marshal), 200

    def get(self, id=None):
        # if the id was specified, try to query it
        if id:
            address = Address.query.filter_by(id=id).first()
            if address:
                return marshal(address, address_marshal), 200
            abort(404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('filter', type=lambda x: json.loads(x))
        # TODO: Remove default and allow query all
        parser.add_argument('range', type=lambda x: json.loads(x), default=[0,99])
        parser.add_argument('sort', type=lambda x: json.loads(x))
        args = parser.parse_args()

        address_query = Address.query

        if args['filter']:
            # TODO: filter only columns in the table
            if args['filter'].get('q'):
                address_query = address_query.filter(Address.line_1.like(f"%{args['filter']['q']}%"))
                del args['filter']['q']
            if isinstance(args['filter'].get('id'), list):
                address_query = address_query.filter(Address.id.in_(args['filter']['id']))
                del args['filter']['id']
            address_query = address_query.filter_by(**args['filter'])
        if args['sort']:
            order = desc(args['sort'][0]) if args['sort'][1] == "DESC" else args['sort'][0]
            address_query = address_query.order_by(order)

        per_page = args['range'][1] - args['range'][0] + 1
        page = args['range'][0] // per_page + 1
        addresses = address_query.paginate(page=page, per_page=per_page, error_out=False)
 
        response = make_response(json.dumps(marshal(addresses.items, address_marshal)), 200)
        response.headers.extend({
            'Content-Range': 
                f"address {args['range'][0]}-{args['range'][1]}/{addresses.total}"
        })
        return response
    
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
 
        city_id = None
        state_province_id = None
        country_id = None

        # make sure the place exists
        if Place.query.filter_by(id=args['place_id']).first() is None:
            abort(400)
        if args['city']:
            city = City.query.filter_by(name=args['city']).first()
            if not city:
                city = City(name=args['city'])
                db.session.add(city)
                db.session.commit()
            city_id = city.id
        if args['state_province']:
            state_province = StateProvince.query.filter_by(name=args['state_province']).first()
            if not state_province:
                state_province = StateProvince(name=args['state_province'])
                db.session.add(state_province)
                db.session.commit()
            state_province_id = state_province.id
        if args['country']:
            country = Country.query.filter_by(name=args['country']).first()
            if not country:
                country = Country(name=args['country'])
                db.session.add(country)
                db.session.commit()
            country_id = country.id

        # If the etnry already exists, return the entry with Accepted status code
        address = Address.query.filter_by(place_id=args['place_id'], line_1=args['line_1'],
                    line_2=args['line_2'], city_id=city_id, state_province_id=state_province_id,
                    country_id=country_id, postal_code=args['postal_code'], phone=args['phone'], url=args['url']).first()
        if address:
            return marshal(address, address_marshal), 202

        # Otherwise, insert the new entry and return Created status code
        address = Address(place_id=args['place_id'], line_1=args['line_1'],
                    line_2=args['line_2'], city_id=city_id, state_province_id=state_province_id,
                    country_id=country_id, postal_code=args['postal_code'], phone=args['phone'], url=args['url'])
        db.session.add(address)
        db.session.commit()
        return marshal(address, address_marshal), 201

    def put(self, id=None):
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

        # if the id was specified via url
        if id:
            if args['filter']:
                del args['filter']
            address = Address.query.filter_by(id=id).first()
            if not address:
                abort(404)
        else:
            if not args['filter'] or not isinstance(args['filter'].get('id'), list):
                abort(400)
            addresses = Address.query.filter(Address.id.in_(args['filter']['id'])).all()
            del args['filter']

        # if the request has no arguments then there is nothing to update
        if len(args) == 0:
            return marshal(address if id else addresses, address_marshal), 202

        for row in ([address] if id else addresses):
            # TDOO: Check the foreign keys
            if args['place_id']:
                row.place_id = args['place_id']
            if args['line_1']:
                row.line_1 = args['line_1']
            if args['line_2']:
                row.line_2 = args['line_2']
            if args['city']:
                city = City.query.filter_by(name=args['city']).first()
                if not city:
                    city = City(name=args['city'])
                    db.session.add(city)
                    db.session.commit()
                row.city_id = city.id
            if args['state_province']:
                state_province = StateProvince.query.filter_by(name=args['state_province']).first()
                if not state_province:
                    state_province = StateProvince(name=args['state_province'])
                    db.session.add(state_province)
                    db.session.commit()
                row.state_province_id = state_province.id
            if args['country']:
                country = Country.query.filter_by(name=args['country']).first()
                if not country:
                    country = Country(name=args['country'])
                    db.session.add(country)
                    db.session.commit()
                row.country_id = country.id
            if args['postal_code']:
                row.postal_code = args['postal_code']
            if args['phone']:
                row.phone = args['phone']
            if args['url']:
                row.url = args['url']
            db.session.commit()

        return marshal(address if id else addresses, address_marshal), 200
