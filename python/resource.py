from flask_restful import Resource

class Account(Resource):
    def get(self):
        return { 'message': 'Not Implemented' }, 501
    
    def post(self):
        return { 'message': 'Not Implemented' }, 501

    def udpate(self):
        return { 'message': 'Not Implemented' }, 501

class Address(Resource):
    def get(self):
        return { 'message': 'Not Implemented' }, 501
    
    def post(self):
        return { 'message': 'Not Implemented' }, 501

    def udpate(self):
        return { 'message': 'Not Implemented' }, 501

class City(Resource):
    def get(self):
        return { 'message': 'Not Implemented' }, 501
    
    def post(self):
        return { 'message': 'Not Implemented' }, 501

    def udpate(self):
        return { 'message': 'Not Implemented' }, 501

class Place(Resource):
    def get(self):
        return { 'message': 'Not Implemented' }, 501
    
    def post(self):
        return { 'message': 'Not Implemented' }, 501

    def udpate(self):
        return { 'message': 'Not Implemented' }, 501

class Transaction(Resource):
    def get(self, id=None):
        return { 'id': id if id else 'all' }, 200

    def post(self):
        return { 'transaction': 'test' }, 201