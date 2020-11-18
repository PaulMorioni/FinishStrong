import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import Axios from 'axios';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProjectForm = ({ className, setDisplayProjectForm, getProjects, orgs, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    description: '',
    organization: orgs[0].public_id
  });
  const [selectedDate, handleDateChange] = useState(new Date());

  function submitProjectForm(values) {
    const instance = Axios.create({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Content-Type': 'application/json'
      }
    });
    const json = JSON.stringify({name: values.name, description: values.description, organization: values.organization, deadline: selectedDate})
    instance.post("http://localhost:5000/api/project", json).then(function (response) {
      if (response.data === 'Done') {
        setDisplayProjectForm(false);
        getProjects();
      }
    })
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          title="New Project"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    fullWidth
                    variant="inline"
                    inputVariant="outlined"
                    label="Deadline"
                    required
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange} />
                </MuiPickersUtilsProvider>

            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                required
                value={values.description}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Organization"
                name="organization"
                value={values.organization}
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {orgs.map((option) => (
                  <option
                    key={option.name}
                    value={option.public_id}
                  >
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            name="projectForm"
            id="projectForm"
            color="primary"
            variant="contained"
            onClick={() => {
              submitProjectForm(values)
            }}
          >
            Save Project
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProjectForm.propTypes = {
  className: PropTypes.string
};

export default ProjectForm;