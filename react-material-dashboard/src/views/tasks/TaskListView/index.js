import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import TaskForm from './TaskForm';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const TaskListView = () => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [displayTaskForm, setDisplayTaskForm] = useState(false)

  function getProjects() {
    axios.get("http://localhost:5000/api/project").then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }); 
  }

  function getTasks() {
    axios.get("http://localhost:5000/api/task").then((response) => {
      const allTasks = response.data;
      setTasks(allTasks.tasks)
    }); 
  }

  function handleDisplayForm() {
    setDisplayTaskForm(!displayTaskForm);
  };


  function handleTaskPut(task) {
    const instance = axios.create({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Content-Type': 'application/json'
      }
    });
  const json = JSON.stringify({name: task.name, description: task.description, project_id: task.project_id, deadline: task.deadline, eta: task.eta, difficulty: task.difficulty, status: task.status })
  instance.put(`http://localhost:5000/api/task/${task.public_id}`, json).then(function (response) {
    if (response.data === 'Done') {
      console.log(response)
      setDisplayTaskForm(false);
      getTasks();
    }
  })
};

  useEffect(() => {
    getProjects();
    getTasks();
  }, [setTasks]);

  return (
    <Page
      className={classes.root}
      title="My Tasks"
    >
      <Container maxWidth={false}>
      <div>
          {displayTaskForm &&
          <Box>
            <TaskForm setDisplayTaskForm={setDisplayTaskForm} getTasks={getTasks} projects={projects}/>
          </Box>
          }
        </div>
        <Toolbar handleDisplayForm={handleDisplayForm}/>
        <Box mt={3}>
          <Results tasks={tasks} setTasks={setTasks} getTasks={getTasks} handleTaskPut={handleTaskPut}/>
        </Box>
      </Container>
    </Page>
  );
};

export default TaskListView;
