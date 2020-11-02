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
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Axios from 'axios';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const useStyles = makeStyles(() => ({
  root: {}
}));

const TaskForm = ({ className, setDisplayTaskForm, getTasks, projects, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    description: '',
    project: projects[0].id,
    difficulty: 1,

  });
  const [deadline, handleDeadlineChange] = useState(new Date());
  const [eta, handleEtaChange] = useState(new Date());

  function submitTaskForm(values) {
    const instance = Axios.create({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Content-Type': 'application/json'
      }
    });
    const json = JSON.stringify({name: values.name, description: values.description, project_id: values.project, deadline: deadline, eta: eta, difficulty: values.difficulty})
    instance.post("http://localhost:5000/api/task", json).then(function (response) {
      if (response.data === 'Done') {
        console.log(response)
        setDisplayTaskForm(false);
        getTasks();
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
          title="New Task"
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
                label="Task Name"
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
                    value={deadline}
                    onChange={handleDeadlineChange} />
                </MuiPickersUtilsProvider>

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
                    label="ETA"
                    required
                    format="MM/dd/yyyy"
                    value={eta}
                    onChange={handleEtaChange} />
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
                label="Select Project"
                name="project"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.project}
                variant="outlined"
              >
                {projects.map((option) => (
                  <option
                    key={option.name}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            <Typography id="discrete-slider-restrict" gutterBottom>
              Difficulty
            </Typography>
             <Slider
                defaultValue={1}
                aria-labelledby="discrete-slider-restrict"
                step={1}
                valueLabelDisplay="auto"
                marks
                max={10}
                />
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
            name="taskForm"
            id="taskForm"
            color="primary"
            variant="contained"
            onClick={() => {
              submitTaskForm(values)
            }}
          >
            Save Task
          </Button>
        </Box>
      </Card>
    </form>
  );
};

TaskForm.propTypes = {
  className: PropTypes.string
};

export default TaskForm;
