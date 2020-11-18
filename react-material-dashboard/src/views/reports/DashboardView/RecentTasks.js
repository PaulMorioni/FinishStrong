import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Link } from 'react-router-dom';

//Needs logic to limit number of Recent tasks to 10


const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const RecentTasks = ({ className, tasks, ...rest }) => { 
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)} 
      {...rest}
    >
      <CardHeader title="Recent Tasks" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
                  Project Name
                </TableCell>
                <TableCell>
                  Task Name
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                      Date Created
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {tasks.slice(0,10).map((task) => (
                <TableRow
                  hover
                  key={task.id}
                >
                  <TableCell>
                    {task.projectName}
                  </TableCell>
                  <TableCell>
                    {task.name}
                  </TableCell>
                  <TableCell>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    {moment(task.created_on).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      label={task.status}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Link
          to={{
            pathname: `/app/tasks`,
          }}
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </Box>
    </Card>
  );
};

            


RecentTasks.propTypes = {
  className: PropTypes.string
};

export default RecentTasks;
