from flask import Flask
from flask_cors import CORS
import psycopg2 as pg

app = Flask(__name__)
CORS(app)

app.config.from_json('../config.json')

db_host = app.config['DB_HOST']
db_port = app.config['DB_PORT']
db_user = app.config['DB_USER']
db_pass = app.config['DB_PASS']
db_name = app.config['DB_NAME']

conn = pg.connect(dbname=db_name, user=db_user, password=db_pass, host=db_host, port=db_port)

from project import api