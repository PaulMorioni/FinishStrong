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
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const useStyles = makeStyles(() => ({
  root: {}
}));

const TaskForm = ({ className, task, submitEditTaskForm, projects, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    id: task.public_id,
    name: task.name,
    description: task.description,
    project: task.project,
  });
  const [deadline, handleDeadlineChange] = useState(new Date(task.deadline));
  const [eta, handleEtaChange] = useState(new Date(task.eta));
  const [difficulty, setDifficulty] = useState(task.difficulty);


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleDifficultyChange = (event, newValue) => {
    setDifficulty(newValue)
  }

  function handleSubmit() {
    submitEditTaskForm(values, deadline, eta, difficulty)
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
                value={difficulty}
                onChange={handleDifficultyChange}
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
              handleSubmit()
            }}
          >
            Update Task
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
