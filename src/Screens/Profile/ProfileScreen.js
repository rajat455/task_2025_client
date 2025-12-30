import { Button, MenuItem, Switch, TextField } from "@mui/material";
import { useState } from "react";
import { emailRegex } from "../../Commen/constents";
import apiHelper from "../../Halpers/apiHalpers";


export default function ProfileScreen({ Auth, setAuth }) {
    const [isSubmitted, setisSubmitted] = useState(false)
    const [user, setUser] = useState({
        _id: Auth._id,
        fullName: Auth.fullName,
        email: Auth.email,
        role: Auth.role,
        isActive: Auth.isActive
    });

    const [messages, setMessages] = useState({
        fullName: "",
        email: "",
        role: "",
    });

    const validate = (data) => {
        let errors = {};

        if (!data.fullName || data.fullName.trim().length < 3) {
            errors.fullName = "⚠️ Full name must be at least 3 characters!";
        }

        if (!emailRegex.test(data.email)) {
            errors.email = "⚠️ Invalid Email!";
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
            setisSubmitted(true);
            const isValid = validate(user);
            if (!isValid) return;
            const { data } = await apiHelper.updateUser({ ...user });

            if (data.message !== "Success") return window.showSnack("Somthing went wrong", { variant: "error" });
            localStorage.removeItem("token");
            setAuth(null);
        } catch (error) {
            window.showSnack(error.message, {
                variant: "error",
            });
        }
    };

    const toggleStatus = async (id, value) => {
        try {
            if (!window.confirm("User Shude logout after update Profile, Are you sure to do that?")) return
            const { data } = await apiHelper.updateUser({ _id: id, isActive: value });
            if (data.message === "Success") {
                localStorage.removeItem("token")
                setAuth(null)
            }
        } catch (error) {
            window.showSnack(error.message, { variant: error });
        }
    };

    return <>
        

        
        <div sx={{ height: 500, width: "100%" }}>
            <div className="col-12 mb-3 d-flex justify-content-between align-items-center">
                <h3>Your Profile</h3>
                <div className="d-flex gap-2">
                    <Switch
                        checked={user.isActive}
                        onChange={(e) => toggleStatus(Auth._id, e.target.checked)}
                        color="primary"
                    />
                    <Button onClick={() => submitHandler()} variant="contained" color="warning">
                        Update
                    </Button>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-12 col-md-6 mb-2">
                    <TextField
                        size="small"
                        fullWidth
                        margin="dense"
                        label="FullName"
                        name="fullName"
                        type="text"
                        value={user.fullName}
                        onChange={changeHandler}
                        error={Boolean(messages.fullName)}
                        helperText={messages.fullName}
                    />
                </div>
                <div className="col-12 col-md-6 mb-2">
                    <TextField
                        size="small"
                        fullWidth
                        margin="dense"
                        label="Email Address"
                        name="email"
                        type="email"
                        disabled
                        value={user.email}
                        error={Boolean(messages.email)}
                        helperText={messages.email}
                    />
                </div>
                <div className="col-12 col-md-6 mb-2">
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
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </div>
            </div>
        </div>
    </>
}