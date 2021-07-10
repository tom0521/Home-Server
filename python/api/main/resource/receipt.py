from flask import abort,current_app,send_from_directory
from flask_restful import Resource


class ReceiptApi(Resource):

    def get(self, receipt_path):
        return send_from_directory(
            current_app.config['RECEIPT_PATH'], receipt_path
        )
