import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import axios from 'axios';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const LatestProjects = ({ className, ...rest }) => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:5000/projects").then((response) => {
      const allProjects = response.data;
      setProjects(allProjects.projects)
    }); 
  }, [setProjects]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        subtitle={`${projects.length} in total`}
        title="Latest Projects"
      />
      <Divider />
      <List>
        {projects.map((project, i) => (
          <ListItem
            divider={i < projects.length - 1}
            key={project.id}
          >
            <ListItemText
              primary={project.name}
              secondary={`Updated ${project.createdOn}`}
            />
            <IconButton
              edge="end"
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestProjects.propTypes = {
  className: PropTypes.string
};

export default LatestProjects;
