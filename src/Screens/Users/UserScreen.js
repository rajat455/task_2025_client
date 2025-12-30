import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Switch, Chip, IconButton } from "@mui/material";
import apiHelper from "../../Halpers/apiHalpers";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserScreen({ Auth }) {
    const [users, setUsers] = useState([]);
    const [loading, setloading] = useState(false);
    const getUsers = async () => {
        try {
            setloading(true);
            const { data } = await apiHelper.listUser();
            setUsers(data.users || []);
            setloading(false);
        } catch (error) {
            setloading(false);
            window.showSnack(error.message, { variant: "error" });
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const toggleStatus = async (id, value) => {
        try {
            setloading(true);
            const { data } = await apiHelper.updateUser({ _id: id, isActive: value });
            setloading(false);
            if (data.message === "Success") {
                getUsers();
            }
        } catch (error) {
            setloading(false);
            window.showSnack(error.message, { variant: error });
        }
    };


    const RemoveHandler = async (id) => {
        try {
            if(!window.confirm("Are your sure to delete this User")) return
            const { data } = await apiHelper.deleteUser(id)
            setloading(false)
            if (data.message === "Success") {
                getUsers()
                window.showSnack("User Removed Successfully", { variant: "success" })
            }
        } catch (error) {
            setloading(false)

            window.showSnack(error.message, { variant: 'error' })
        }
    }


    const columns = [
        {
            field: "fullName",
            headerName: "Full Name",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value?.toUpperCase()}
                    color={params.value === "admin" ? "primary" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "isActive",
            headerName: "Active",
            width: 100,
            sortable: false,
            renderCell: (cell) => (
                <Switch
                    disabled={cell.row.role === "admin"}
                    checked={cell.row.isActive}
                    onChange={(e) => toggleStatus(cell.row._id, e.target.checked)}
                    color="primary"
                />
            ),
        },
        {
            field: "Action",
            headerName: "Action",
            width: 100,
            sortable: false,
            renderCell: (cell) => {
                return (
                    <IconButton disabled={cell.row._id === Auth._id} color="error" onClick={() => {
                        RemoveHandler(cell.row._id)
                    }}>
                        <DeleteIcon />
                    </IconButton>
                );
            },
        },
    ];
    return (
        <div sx={{ height: 500, width: "100%" }}>
            <div className="col-12 mb-3">
                <h3>All Users</h3>
            </div>
            <div className="col-12">
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                    pageSizeOptions={[0]}
                    rowsPerPageOptions={[5]}
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
}
