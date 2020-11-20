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
import ProjectForm from './ProjectForm';
import EditProjectForm from './EditProjectForm';
import Axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState({edit: false, project: null});
  const [buttonText, setButtonText] = useState('Add Project')
  const instance = Axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      'Content-Type': 'application/json'
    }
  });

  function removeEditInfo() {
    setIsEdit({edit: false, project: null})
    setButtonText('Cancel')
  };

  function closeForms() {
    removeEditInfo();
    setDisplayProjectForm(false);
  };

  function getProjects() {
    Axios.get("http://localhost:5000/api/project").then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }); 
  }

  function getOrgs() {
    Axios.get("http://localhost:5000/api/organization").then((response) => {
      const allOrgs = response.data;
      setOrgs(allOrgs.organizations)
    }); 
  }

  function handleDisplayForm() {
    if(displayProjectForm || isEdit.edit){
      closeForms()
    } else {
      setDisplayProjectForm(!displayProjectForm);
    }
  };
  
  function submitEditForm(values, selectedDate) {
    const json = JSON.stringify({name: values.name, description: values.description, organization: values.organization, deadline: selectedDate})
      instance.put(`http://localhost:5000/api/project/${values.id}`, json).then(function (response) {
      if (response.data === 'Done') {
        closeForms();
        getProjects();
      }
    })
  };

  function submitProjectForm(values, selectedDate) {

    const json = JSON.stringify({name: values.name, description: values.description, organization: values.organization, deadline: selectedDate})
    instance.post("http://localhost:5000/api/project", json).then(function (response) {
      if (response.data === 'Done') {
        setDisplayProjectForm(false);
        getProjects();
      }
    })};



  function handleButtonText() {
    if(displayProjectForm || isEdit.edit){
      setButtonText('Cancel')
    } else {
      setButtonText('Add Project')
    }
  };

  function handleDelete(project) {
    Axios.delete(`http://localhost:5000/api/project/${project.public_id}`).then(function (response) {
        getProjects();
      })
  };

  function handleEdit(project){
    setIsEdit({edit: true, project: project});
    setDisplayProjectForm(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrgs()
    getProjects()
  }, []);

  useEffect(() => {
    handleButtonText();
  });


  return (
    <Page
      className={classes.root}
      title="Projects"
    >

      <Container maxWidth={false}>
        <div>
          {displayProjectForm &&
          <Box>
            <ProjectForm submitProjectForm={submitProjectForm} getProjects={getProjects} orgs={orgs}/>
          </Box>
          }
        </div>
        <div>
          {isEdit.edit &&
          <Box>
            <EditProjectForm submitEditForm={submitEditForm} getProjects={getProjects} orgs={orgs} project={isEdit.project}/>
          </Box>
          }
        </div>

        <Toolbar buttonText={buttonText} handleDisplayForm={handleDisplayForm}/>
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {projects.slice((page - 1) * 9, (page - 1) * 9 + 9).map((project) => (
              <Grid
                item
                key={project.id}
                lg={4}
                md={6}
                xs={12}
              >
                <Link

                to={{
                  pathname: `/app/project/${project.public_id}`,
                }}
                >
                <ProjectCard
                  className={classes.projectCard}
                  project={project}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
                </Link>
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
            count={Math.ceil(projects.length/9)}
            size="small"
            onChange={handlePageChange}
            page={page}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ProjectList;
