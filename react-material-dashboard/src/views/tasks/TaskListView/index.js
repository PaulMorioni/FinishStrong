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
import EditTaskForm from './EditTaskForm';
import Axios from 'axios'
import Alerts from 'src/components/Alerts';


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
  const [isEdit, setIsEdit] = useState({edit: false, task: null});
  const [buttonText, setButtonText] = useState('Add Task')
  const [errors, setErrors] = useState([]);

  const handleError = (message) => {
    setErrors([...errors, message])
  };

  const jwt = window.localStorage.getItem('token');
  const instance = Axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      'Content-Type': 'application/json',
      'x-access-token': jwt
    }
  });

  function getProjects() {
    Axios.get("http://localhost:5000/api/project", {
      headers: {
        'x-access-token': jwt
      }
    }).then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }).catch(err => {
      handleError(err.response.data.message); 
    });
  }

  function getTasks() {
    Axios.get("http://localhost:5000/api/task", {
      headers: {
        'x-access-token': jwt
      }
    }).then((response) => {
      const allTasks = response.data;
      setTasks(allTasks.tasks)
    }).catch(err => {
      handleError(err.response.data.message); 
    });
  }

  function handleDisplayForm() {
    if(displayTaskForm || isEdit.edit){
      closeForms()
    } else {
      setDisplayTaskForm(!displayTaskForm);
    }
  };

  function handleEdit(task){
    setIsEdit({edit: true, task: task});
    setDisplayTaskForm(false);
  };

  function removeEditInfo() {
    setIsEdit({edit: false, task: null})
    setButtonText('Cancel')
  };

  function closeForms() {
    removeEditInfo();
    setDisplayTaskForm(false);
  };

  function handleButtonText() {
    if(displayTaskForm || isEdit.edit){
      setButtonText('Cancel')
    } else {
      setButtonText('Add Task')
    }
  };

  function submitTaskForm(values, deadline, eta, difficulty) {
    const json = JSON.stringify({name: values.name, description: values.description, project_id: values.project, deadline: deadline, eta: eta, difficulty: difficulty})
    instance.post("http://localhost:5000/api/task", json).then(function (response) {
      if (response.status === 201) {
        setDisplayTaskForm(false);
        getTasks();
      }
    }).catch(err => {
      handleError(err.response.data.message); 
    });
  };

  function submitEditTaskForm(values, deadline, eta, difficulty) {
    const json = JSON.stringify({name: values.name, description: values.description, project_id: values.project, deadline: deadline, eta: eta, difficulty: difficulty})
    instance.put(`http://localhost:5000/api/task/${values.id}`, json).then(function (response) {
      if (response.status === 200) {
        closeForms();
        getTasks();
      }
    }).catch(err => {
      handleError(err.response.data.message); 
    });
  };

  function handleStatusChange(task) {
    const json = JSON.stringify({name: task.name, description: task.description, project_id: task.project_id, deadline: task.deadline, eta: task.eta, difficulty: task.difficulty, status: task.status })
    instance.put(`http://localhost:5000/api/task/${task.public_id}`, json).then(function (response) {
      if (response.status === 200) {
        setDisplayTaskForm(false);
        getTasks();
      }
  }).catch(err => {
    handleError(err.response.data.message); 
  });
};

  useEffect(() => {
    getProjects();
    getTasks();
  }, [setTasks]);

  useEffect(() => {
    handleButtonText();
  });

  useEffect(() =>{
  }, [errors])

  return (
    <Page
      className={classes.root}
      title="My Tasks"
    >
      <Container maxWidth={false}>
      <div>
          {displayTaskForm &&
          <Box>
            <TaskForm submitTaskForm={submitTaskForm} projects={projects}/>
          </Box>
          }
        </div>
        <div>
          {isEdit.edit &&
          <Box>
            <EditTaskForm submitEditTaskForm={submitEditTaskForm} task={isEdit.task} projects={projects}/>
          </Box>
          }
        </div>
        <Toolbar handleDisplayForm={handleDisplayForm} buttonText={buttonText}/>
        <Box mt={3}>
          <Results tasks={tasks} handleEdit={handleEdit} handleStatusChange={handleStatusChange}/>
        </Box>
      </Container>
      {errors.length > 0 &&
         errors.map((error) => (
           <div>
              <Alerts text={error} type={"error"}/>
          </div>
               ))};
    </Page>
  );
};

export default TaskListView;
