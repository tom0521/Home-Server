from .. import db


class StateProvince(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    addresses = db.relationship('Address', backref='state_province', lazy=True)

    def __repr__(self):
        return f'{self.name}'
