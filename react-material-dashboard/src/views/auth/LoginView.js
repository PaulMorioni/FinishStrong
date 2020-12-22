import React, { useState, useEffect} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Axios from 'axios';
import Alerts from 'src/components/Alerts';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleError = (message) => {
    setErrors([...errors, message])
  };

  function handleOnSubmit(values) {
    const loginToken = Buffer.from(`${values.email}:${values.password}`, 'utf8').toString('base64')
    setIsSubmitting(true);
    Axios.post("http://localhost:5000/api/login_user",{}, {
      headers: {
        'Authorization': `Basic ${loginToken}`
      }
    }).then(function (response) {
      if (response.status === 201) {
        navigate('/app/dashboard', { replace: true });
        if ('token' in response.data){
        window.localStorage.setItem('token', response.data['token']);
        window.localStorage.setItem('user_id', response.data['user_id']);
      }}
    }).catch(err => {
      handleError(err.response.data.message); 
      setIsSubmitting(false)
    });
  };

  useEffect(() =>{
  }, [errors])

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'JohnDoe@finish-strong.com',
              password: 'Password123'
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) =>{
              handleOnSubmit(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                </Box>
                <Box
                  mt={3}
                  mb={1}
                >
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
      {errors.length > 0 &&
         errors.map((error) => (
           <div>
              <Alerts text={error} type={"error"}/>
          </div>
               ))};
    </Page>
  );
};

export default LoginView;
