import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
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

const ProjectsTable = ({ className, users, org, ...rest }) => {
  const classes = useStyles();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user) => user.public_id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
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
        <Box minWidth={750}>
          <Grid container
            justify="center"
            alignItems="center"
            direction="row">
            <Typography>{org.name}: Projects</Typography>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === org.projects.length}
                    color="primary"
                    indeterminate={
                      selectedUserIds.length > 0
                      && selectedUserIds.length < org.projects.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Last Updated
                </TableCell>
                <TableCell>
                    Description
                </TableCell>
                <TableCell>
                  Created On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {org.projects.slice(page * limit, page * limit + limit).map((project) => (
                <TableRow
                  hover
                  key={project.public_id}
                  selected={selectedUserIds.indexOf(project.public_id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUserIds.indexOf(project.public_id) !== -1}
                      onChange={(event) => handleSelectOne(event, project.public_id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {project.name}
                  </TableCell>
                    {project.last_updated ? <TableCell>{project.last_updated}</TableCell> : <TableCell>{project.created_on}</TableCell>}
                  <TableCell>
                    {project.description}
                  </TableCell>
                  <TableCell>
                    {project.created_on}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={org.projects.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ProjectsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default ProjectsTable;
