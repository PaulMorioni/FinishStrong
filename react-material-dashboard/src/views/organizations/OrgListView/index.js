import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import Axios from 'axios';
import OrgForm from './OrgForm';
import ProjectsTable from './ProjectsTable';
import Alerts from 'src/components/Alerts';



const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));


const OrgListView = () => {
  const classes = useStyles();
  const [orgs, setOrgs] = useState([]);
  const [displayOrgForm, setDisplayOrgForm] = useState(false)
  const [errors, setErrors] = useState([]);

  const handleError = (message) => {
    setErrors([...errors, message])
  };

  function submitOrgForm(values) {
    const jwt = window.localStorage.getItem('token');
    const instance = Axios.create({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Content-Type': 'application/json',
        'x-access-token': jwt
      }
    });
    const json = JSON.stringify({name: values.name})
    instance.post("http://localhost:5000/api/organization", json).then(function (response) {
      if (response.status === 201) {
        setDisplayOrgForm(false);
        getOrgs();
      }
    }).catch(err => {
      handleError(err.response.data.message); 
    });
  };

  useEffect(() =>{
  }, [errors])

  function handleDisplayForm() {
    setDisplayOrgForm(!displayOrgForm);
  };

  function getOrgs() {
    const jwt = window.localStorage.getItem('token');
    Axios.get("http://localhost:5000/api/organization", {
      headers: {
        'x-access-token': jwt
      }
    }).then((response) => {
      const allOrgs = response.data.organizations;
      setOrgs(allOrgs);
    }).catch(err => {
      handleError(err.response.data.message); 
    }); 
  };

  useEffect(() => {
    getOrgs()
  }, [setOrgs]);

  return (
    <Page
      className={classes.root}
      title="Organizations"
    >
      <Container maxWidth={false}>
      <div>
          {displayOrgForm &&
          <Box>
            <OrgForm setDisplayOrgForm={setDisplayOrgForm} getOrgs={getOrgs} submitOrgForm={submitOrgForm}/>
          </Box>
          }
        </div>
        <Toolbar handleDisplayForm={handleDisplayForm}/>
        {orgs.map((org) => (
          <Grid container direction="row" justify="space-around" alignItems="flex-start">
            <Box mt={2}>
              <Results users={org.users} org={org}/>
            </Box>
            <Box mt={2}>
              <ProjectsTable users={org.users} org={org}/>
            </Box>
          </Grid>
        ))}
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

export default OrgListView;
