import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import {updateSnackbar} from '../redux/projectsSlice'
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from '@mui/material';

export default function SimpleSnackbar(props) {

    const dispatch = useDispatch();

    const {snackbar: reduxSnackbar, themColor: reduxThemeColor} = useSelector((state) => state.projects);
    const [open, setOpen] = React.useState(props.isOpen);

//   const handleClick = () => {

//       dispatch(updateIsSnackbarOpen(true))
//     // props.setIsOpen(false)
//     // setOpen(true);
//   };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(updateSnackbar({...reduxSnackbar,isOpen:false}))
    // props.setIsOpen(false)
    // setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
      <Snackbar
        open={reduxSnackbar?.isOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        // message={reduxSnackbar?.msg}
        action={action}
        
      >
      <Alert onClose={handleClose} severity={reduxSnackbar?.sev}   sx={{ width: '100%' }}>{reduxSnackbar?.msg}</Alert>
      </Snackbar>
  )
  }