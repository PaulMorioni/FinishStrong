from flask import Blueprint, jsonify, request
from . import db
from .models import User

main = Blueprint('main', __name__)


@main.route('/add_user', methods={'POST'})
def add_user():
    user_data = request.get_json()

    new_user = User(email=user_data['email'], password=user_data['password'],
                    first_name=user_data['firstName'], last_name=user_data['lastName'])

    db.session.add(new_user)
    db.session.commit()

    return 'Done', 201


@main.route('/users', methods={'GET'})
def users():
    users = []
    user_list = User.query.all()

    for user in user_list:
        users.append({'firstName': user.first_name,
                      'lastName': user.last_name})

    return jsonify({'users': users})
