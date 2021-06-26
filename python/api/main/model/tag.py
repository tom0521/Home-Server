from flask_restful import fields

from .. import db


tag_marshal = {
    'id': fields.Integer,
    'name': fields.String
}

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'{self.name}'
