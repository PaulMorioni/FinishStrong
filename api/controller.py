from flask import Blueprint, jsonify, request, make_response, session
from . import db
from .models import *
from .mock_data import generate_data
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
import json
from flask_restful import Resource, Api
from flask_marshmallow import Marshmallow
from .schema import *
import jwt
import os

main = Blueprint('main', __name__)
api = Api(main)
SECRET_KEY = os.environ.get("SECRET_KEY")


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return make_response(jsonify({'message': 'Token is missing!'}), 401)

        try:
            data = jwt.decode(token, SECRET_KEY)
            current_user = User.query.filter_by(
                public_id=data['public_id']).first()
        except:
            return make_response(jsonify({'message': 'Token is invalid!'}), 401)

        return f(current_user, *args, **kwargs)

    return wrapper


class UserResource(Resource):
    def get(self, user_id):
        try:
            user = User.query.filter_by(public_id=user_id).first()
            s_user = SensitiveUser(
                user.public_id, user.email, user.first_name, user.last_name)
            user_json = sensitive_user_schema.dump(s_user)
            return {'user': user_json}
        except:
            return 'User Not Found', 401

    def put(self, user_id):
        user = User.query.filter_by(public_id=user_id).first()
        new_user_data = request.get_json()

        if 'email' in new_user_data:
            user.email = new_user_data['email']
        if 'first_name' in new_user_data:
            user.first_name = new_user_data['first_name']
        if 'last_name' in new_user_data:
            user.last_name = new_user_data['last_name']

        return '', 201

    def delete(self, user_id):
        user = User.query.filter_by(public_id=user_id).first()
        db.session.delete(user)
        db.session.commit()
        return '', 204


class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        users_json = users_schema.dump(users)
        return users_json

    def post(self):
        try:
            user_data = request.get_json()
            password_hash = generate_password_hash(user_data['password'])
            new_user = User(email=user_data['email'], password_hash=password_hash,
                            first_name=user_data['first_name'], last_name=user_data['last_name'])

            db.session.add(new_user)
            db.session.commit()

            return 'Done', 201
        except:
            return 'Failure', 401


class OrganizationResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        if org in current_user.organization:
            org_json = org_schema.dump(org)
            return org_json
        else:
            return 'Not Authorized'

    def put(self, current_user, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        new_org_data = request.get_json()
        if 'name' in new_org_data:
            org.name = new_org_data['name']
        return '', 201

    def delete(self, current_user, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        db.session.delete(org)
        db.session.commit()
        return '', 204


class OrganizationsResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user):
        orgs = current_user.organization
        orgs_json = orgs_schema.dump(orgs)
        return {'organizations': orgs_json}

    def post(self, current_user):
        try:
            org_data = request.get_json()
            new_org = Organization(name=org_data['name'])
            db.session.add(new_org)
            current_user.assign_org(new_org)
            db.session.commit()
            return 'Done', 201
        except:
            return '', 500


class ProjectResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user, project_id):
        project = Project.query.filter_by(public_id=project_id).first()
        proj_json = project_schema.dump(project)
        return proj_json

    def put(self, current_user, project_id):
        try:
            project = Project.query.filter_by(public_id=project_id).first()
            new_project_data = request.get_json()

            if 'name' in new_project_data:
                project.name = new_project_data['name']
            if 'description' in new_project_data:
                project.description = new_project_data['description']
            if 'deadline' in new_project_data:
                project.deadline = new_project_data['deadline']
            if 'organization_id' in new_project_data:
                project.organization_id = new_project_data['organization_id']

            project.update_project()
            db.session.commit()
            return 'Done', 201
        except:
            return 'Failure', 401

    def delete(self, current_user, project_id):
        try:
            project = Project.query.filter_by(public_id=project_id).first()
            db.session.delete(project)
            db.session.commit()
            return 'Done', 204
        except:
            return 'Failure', 401


class ProjectsResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user):
        projects = current_user.project
        projs_json = projects_schema.dump(projects)
        return {"projects": projs_json}

    def post(self, current_user):
        try:
            project_data = request.get_json()

            new_project = Project(name=project_data['name'], description=project_data['description'],
                                  deadline=project_data['deadline'])

            organization_public_id = project_data['organization']
            organization = Organization.query.filter_by(
                public_id=organization_public_id).first()
            db.session.add(new_project)
            new_project.assign_org(organization)
            current_user.assign_project(new_project)
            db.session.commit()
            return 'Done', 201
        except:
            return 'Failure', 401


class TaskResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user, task_id):
        task = Task.query.filter_by(public_id=task_id).first()
        task_json = task_schema.dump(task)
        return task_json

    def put(self, current_user, task_id):
        try:
            task = Task.query.filter_by(public_id=task_id).first()
            new_task_data = request.json
            if 'description' in new_task_data:
                task.description = str(new_task_data['description'])
            if 'eta' in new_task_data:
                task.eta = new_task_data['eta']
            if 'deadline' in new_task_data:
                task.deadline = new_task_data['deadline']
            if 'status' in new_task_data:
                task.status = str(new_task_data["status"])
            if 'difficulty' in new_task_data:
                task.difficulty = new_task_data['difficulty']
            if 'project_id' in new_task_data:
                task.project_id = new_task_data['project_id']

            task.update_task()
            db.session.commit()

            return 'Done', 201
        except:
            return 'Failure', 401

    def delete(self, current_user, task_id):
        task = Task.query.filter_by(public_id=task_id).first()
        db.session.delete(task)
        db.session.commit()
        return '', 204


class TasksResource(Resource):
    method_decorators = [token_required]

    def get(self, current_user):
        tasks = current_user.task
        tasks_json = tasks_schema.dump(tasks)
        return {'tasks': tasks_json}

    def post(self, current_user):
        try:
            task_data = request.get_json()
            project_id = task_data['project_id']
            project = Project.query.filter_by(id=project_id).first()

            new_task = Task(name=task_data['name'], description=task_data['description'],
                            eta=task_data['eta'], deadline=task_data['deadline'], difficulty=task_data['difficulty'], project_id=project.id)
            db.session.add(new_task)
            current_user.assign_task(new_task)
            db.session.commit()
            return 'Done', 201
        except:
            return '', 401


# TODO Will need to add Auth functionality. Will add auth after other routes are created.


@main.route('/api/login_user', methods={'POST'})
def login():

    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    user = User.query.filter_by(email=auth.username).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    if check_password_hash(user.password_hash, auth.password):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.utcnow(
        ) + timedelta(minutes=30)}, SECRET_KEY)

        return jsonify({'token': token.decode('UTF-8'), 'user_id': user.public_id}), 201

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})


api.add_resource(UserResource, '/api/user/<user_id>')
api.add_resource(UsersResource, '/api/user')
api.add_resource(OrganizationResource, '/api/organization/<org_id>')
api.add_resource(OrganizationsResource, '/api/organization')
api.add_resource(ProjectResource, '/api/project/<project_id>')
api.add_resource(ProjectsResource, '/api/project')
api.add_resource(TaskResource, '/api/task/<task_id>')
api.add_resource(TasksResource, '/api/task')


@main.route('/api/test', methods={'GET'})
def test():
    task = Task.query.get(1)
    task.status = 'started'
    db.session.commit()
    return 'Done', 201


@ main.route('/api/generate_data', methods={'GET'})
def make_data():

    generate_data()
    return 'Done', 201
