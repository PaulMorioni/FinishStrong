import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {  useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Alerts(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  
  const [message, setMessage] = useState(props.text);
  const [severity, setSeverity] = useState(props.type);

  const handleCall = () => {
    setMessage(props.text)
    setSeverity(props.type)
    enqueueSnackbar(message, { autoHideDuration: 3000,
      variant: severity});
  };

  useEffect(() => {
    handleCall();
  }, [])

  return (
    <div>
    </div>
  );
}