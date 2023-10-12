import '../../css/signup.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validate from '../helpers/validation';
import httpClient from '../httpClient';
import { url } from '../constants';
import PasswordHide from '../PasswordHide';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import CustomDialog from '../CustomDialog';
import Countries from '../Countries';

const Signup = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({
        password: '',
        showPassword: false,
    });
    const [confirmPassword, setConfirmPassword] = useState({
        password: '',
        showPassword: false,
    });
    const [country, setCountry] = useState("IL")
    const [emailErr, setEmailErr] = useState(false);
    const [userErr, setUserErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [confirmPassErr, setConfirmPassErr] = useState(false);
    const navigate = useNavigate();

    const [level, setLevel] = useState(1000)
    const levels = [
        {
            value: 1000,
            label: 'New',
        },
        {
            value: 1400,
            label: 'Beginner',
        },
        {
            value: 1700,
            label: 'Advanced',
        },
        {
            value: 2000,
            label: 'Expert',
        },
    ];

    const handle_submit = async (e) => {
        e.preventDefault();
        const { VemailErr, VusernameErr, VpasswordErr, VconfirmPasswordErr } =
            validate(user, email, password.password, confirmPassword.password);
        setEmailErr(VemailErr); setUserErr(VusernameErr);
        setPassErr(VpasswordErr); setConfirmPassErr(VconfirmPasswordErr);
        if (!VemailErr && !VusernameErr && !VpasswordErr && !VconfirmPasswordErr) {
            const data = new FormData();
            const TARGET = `${url}/signup`
            data.append("email", email);
            data.append("username", user);
            data.append("password", password.password);
            data.append("country", country);
            data.append("rating", level);
            try {
                await httpClient.post(TARGET, data);
                navigate("/login");
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
    }

    return (
        <div className="Signup-container rect-container">
            <CustomDialog title={title} open={open} setOpen={setOpen} />
            <div className="rect-signup rect scale-in-center">
                <div className="logo">
                    <img src={"/logo.png"} alt="logo" draggable="false" />
                </div>

                <Typography variant="h4">
                    Sign Up
                </Typography>
                <Box component="form"
                    sx={{
                        '& .MuiTextField-root': { m: '0.9vw', width: '18vw' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        required
                        variant="standard"
                        label="Username"
                        value={user}
                        onChange={(e) => { setUser(e.target.value); setUserErr(false); }}
                        error={userErr}
                        InputProps={{
                            startAdornment:
                                <Tooltip title={
                                    <span style={{ fontSize: "1vw", color: "white" }}>
                                        Please enter a username with 6-30 characters.
                                        You can use letters Underscores and numbers.
                                    </span>} >
                                    <InputAdornment position="start">
                                        <QuestionMarkIcon />
                                    </InputAdornment>
                                </Tooltip >
                        }}
                    />
                    <TextField
                        required
                        variant="standard"
                        label="Email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailErr(false); }}
                        error={emailErr}
                        InputProps={{
                            startAdornment:
                                <Tooltip title={
                                    <span style={{ fontSize: "1vw", color: "white" }}>
                                        Please enter a valid email address.
                                    </span>} >
                                    <InputAdornment position="start">
                                        <QuestionMarkIcon />
                                    </InputAdornment>
                                </Tooltip >
                        }}
                    />
                    <PasswordHide values={password} setValues={setPassword} label={"Password"} isError={passErr} setIsError={setPassErr}
                        helpText={"Password must be at least 8 characters, one letter, one number and one special character."} />

                    <PasswordHide values={confirmPassword} setValues={setConfirmPassword} label={"Comfirm Password"} isError={confirmPassErr}
                        setIsError={setConfirmPassErr} helpText={"Passwords must be the same."} />

                    <TextField
                        select
                        label="Chess level"
                        value={level}
                        margin="dense"
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        {levels.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Countries setCountry={setCountry} country={country} />

                </Box>
                <Button variant="contained" onClick={handle_submit}
                    style={{ marginTop: '1vh', backgroundColor: "#023047" }}>
                    Sign Up
                </Button>
                <div className="Signup-links bold-link">
                    <Typography variant="body1">
                        <span>  Already have an account?  </span>
                        <Link to="/Login">Log In</Link>
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default Signup;
