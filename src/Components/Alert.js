import { Snackbar } from '@material-ui/core'
import React from 'react'
import { AppState } from '../Context'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = () => {
    const { alert, setAlert } = AppState();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ open: false });
    };
    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={alert.time}
            onClose={handleClose}
        >
            <MuiAlert
                onClose={handleClose}
                variant="filled"
                elevation={10}
                severity={alert.type}
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    )
}

export default Alert