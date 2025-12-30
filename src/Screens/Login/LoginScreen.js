import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Fragment, useState } from 'react';
import apiHelper from '../../Halpers/apiHalpers';
import { jwtDecode } from "jwt-decode"
import { Link, Navigate } from 'react-router-dom';
import { emailRegex } from '../../Commen/constents';


export default function LoginScreen({ Auth, setAuth }) {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [messages, setMessages] = useState({
        email: "",
        password: ""
    });

    const [isSubmitted, setIsSubmitted] = useState(false);


    if (Auth) {
        return <Navigate to={"/profile"} replace />
    }


    const validate = (data) => {
        let errors = {};

        if (!emailRegex.test(data.email)) {
            errors.email = "⚠️ Invalid Email!";
        }

        if (data.password.length < 8) {
            errors.password = "⚠️ Password must be at least 8 characters long!";
        }

        setMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const changeHandler = (e) => {
        const updatedUser = {
            ...user,
            [e.target.name]: e.target.value
        };

        setUser(updatedUser);
        if (isSubmitted) {
            validate(updatedUser);
        }
    };

    const submitHandler = async () => {
        try {
            setIsSubmitted(true);
            const isValid = validate(user);
            if (!isValid) return;
            const { data } = await apiHelper.login({ ...user })
            let { token } = data
            if (!token) return window.showSnack("Somthing went wrong", { variant: "error" })
            localStorage.setItem("token", token)
            const Auth = jwtDecode(token)
            setAuth(Auth)
        } catch (error) {
            window.showSnack(error.message, { variant: "error" })
        }
    };

    return (
        <Fragment>
            <Dialog open={true} maxWidth="xs" fullWidth hideBackdrop>
                <DialogTitle>Login your profile</DialogTitle>

                <DialogContent dividers>
                    <TextField
                        size="small"
                        fullWidth
                        margin="dense"
                        label="Email Address"
                        name="email"
                        value={user.email}
                        onChange={changeHandler}
                        error={Boolean(messages.email)}
                        helperText={messages.email}
                    />

                    <TextField
                        size="small"
                        fullWidth
                        margin="dense"
                        label="Password"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={changeHandler}
                        error={Boolean(messages.password)}
                        helperText={messages.password}
                    />
                </DialogContent>

                <DialogActions className='px-4'>
                    <Button variant="outlined" size="small">
                        <Link to={"/register"} children={"Go for Register"} />
                    </Button>
                    <Button onClick={submitHandler} variant="contained" size="small">
                        Click To Login
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
