import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import TaskListView from 'src/views/tasks/TaskListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProjectListView from 'src/views/projects/ProjectListView';
import RegisterView from 'src/views/auth/RegisterView';
import OrgListView from 'src/views/organizatons/OrgListView';
import ProjectView from 'src/views/project/ProjectView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'tasks', element: <TaskListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'project/:id', element: <ProjectView/> },
      { path: 'projects', element: <ProjectListView /> },
      { path: 'organizations', element: <OrgListView/> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
