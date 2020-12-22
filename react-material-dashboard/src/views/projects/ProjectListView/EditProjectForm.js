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
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const useStyles = makeStyles(() => ({
  root: {}
}));

const EditProjectForm = ({ className, submitEditForm, getProjects, project, orgs, ...rest }) => {
  const classes = useStyles();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [values, setValues] = useState({
    id: project.public_id,
    name: project.name,
    description: project.description,
    organization: project.organization
  })

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  function handleSubmit() {
    submitEditForm(values, selectedDate)
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
              handleSubmit()
            }}
          >
            Update Project
          </Button>
        </Box>
      </Card>
    </form>
  );
};

EditProjectForm.propTypes = {
  className: PropTypes.string
};

export default EditProjectForm;
