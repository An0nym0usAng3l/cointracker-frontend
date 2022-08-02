import React, { useState } from 'react';
import { AppState } from '../Context';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import GoogleButton from 'react-google-button'
import { auth } from '../Scripts/firebase-config';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "var(--grey)",
        color: "var(--main-color)",
        borderRadius: 5,
    },
    google: {
        padding: 28,
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 20,
        fontSize: 20
    }
}));

export default function AuthModal() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const { setAlert } = AppState();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const googleProvider = new GoogleAuthProvider()
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setAlert({
                open: true,
                time: 3000,
                type: "success",
                message: `Sign in successful, Welcome ${result.user.email}`,
            });
            handleClose();
        } catch (error) {
            setAlert({
                open: true,
                time: 4000,
                type: "error",
                message: error.message,
            });
            return;
        }


    }

    return (
        <div>
            <Button variant='contained' color='primary' onClick={handleOpen}>Login/SignUp</Button>
            <Modal
                aria-labelledby="Login Modal"
                aria-describedby="Sign Up Modal"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <AppBar position="static" style={{
                            backgroundColor: "transparent",
                            color: "var(--main-color)"
                        }}>
                            <Tabs value={value} onChange={handleChange} aria-label="Login Modal">
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>
                        </AppBar>
                        {value === 0 && <Login handleClose={handleClose} />}
                        {value === 1 && <Signup handleClose={handleClose} />}
                        <Box className={classes.google}>
                            <span>OR</span>
                            <GoogleButton
                                style={{
                                    width: "100%",
                                    outline: "none"
                                }}
                                onClick={signInWithGoogle}
                            />
                        </Box>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
