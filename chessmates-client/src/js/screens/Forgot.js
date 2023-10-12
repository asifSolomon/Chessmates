import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../httpClient';
import { url } from '../constants';
import { validateEmail } from '../helpers/validation';
import CustomDialog from '../CustomDialog';

const Forgot = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [title, setTitle] = useState("");

    const handle_submit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError(true);
            return;
        };
        const TARGET = `${url}/forgot`
        try {
            await httpClient.get(TARGET, {
                withCredentials: true, headers: {
                    'email': email
                }
            });
            setTitle("Email was sent")
            setOpen(true);
        }
        catch (e) {
            if (!e.response) {
                setTitle("Server is not up. \nTry again Later")
                setOpen(true);
            }
        }
    }
    return (
        <div className="Forgot-container rect-container">
            <CustomDialog open={open} setOpen={setOpen} title={title}
                body={title === "Email was sent" && `Please check ${email} for rsetting your password`} />
            <div className="rect scale-in-center" style={{ height: "70vh" }}>
                <img src={"/logo.png"} alt="logo" draggable="false" />

                <Typography variant="h4" sx={{ m: '0.5vh 0 2vh' }}>
                    Forgot password
                </Typography>
                <Box
                    component="form"

                    sx={{
                        '& .MuiTextField-root': { m: '1vw', width: '100%' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            variant="standard"
                            label="Email"
                            value={email}
                            margin="dense"
                            error={emailError}
                            helperText={emailError && "Invalid Email"}
                            onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                        />
                    </div>
                </Box>
                <Button variant="contained" onClick={handle_submit}
                    style={{ margin: '3vh 0 0', backgroundColor: "#023047" }}> Send Email</Button>
                <div className="login-links bold-link">
                    <Typography variant="body1">
                        <span>  Remember password?  </span> <Link to="/Login"> Log In</Link>
                    </Typography>
                </div>
            </div>
        </div >
    );
}

export default Forgot;