import Toolbar from "@mui/material/Toolbar"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { AuthContext } from ".."
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import AccountCircle from "@mui/icons-material/AccountCircle"
import AirplaneTicket from "@mui/icons-material/AirplaneTicket"
import Home from "@mui/icons-material/Home"



export default function() {
    const { auth, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    if (!auth) {
        useEffect(() => {
            navigate("/login")
        },[])
        return <>Unauthorized</>
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        logout();
        navigate("/login")
        setAnchorEl(null);
    };

    return (<>
        <AppBar sx={{ background: "#6002ee" }}>
            <Drawer open={open} onClose={() => setOpen(false)} sx={{ width: 360 }}>
                <Draw close={() => setOpen(false)}/>
            </Drawer>

            <Toolbar>
                <IconButton
                    onClick={() => setOpen(true)}
                    size="large"
                    edge="start"
                    sx={{ color: "white" }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Weed
                </Typography>
                <IconButton
                    onClick={handleMenu}
                >
                    <AccountCircle
                        sx={{ color: "white" }}
                    />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={handleClose}
                        sx={{ minWidth: 200 }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
        <Box sx={{ pt: 6, pb: 32 }}>
            <Outlet/>
        </Box>
    </>)
}

function Draw({ close }: { close: CallableFunction }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ width: 360 }}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {navigate("/");close()}}>
                        <ListItemIcon>
                            <Link to="/">
                                <Home />
                            </Link>
                        </ListItemIcon>
                        <ListItemText primary="Beranda" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {navigate("/tickets");close()}}>
                        <ListItemIcon>
                            <AirplaneTicket/>
                        </ListItemIcon>
                        <ListItemText primary="Tiket Anda" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}

