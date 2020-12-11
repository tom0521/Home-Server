import markdown
import os

from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from resource import Account,Transaction

app = Flask(__name__)
api = Api(app)

api.add_resource(Transaction, '/transaction', '/transaction/<int:id>')
api.add_resource(Account, '/account')

@app.route('/')
def index():
    with open(os.path.dirname(app.instance_path) + '/README.md', 'r') as readme:
        return markdown.markdown(readme.read())

if __name__ == '__main__':
    app.run(debug=True)