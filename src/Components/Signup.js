import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { AppState } from '../Context';
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../Scripts/firebase-config'

const Signup = ({ handleClose }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConCirmPassword] = useState("");
    const { setAlert } = AppState();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setAlert({
                open: true,
                time: 3000,
                type: "error",
                message: "Passwords do not match"
            });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            setAlert({
                open: true,
                time: 3000,
                type: "success",
                message: `Sign up successful, Welcome ${result.user.email}`,
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
            <TextField
                variant='outlined'
                type="password"
                value={confirmPassword}
                label="Confirm Password"
                fullWidth
                onChange={(e) => setConCirmPassword(e.target.value)}
            />
            <Button
                size='large'
                variant='contained'
                style={{ backgroundColor: "var(--main-color)", color: "var(--white)" }}
                onClick={handleSubmit}
            >
                SignUp
            </Button>
        </Box>
    )
}

export default Signup