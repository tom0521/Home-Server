import markdown
import os

from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from resource import Account,Address,Category

app = Flask(__name__)
api = Api(app)

api.add_resource(Account, '/account', '/account/<int:id>')
api.add_resource(Address, '/address', '/address/<int:id>')
api.add_resource(Category, '/category', '/category/<int:id>')

@app.route('/')
def index():
    with open(os.path.dirname(app.instance_path) + '/README.md', 'r') as readme:
        return markdown.markdown(readme.read())

if __name__ == '__main__':
    app.run(debug=True)