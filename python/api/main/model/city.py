from .. import db


# TODO: state_province and country tables
class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    state_province = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    addresses = db.relationship('Address', backref='city', lazy=True)

    def __repr__(self):
        return f'{self.city}, {self.state}'