import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  Table,
  TableRow,
  TableCell,
  Grid,
  TableHead,
  Box,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NoData from "../../../components/NoData";


const useStyles = makeStyles((theme) => ({
  root: {
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const StatusTasks = ({ className, tasks, getTasks, handleTaskPut, status, ...rest }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title={`${status} Tasks`} 
      />
      <Divider />
      {tasks.map((task) => 
      <Accordion expanded={expanded === `panel${task.public_id}`} onChange={handleChange(`panel${task.public_id}`)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${task.public_id}bh-content`}
          id={`panel${task.public_id}bh-header`}
        >
        <Table>
            <TableRow>
              <TableCell>
                <Typography className={classes.heading}>{task.name}</Typography>
            </TableCell>
              <TableCell>
                <Typography className={classes.secondaryHeading}>Deadline:{task.deadline}</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.secondaryHeading}>{task.difficulty}</Typography>
              </TableCell>
            </TableRow>
          </Table>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {task.description}
          </Typography>
        </AccordionDetails>
      </Accordion>
      )}
      {tasks.length<1 && 
      <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start">
        <NoData/>
      </Grid>}
    </Card>
  );
};

StatusTasks.propTypes = {
  className: PropTypes.string
};

export default StatusTasks;
