from flask import Blueprint, jsonify, request
from . import db
from .models import User, Task, Project, Organization

main = Blueprint('main', __name__)


@main.route('/add_user', methods={'POST'})
def add_user():
    user_data = request.get_json()

    new_user = User(email=user_data['email'], password=user_data['password'],
                    first_name=user_data['firstName'], last_name=user_data['lastName'])

    db.session.add(new_user)
    db.session.commit()

    return 'Done', 201


@main.route('/users', methods={'GET'})  # TODO remove?
def users():
    users = []
    user_list = User.query.all()

    for user in user_list:
        users.append({'firstName': user.first_name,
                      'lastName': user.last_name})

    return jsonify({'users': users})


# TODO Will need to add Auth0 functionality and decorators. Will add auth after other routes are created.
@main.route('/login_user', methods={'POST'})
def login():
    # login_data = request.get_json

    return 'Done', 201


@main.route('/add_task', methods={'POST'})
def add_task():

    task_data = request.get_json()

    new_task = Task(name=task_data['name'], description=task_data['description'],
                    eta=task_data['eta'], deadline=task_data['deadline'], difficulty=task_data['difficulty'])

    db.session.add(new_task)
    db.session.commit()

    return 'Done', 201


@main.route('/tasks', methods={'GET'})
def get_tasks():
    tasks = []
    task_list = Task.query.all()

    for task in task_list:
        tasks.append({
            'name': task.name,
            'description': task.description,
            'eta': task.eta,
            'deadline': task.deadline,
            'created_on': task.created_on,
            'status': task.status,
            'difficulty': task.difficulty,
        })

    return jsonify({'tasks': tasks})


@main.route('/add_project', methods={'POST'})
def add_project():

    project_data = request.get_json()

    new_project = Project(name=project_data['name'], description=project_data['description'],
                          deadline=project_data['deadline'])

    db.session.add(new_project)
    db.session.commit()

    return 'Done', 201


@main.route('/add_organization', methods={'POST'})
def add_organization():

    return 'Done', 201


@main.route('/projects', methods={'GET'})
def projects():

    projects = []
    project_list = Project.query.all()

    for project in project_list:
        projects.append({
            'name': project.name,
            'description': project.description,
            'deadline': project.deadline,
            'organization_id': project.organization_id
        })

    return jsonify({'projects': projects})
