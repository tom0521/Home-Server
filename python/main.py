import markdown
import os

from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

import resource

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account = db.Column(db.String(50), unique=True, nullable=False)
    balance = db.Column(db.Float, server_default='0')
    
    def __repr__(self):
        return '%r - $%.2f' % (self.account, self.balance)

api.add_resource(resource.Account, '/account', '/account/<int:id>')
api.add_resource(resource.Address, '/address', '/address/<int:id>')
api.add_resource(resource.Category, '/category', '/category/<int:id>')

@app.route('/')
def index():
    with open(os.path.dirname(app.instance_path) + '/README.md', 'r') as readme:
        return markdown.markdown(readme.read())

if __name__ == '__main__':
    app.run(debug=True)