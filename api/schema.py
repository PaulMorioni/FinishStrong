from api import ma
from api.models import User
from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int()
    public_id = fields.Str()
    email = fields.Email()
    password_hash = fields.Str()
    token = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class OrganizationSchema(Schema):
    id = fields.Int()
    public_id = fields.Str()
    name = fields.Str()


org_schema = OrganizationSchema()
orgs_schema = OrganizationSchema(many=True)


class ProjectSchema(Schema):
    id = fields.Int()
    public_id = fields.Str()
    name = fields.Str()
    description = fields.Str()
    deadline = fields.DateTime()
    created_on = fields.DateTime()
    last_updated = fields.DateTime()


project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)


class TaskSchema(Schema):
    id = fields.Int()
    public_id = fields.Str()
    name = fields.Str()
    description = fields.Str()
    eta = fields.DateTime()
    deadline = fields.DateTime()
    created_on = fields.DateTime()
    last_updated = fields.DateTime()
    status = fields.Str()
    difficulty = fields.Int()
    project_id = fields.Int()


task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)
