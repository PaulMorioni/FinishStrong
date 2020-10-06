from . import db

users_tasks = db.Table('users_tasks',
                       db.Column('user_id', db.Integer,
                                 db.ForeignKey('user.id')),
                       db.Column('task_id', db.Integer,
                                 db.ForeignKey('task.id'))
                       )

users_projects = db.Table('users_projects', db.Column('user_id', db.Integer,
                                                      db.ForeignKey('user.id')),
                          db.Column('project_id', db.Integer,
                                    db.ForeignKey('project.id'))
                          )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(32), unique=True)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    projects = db.relationship(
        "Project", secondary=users_projects, lazy='subquery', backref=db.backref("user"))
    tasks = db.relationship("Task", secondary=users_tasks, lazy='subquery',
                            backref=db.backref("user", lazy=True))
    organizaton_id = db.Column(db.Integer, db.ForeignKey('organization.id'))

    def __init__(self, email, password, first_name, last_name):
        self.email = email
        self.password_hash = password  # TODO add security
        self.first_name = first_name
        self.last_name = last_name


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    description = db.Column(db.String(256))
    deadline = db.Column(db.Date())
    created_on = db.Column(db.Date())
    tasks = db.relationship('Task', backref='project', lazy='dynamic')
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    description = db.Column(db.String(256))
    eta = db.Column(db.Date())
    deadline = db.Column(db.Date())
    created_on = db.Column(db.Date())
    status = db.Column(db.String(32))
    difficulty = db.Column(db.Integer())  # rating out of 10 most likely\
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
    # created_by = this will be fixed in init


class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    users = db.relationship('User', backref='organization', lazy='dynamic')
    projects = db.relationship(
        'Project', backref='organization', lazy='dynamic')
