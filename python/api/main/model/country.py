from .. import db


class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(50), nullable=False)
    state_provinces = db.relationship('StateProvince', backref='country', lazy=True)

    def __repr__(self):
        return f'{self.country}'
