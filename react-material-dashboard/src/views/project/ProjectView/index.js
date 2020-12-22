import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import StatusTasks from './createdTasks';
import Axios from 'axios';
import Alerts from 'src/components/Alerts';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProjectView = ({params}) => {
  const classes = useStyles();
  const [project, setProject] = useState([])
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();
  const [errors, setErrors] = useState([]);

  const handleError = (message) => {
    setErrors([...errors, message])
  };

  function handleTaskStatus(queryStatus) {
    if (queryStatus === "created"){
      let returnTasks = tasks.filter(task => task.status === "created" || "Created");
      return returnTasks
    } else if ( queryStatus === "started") {
      let returnTasks = tasks.filter(task => task.status === "started");
      return returnTasks
    } else if ( queryStatus === "in progress") {
      let returnTasks = tasks.filter(task => task.status === "in progress");
      return returnTasks
    } else if ( queryStatus === "completed" || "Completed"){
      let returnTasks = tasks.filter(task => task.status === "completed");
      return returnTasks
    }
  }

  useEffect(() => {
    const jwt = window.localStorage.getItem('token');
    Axios.get("http://localhost:5000/api/project/"+ id, {
      headers: {
        'x-access-token': jwt
      }
    }).then((response) => {
      const project = response.data;
      setProject(project)
      setTasks(project.tasks)
    }).catch(err => {
      handleError(err.response.data.message); 
    }); 
  }, [setProject]);

  useEffect(() =>{
  }, [errors])

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false} >
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xl={3}
            lg={6}
            md={6}
            xs={12}
          >
            <StatusTasks status='Created' tasks={handleTaskStatus("created")}/>
          </Grid>
          <Grid
            item
            xl={3}
            lg={6}
            md={6}
            xs={12}
          >
            <StatusTasks status='Started' tasks={handleTaskStatus("started")}/>
          </Grid>
          <Grid
            item
            xl={3}
            lg={6}
            md={6}
            xs={12}
          >
            <StatusTasks status='In Progress' tasks={handleTaskStatus("in progress")}/>
          </Grid>
          <Grid
            item
            xl={3}
            lg={6}
            md={6}
            xs={12}
          >
            <StatusTasks status='Completed' tasks={handleTaskStatus("completed")}/>
          </Grid>
        </Grid>
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

export default ProjectView;
