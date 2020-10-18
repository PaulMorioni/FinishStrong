from flask import Blueprint, jsonify, request
from . import db
from .models import User, Task, Project, Organization
from .mock_data import generate_data

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


# TODO Will need to add Auth functionality. Will add auth after other routes are created.
@main.route('/login_user', methods={'POST'})
def login():
    # login_data = request.get_json

    return 'Done', 201


@main.route('/api/add_task', methods={'POST'})
def add_task():

    task_data = request.get_json()
    # TODO on front end add project_id to JSON
    new_task = Task(name=task_data['name'], description=task_data['description'],
                    eta=task_data['eta'], deadline=task_data['deadline'], difficulty=task_data['difficulty'], project_id=task_data['project_id'])

    db.session.add(new_task)
    db.session.commit()

    return 'Done', 201


@main.route('/api/tasks', methods={'GET'})
def get_tasks():
    tasks = []
    task_list = Task.query.all()

    for task in task_list:
        project = Project.query.filter_by(id=task.project_id).first()
        tasks.append({
            'name': task.name,
            'description': task.description,
            'eta': task.eta,
            'deadline': task.deadline,
            'createdOn': task.created_on,
            'lastUpdated': task.last_updated,
            'status': task.status,
            'difficulty': task.difficulty,
            'projectName': project.name
        })

    return jsonify({'tasks': tasks})


@main.route('/api/add_project', methods={'POST'})
def add_project():

    project_data = request.get_json()

    new_project = Project(name=project_data['name'], description=project_data['description'],
                          deadline=project_data['deadline'])

    db.session.add(new_project)
    db.session.commit()

    return 'Done', 201


@main.route('/api/add_organization', methods={'POST'})
def add_organization():

    return 'Done', 201


@main.route('/api/projects', methods={'GET'})
def projects():

    projects = []
    project_list = Project.query.all()
    users = User.query.all()

    for project in project_list:
        proj_users = []
        for user in users:
            if project in user.project:
                proj_users.append(user)

        projects.append({
            'name': project.name,
            'description': project.description,
            'deadline': project.deadline,
            'organization_id': project.organization_id,
            'createdOn': project.created_on,
            'lastUpdated': project.last_updated,
            'users': len(proj_users)
        })

    return jsonify({'projects': projects})


@main.route('/api/generate_data', methods={'GET'})
def make_data():

    generate_data()
    return 'Done', 201
