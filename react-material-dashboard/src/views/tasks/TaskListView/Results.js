import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, tasks, ...rest }) => {
  const classes = useStyles();
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedTaskIds;

    if (event.target.checked) {
      newSelectedTaskIds = tasks.map((task) => task.id);
    } else {
      newSelectedTaskIds = [];
    }

    setSelectedTaskIds(newSelectedTaskIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTaskIds.indexOf(id);
    let newSelectedTaskIds = [];

    if (selectedIndex === -1) {
      newSelectedTaskIds = newSelectedTaskIds.concat(selectedTaskIds, id);
    } else if (selectedIndex === 0) {
      newSelectedTaskIds = newSelectedTaskIds.concat(selectedTaskIds.slice(1));
    } else if (selectedIndex === selectedTaskIds.length - 1) {
      newSelectedTaskIds = newSelectedTaskIds.concat(selectedTaskIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTaskIds = newSelectedTaskIds.concat(
        selectedTaskIds.slice(0, selectedIndex),
        selectedTaskIds.slice(selectedIndex + 1)
      );
    }

    setSelectedTaskIds(newSelectedTaskIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTaskIds.length === tasks.length}
                    color="primary"
                    indeterminate={
                      selectedTaskIds.length > 0
                      && selectedTaskIds.length < tasks.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Project Name
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Created
                </TableCell>
                <TableCell>
                  Deadline
                </TableCell>
                <TableCell>
                  Last Updated
                </TableCell>
                <TableCell>
                  Difficulty
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.slice(0, limit).map((task) => (
                <TableRow
                  hover
                  key={task.id}
                  selected={selectedTaskIds.indexOf(task.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTaskIds.indexOf(task.id) !== -1}
                      onChange={(event) => handleSelectOne(event, task.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    
                  ProjectName 

                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {task.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    {task.created_on}
                  </TableCell>
                  <TableCell>
                    {task.deadline}
                  </TableCell>
                  <TableCell>



                  </TableCell>
                  <TableCell>
                    {task.difficulty}
                  </TableCell>
                  <TableCell>
                    {task.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={tasks.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  tasks: PropTypes.array.isRequired
};

export default Results;
