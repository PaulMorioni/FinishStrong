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

const OrgForm = ({ className, setDisplayOrgForm, getOrgs,submitOrgForm, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
  });

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
          title="New Organization"
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
                label="Organization Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
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
            name="orgForm"
            id="orgForm"
            color="primary"
            variant="contained"
            onClick={() => {
              submitOrgForm(values)
            }}
          >
            Save Organization
          </Button>
        </Box>
      </Card>
    </form>
  );
};

OrgForm.propTypes = {
  className: PropTypes.string
};

export default OrgForm;
