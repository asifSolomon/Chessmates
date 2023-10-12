import '../../css/login.css';
import httpClient from '../httpClient';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { url } from "../constants";
import { useAuth } from '../contexts/AuthProvider';
import PasswordHide from '../PasswordHide';
import CustomDialog from '../CustomDialog';

const Login = () => {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const { setRefresh, auth, setAuth } = useAuth();
    const [values, setValues] = useState({
        password: '',
        showPassword: false,
    });
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");



    useEffect(() => {
        if (auth !== null)
            navigate("/");
    }, [auth, navigate]);


    const handle_submit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        const TARGET = `${url}/login`
        data.append("username/email", user);
        data.append("password", values.password);
        try {
            // console.log("try1")
            const res = await httpClient.post(TARGET, data, { withCredentials: true });
            setRefresh(res.data["refresh_token"]);
            console.log("~ login - update")

            setAuth(res.data["access_token"]);
        }
        catch (e) {
            if (!e.response) {
                setTitle("Server is not up. \nTry again Later")
                setOpen(true);
            }
            else {
                setTitle(e.response.data);
                setOpen(true);
            }
        }
    }

    return (
        <div className="rect-container Login-container">
            <CustomDialog title={title} open={open} setOpen={setOpen} />
            <div className="rect-login rect scale-in-center" style={{ height: "75vh" }}>
                <img src={"/logo.png"} alt="logo" draggable="false" />

                <Typography variant="h4">
                    Sign In
                </Typography>
                <Box
                    component="form"

                    sx={{
                        '& .MuiTextField-root': { m: '0.9vw', width: '18vw' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            required
                            variant="standard"
                            label="Username or Email"
                            value={user}
                            margin="dense"
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <div>
                        <PasswordHide values={values} setValues={setValues} label={"Password"} />
                    </div>
                </Box>
                <Button variant="contained" onClick={handle_submit}
                    style={{ marginTop: '4vh', backgroundColor: "#023047" }}>
                    Sign In</Button>
                <div className="login-links bold-link">
                    <Typography variant="body1">
                        <Link to="/Forgot"> Forgot Password?</Link> <span> | </span>
                        <Link to="/Signup">Sign Up</Link>
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default Login;