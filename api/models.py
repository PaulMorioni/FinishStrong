from . import db
from datetime import datetime
from uuid import UUID, uuid4
from werkzeug.security import generate_password_hash, check_password_hash

users_tasks = db.Table('users_tasks',
                       db.Column('user_id', db.Integer,
                                 db.ForeignKey('user.id')),
                       db.Column('task_id', db.Integer,
                                 db.ForeignKey('task.id'))
                       )

users_projects = db.Table('users_projects',
                          db.Column('user_id', db.Integer,
                                    db.ForeignKey('user.id')),
                          db.Column('project_id', db.Integer,
                                    db.ForeignKey('project.id'))
                          )

users_orgs = db.Table('users_orgs',
                      db.Column('user_id', db.Integer,
                                db.ForeignKey('user.id')),
                      db.Column('organization_id', db.Integer,
                                db.ForeignKey('organization.id'))
                      )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(256), unique=True)
    email = db.Column(db.String(32), unique=True)
    password_hash = db.Column(db.String(128))
    token = db.Column(db.String(128))
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))

    organization = db.relationship("Organization", secondary=users_orgs, lazy='subquery',
                                   backref=db.backref("user_orgs", lazy=True))
    project = db.relationship("Project", secondary=users_projects,
                              lazy='subquery', backref=db.backref("user_projects", lazy=True))
    task = db.relationship("Task", secondary=users_tasks,
                           lazy='subquery', backref=db.backref("user_tasks", lazy=True))

    def __init__(self, email, password_hash, first_name, last_name):
        self.public_id = str(uuid4())
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name

    def assign_task(self, task):
        self.task.append(task)
        db.session.commit()

    def unassign_task(self, task):
        self.task.remove(task)
        db.session.commit()

    def assign_project(self, project):
        self.project.append(project)
        db.session.commit()

    def unassign_project(self, project):
        self.project.remove(project)
        db.session.commit()

    def assign_org(self, organization):
        self.organization.append(organization)
        db.session.commit()

    def unassign_org(self, organization):
        self.organization.remove(organization)
        db.session.commit()


class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(32))

    def __init__(self, name):
        self.public_id = str(uuid4())
        self.name = name


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(256), unique=True)
    name = db.Column(db.String(32))
    description = db.Column(db.String(256))
    deadline = db.Column(db.Date())
    created_on = db.Column(db.Date())
    last_updated = db.Column(db.Date())

    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))

    def __init__(self, name, description, deadline):
        self.public_id = str(uuid4())
        self.name = name
        self.description = description
        self.deadline = deadline
        self.created_on = datetime.today()

    def update_project(self):
        self.last_updated = datetime.utcnow()


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(256), unique=True)
    name = db.Column(db.String(32))
    description = db.Column(db.String(256))
    eta = db.Column(db.Date())
    deadline = db.Column(db.Date())
    created_on = db.Column(db.Date())
    last_updated = db.Column(db.Date())
    status = db.Column(db.String(32))
    difficulty = db.Column(db.Integer())  # rating out of 10 most likely\
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))

    def __init__(self, name, description, eta, deadline, difficulty, project_id):
        self.public_id = str(uuid4())
        self.name = name
        self.description = description
        self.eta = str(eta)
        self.deadline = str(deadline)
        self.difficulty = difficulty
        self.created_on = datetime.now()
        self.status = "Created"
        self.project_id = project_id

    def update_task(self):
        self.last_updated = datetime.utcnow()
