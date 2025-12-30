import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Fragment, useState } from "react";
import apiHelper from "../../Halpers/apiHalpers";
import { Link, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { emailRegex } from "../../Commen/constents";

export default function RegisterScreen({ Auth,setAuth }) {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [messages, setMessages] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  
  if (Auth) {
    return <Navigate to={"/profile"} replace />
}

  const validate = (data) => {
    let errors = {};

    if (!data.fullName || data.fullName.trim().length < 3) {
      errors.fullName = "⚠️ Full name must be at least 3 characters!";
    }

    if (!emailRegex.test(data.email)) {
      errors.email = "⚠️ Invalid Email!";
    }

    if (data.password.length < 8) {
      errors.password = "⚠️ Password must be at least 8 characters long!";
    }

    if (!data.role) {
      errors.role = "⚠️ Role is required!";
    }

    setMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const changeHandler = (e) => {
    const updatedUser = {
      ...user,
      [e.target.name]: e.target.value,
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
      const { data } = await apiHelper.register({ ...user });
      let { token } = data;
      if (!token)
        return window.showSnack("Somthing went wrong", { variant: "error" });
      localStorage.setItem("token", token);
      const Auth = jwtDecode(token);
      setAuth(Auth);
    } catch (error) {
      window.showSnack(error.message, {
        variant: "error",
      });
    }
  };

  return (
    <Fragment>
      <Dialog open={true} maxWidth="xs" fullWidth hideBackdrop>
        <DialogTitle>Register your profile</DialogTitle>

        <DialogContent dividers>
          <TextField
            size="small"
            fullWidth
            margin="dense"
            label="Full Name"
            name="fullName"
            value={user.fullName}
            onChange={changeHandler}
            error={Boolean(messages.fullName)}
            helperText={messages.fullName}
          />

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

          <TextField
            select
            size="small"
            fullWidth
            margin="dense"
            label="Role"
            name="role"
            value={user.role}
            onChange={changeHandler}
            error={Boolean(messages.role)}
            helperText={messages.role}
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions className="px-4">
          <Button variant="outlined" size="small">
            <Link to="/login">Go for Login</Link>
          </Button>
          <Button onClick={submitHandler} variant="contained" size="small">
            Click to Register
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
