from .. import db


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    addresses = db.relationship('Address', backref='place', lazy=True)

    def __repr__(self):
        return f'{self.name}'
