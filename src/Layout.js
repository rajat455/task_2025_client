import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from '@mui/icons-material/People';
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Layout({ Component, Auth, setAuth }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const location = useLocation()

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const LogOuthandler = () => {
        localStorage.removeItem("token")
        setAuth(null)
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItem disablePadding >
                    <ListItemButton
                        component={Link}
                        to="/profile"
                        selected={location.pathname === "/profile"}
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: "action.selected",
                            },
                            "&.Mui-selected .MuiListItemIcon-root": {
                                color: "primary.main",
                            }
                        }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                    </ListItemButton>
                </ListItem>
                <ListItem hidden={Auth.role !== "admin"} disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/listUser"
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: "action.selected",
                            },
                            "&.Mui-selected .MuiListItemIcon-root": {
                                color: "primary.main",
                            }
                        }}
                        selected={location.pathname === "/listUser"}
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Users"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
    const container =
        window !== undefined ? () => window.document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: "1500",
                    width: { sm: `100%` },
                }}
            >
                <Toolbar className="justify-content-between">
                    <div className="d-flex align-items-center">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" fontSize={20} noWrap component="div">
                            {Auth?.role?.toUpperCase() + " PANEL"}
                        </Typography>
                    </div>
                    <Button onClick={LogOuthandler} color="inherit" variant="outlined" endIcon={<LogoutIcon />}>Sign Out</Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Component Auth={Auth} setAuth={setAuth} />
            </Box>
        </Box>
    );
}
