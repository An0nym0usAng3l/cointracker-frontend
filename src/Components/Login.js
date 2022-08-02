import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { AppState } from '../Context';
import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../Scripts/firebase-config';

const Login = ({ handleClose }) => {

    const { setAlert } = AppState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async () => {
        if (!password || !email) {
            setAlert({
                open: true,
                time: 3000,
                type: "error",
                message: "Please fill all the fields"
            });
            return;
        }

        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            setAlert({
                open: true,
                time: 3000,
                type: "success",
                message: `Login successful, Welcome ${result.user.email}`,
            });

            handleClose()
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
        <Box p={3} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
                variant='outlined'
                type="email"
                value={email}
                label="Enter Email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                variant='outlined'
                type="password"
                value={password}
                label="Enter Password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                size='large'
                variant='contained'
                style={{ backgroundColor: "var(--main-color)", color: "var(--white)" }}
                onClick={handleSubmit}
            >
                Login
            </Button>
        </Box>
    )
}

export default Login