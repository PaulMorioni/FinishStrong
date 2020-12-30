import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);

  const handleError = (message) => {
    setErrors([...errors, message])
  };

  function getUser() {
    const jwt = window.localStorage.getItem('token');
    const user_id= window.localStorage.getItem('user_id');
    Axios.get(`http://localhost:5000/api/user/${user_id}`, {
      headers: {
        'x-access-token': jwt
      }
    }).then((response) => {
      const user = response.data.user;
      setUser(user);
    }).catch(err => {
      if (err.response){
        console.log(err.response)
      } else {
        //TODO finish order handeling after fixed on API server
      }
    }, [])};

  useEffect(() => {
    getUser()
    
  }, [])

  useEffect(() => {
  }, [errors])

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile user={user}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetails user={user}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
