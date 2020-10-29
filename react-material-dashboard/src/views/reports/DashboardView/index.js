import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import TotalProjects from './TotalProjects';
import RecentTasks from './RecentTasks';
import LatestProjects from './LatestProjects';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalTasks from './TotalTasks';
import TasksToComplete from './TasksToComplete';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function NumberOfIncomplete(tasks) {
  const incomplete = []
  tasks.map(task => {
    if (task.status !== "completed") {
      incomplete.push(task)
    }
  });
  return incomplete.length
};

const Dashboard = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    Axios.get("http://localhost:5000/api/project").then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }); 
  }, [setProjects]);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/task").then((response) => {
      const allTasks = response.data;
      setTasks(allTasks.tasks)
    }); 
  }, [setTasks]);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProjects projects={projects}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalTasks tasks={tasks} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress tasks={tasks} NumberOfIncomplete={NumberOfIncomplete}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksToComplete tasks={tasks} NumberOfIncomplete={NumberOfIncomplete} />
          </Grid>

          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <RecentTasks tasks={tasks} />
          </Grid>

          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProjects projects={projects}/>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
