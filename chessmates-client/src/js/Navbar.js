
import { useNavigate, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthProvider";

const Navbar = () => {
    const navigate = useNavigate();
    const { auth, logout } = useAuth()


    useEffect(() => {
        if (auth === null)
            navigate("/login");
    }, [auth, navigate]);

    const handle_logout = () => {
        logout()
    }

    return (
        <div className="nabar-container">
            <AppBar position="static" color='primary' style={{ backgroundColor: "#B4BFD1" }}>
                <Toolbar className='Navbar'>
                    <img src={"/logo.png"} alt="logo" />
                    <Typography className='links' variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/">PLAY</Link>
                        <Link to="/Learn">LEARN</Link>
                        <Link to="/Puzzles">PUZZLES</Link>
                    </Typography>
                    <div className="logout">
                        <Button variant="outlined" onClick={handle_logout}
                            style={{ backgroundColor: "#0E71EB", color: "white" }}> Logout
                        </Button>
                    </div>
                    <IconButton onClick={() => navigate("/Settings")}>
                        <SettingsIcon fontSize="large" />
                    </ IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Navbar;