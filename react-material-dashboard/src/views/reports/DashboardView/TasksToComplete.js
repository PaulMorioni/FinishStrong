import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));


const TasksToComplete = ({ className, tasks, NumberOfIncomplete, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TASKS TO COMPLETE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {NumberOfIncomplete(tasks)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <DoneOutlineIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TasksToComplete.propTypes = {
  className: PropTypes.string
};

export default TasksToComplete;
