from flask import Blueprint, jsonify, request, make_response
from . import db
from .models import *
from .mock_data import generate_data
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from functools import wraps
import json
from flask_restful import Resource, Api
from flask_marshmallow import Marshmallow
from .schema import *

main = Blueprint('main', __name__)
api = Api(main)
# With wrap set up, routes decorated with this wrap will require a def(current_user) argument to properly authenticate.


class UserResource(Resource):
    def get(self, user_id):
        try:
            user = User.query.filter_by(public_id=user_id).first()
            user_json = user_schema.dump(user)
            return user_json
        except:
            return 'User Not Found', 401

# TODO add other params to put to allow for changes
    def put(self, user_id):
        user = User.query.filter_by(public_id=user_id).first()
        new_user_data = request.get_json()

        if 'email' in new_user_data:
            user.email = new_user_data['email']
        elif 'firstName' in new_user_data:
            user.first_name = new_user_data['firstName']
        elif 'lastName' in new_user_data:
            user.last_name = new_user_data['lastName']

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
                            first_name=user_data['firstName'], last_name=user_data['lastName'])

            db.session.add(new_user)
            db.session.commit()

            return 'Done', 201
        except:
            return request.data, 401


class OrganizationResource(Resource):
    def get(self, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        org_json = org_schema.dump(org)
        return org_json

    def put(self, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        new_org_data = request.get_json()
        if 'name' in new_org_data:
            org.name = new_org_data['name']
        return '', 201

    def delete(self, org_id):
        org = Organization.query.filter_by(public_id=org_id).first()
        db.session.delete(org)
        db.session.commit
        return '', 204


class OrganizationsResource(Resource):
    def get(self):
        orgs = Organization.query.all()
        orgs_json = orgs_schema.dump(orgs)
        return orgs_json

    def post(self):
        try:
            org_data = request.get_json()
            new_org = Organization(name=org_data['name'])
            db.session.add(new_org)
            db.session.commit()
            return '', 201
        except:
            return '', 401
        # TODO set up relationship with creator


class ProjectResource(Resource):
    def get(self, project_id):
        project = Project.query.filter_by(public_id=project_id).first()
        proj_json = project_schema.dump(project)
        return proj_json

    def put(self, project_id):
        project = Project.query.filter_by(public_id=project_id).first()
        new_project_data = request.get_json()

        if 'name' in new_project_data:
            project.name = new_project_data['name']
        elif 'description' in new_project_data:
            project.description = new_project_data['description']
        elif 'deadline' in new_project_data:
            project.deadline = new_project_data['deadline']
        elif 'organization_id' in new_project_data:
            project.organization_id = new_project_data['organization_id']

        project.update_project()
        return 'Project Updated', 201

    def delete(self, project_id):
        project = Project.query.filter_by(public_id=project_id).first()
        db.session.delete(project)
        db.session.commit
        return '', 204


class ProjectsResource(Resource):
    def get(self):
        projects = Project.query.all()
        projs_json = projects_schema.dump(projects)
        return {"projects": projs_json}

        # TODO 'users': len(proj_users)

    def post(self):
        try:
            project_data = request.get_json()

            new_project = Project(name=project_data['name'], description=project_data['description'],
                                  deadline=project_data['deadline'])

            db.session.add(new_project)
            db.session.commit()

            return 'Done', 201
        except:
            return '', 401


class TaskResource(Resource):
    def get(self, task_id):
        task = Task.query.filter_by(public_id=task_id).first()
        task_json = task_schema.dump(task)
        return task_json

    def put(self, task_id):
        task = Task.query.filter_by(public_id=task_id).first()
        new_task_data = request.get_json()
        if 'description' in new_task_data:
            task.description = new_task_data['description']
        elif 'eta' in new_task_data:
            task.eta = new_task_data['eta']
        elif 'deadline' in new_task_data:
            task.deadline = new_task_data['deadline']
        elif 'status' in new_task_data:
            task.status = new_task_data['status']
        elif 'difficulty' in new_task_data:
            task.difficulty = new_task_data['difficulty']
        elif 'project_id' in new_task_data:
            task.project_id = new_task_data['project_id']

        task.update_task()
        db.session.commit()
        return 'Task Updated', 201

    def delete(self, task_id):
        task = Task.query.filter_by(public_id=task_id).first()
        db.session.delete(task)
        db.session.commit
        return '', 204


class TasksResource(Resource):
    def get(self):
        tasks = Task.query.all()
        tasks_json = tasks_schema.dump(tasks)
        return {"tasks": tasks_json}

    def post(self):
        try:
            task_data = request.get_json()
            # TODO on front end add project_id to JSON
            new_task = Task(name=task_data['name'], description=task_data['description'],
                            eta=task_data['eta'], deadline=task_data['deadline'], difficulty=task_data['difficulty'], project_id=task_data['project_id'])

            db.session.add(new_task)
            db.session.commit()

            return 'Done', 201
        except:
            return '', 401


# TODO Will need to add Auth functionality. Will add auth after other routes are created.
@main.route('/api/login_user', methods={'POST'})
def login():
    try:
        login_data = request.get_json

        return 'Done', 201
    except:
        return 'Failure', 201


api.add_resource(UserResource, '/api/user/<user_id>')
api.add_resource(UsersResource, '/api/user')
api.add_resource(OrganizationResource, '/api/organization/<org_id>')
api.add_resource(OrganizationsResource, '/api/organization')
api.add_resource(ProjectResource, '/api/project/<proj_id>')
api.add_resource(ProjectsResource, '/api/project')
api.add_resource(TaskResource, '/api/task/<task_id>')
api.add_resource(TasksResource, '/api/task')


@ main.route('/api/generate_data', methods={'GET'})
def make_data():

    generate_data()
    return 'Done', 201
