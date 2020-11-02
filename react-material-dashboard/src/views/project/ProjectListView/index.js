import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Divider
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm'
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  projectCard: {
    height: '100%'
  }
}));

const ProjectList = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [displayProjectForm, setDisplayProjectForm] = useState(false)
  const [orgs, setOrgs] = useState([]);

  function getOrgs() {
    Axios.get("http://localhost:5000/api/organization").then((response) => {
      const allOrgs = response.data;
      setOrgs(allOrgs.organizations)
    }); 
  }

  function handleDisplayForm() {
    setDisplayProjectForm(!displayProjectForm);
  };

  function getProjects() {
    Axios.get("http://localhost:5000/api/project").then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }); 
  }

  useEffect(() => {
    getProjects()
    getOrgs()
  }, [setProjects]);


  return (
    <Page
      className={classes.root}
      title="Projects"
    >

      <Container maxWidth={false}>
        <div>
          {displayProjectForm &&
          <Box>
            <ProjectForm setDisplayProjectForm={setDisplayProjectForm} getProjects={getProjects} orgs={orgs}/>
          </Box>
          }
        </div>

        <Toolbar handleDisplayForm={handleDisplayForm}/>
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {projects.map((project) => (
              <Grid
                item
                key={project.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProjectCard
                  className={classes.projectCard}
                  project={project}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ProjectList;
