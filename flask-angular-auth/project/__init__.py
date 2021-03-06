# project/__init__.py


from flask import Flask, request, jsonify, session, render_template
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from project.config import BaseConfig


# config

app = Flask(__name__)
app.config.from_object(BaseConfig)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from project.models import User

# routes

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password=json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    return jsonify({'result': status})


@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})


@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'result': True})
        else:
            return jsonify({'result' : False})
    else:
        return jsonify({'result': False})
