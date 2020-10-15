import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
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

  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((response) => {
      const allTasks = response.data;
      console.log(allTasks.tasks)
      setTasks(allTasks.tasks)
    }); 
  }, [setTasks]);

  return (
    <Page
      className={classes.root}
      title="My Tasks"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results tasks={tasks} />
        </Box>
      </Container>
    </Page>
  );
};

export default TaskListView;
