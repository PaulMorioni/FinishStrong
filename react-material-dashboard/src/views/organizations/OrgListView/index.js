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
import OrgForm from './OrgForm'
import ProjectsTable from './ProjectsTable'



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


  function handleDisplayForm() {
    setDisplayOrgForm(!displayOrgForm);
  };

  function getOrgs() {
    Axios.get("http://localhost:5000/api/organization").then((response) => {
      const allOrgs = response.data.organizations;
      setOrgs(allOrgs);
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
            <OrgForm setDisplayOrgForm={setDisplayOrgForm} getOrgs={getOrgs}/>
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
    </Page>
  );
};

export default OrgListView;
