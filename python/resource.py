from flask import abort
from flask_restful import Resource

class Account(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

    def udpate(self, id=None):
        abort(501)

class Address(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

    def udpate(self, id=None):
        abort(501)

class Category(Resource):
    def get(self, id=None):
        abort(501)
    
    def post(self, id=None):
        if id:
            abort(404)
        abort(501)

    def udpate(self, id=None):
        abort(501)

class City(Resource):
    def get(self):
        abort(501)
    
    def post(self):
        abort(501)

    def udpate(self):
        abort(501)

class Place(Resource):
    def get(self):
        abort(501)
    
    def post(self):
        abort(501)

    def udpate(self):
        abort(501)

class Transaction(Resource):
    def get(self, id=None):
        return { 'id': id if id else 'all' }, 200

    def post(self):
        return { 'transaction': 'test' }, 201