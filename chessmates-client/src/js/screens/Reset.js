import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../httpClient';
import { url } from '../constants';
import { validatePassword } from '../helpers/validation';
import CustomDialog from '../CustomDialog';
import PasswordHide from '../PasswordHide';
import usePath from '../hooks/usePath';

const Reset = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [values, setValues] = useState({
        password: '',
        showPassword: false,
    });
    const [passwordError, setPasswordError] = useState(false);
    const path = usePath();


    const handle_submit = async (e) => {
        e.preventDefault();
        if (!validatePassword(values.password)) {
            setPasswordError(true);
            return;
        };
        const TARGET = url + path;
        console.log("~ TARGET", TARGET)
        const data = new FormData();
        data.append("password", values.password);
        try {
            await httpClient.post(TARGET, data, { withCredentials: true });
            setTitle("Password was changed");
            setOpen(true);
        }
        catch (e) {
            if (!e.response) {
                setTitle("Server is not up. \nTry again Later");
                setOpen(true);
            }
            else {
                setTitle(e.response.data);
                setOpen(true);
            }
        }
    }

    return (
        <div className="Reset-container rect-container">
            <CustomDialog open={open} setOpen={setOpen} title={title} />
            <div className="rect scale-in-center" style={{ height: "70vh" }}>
                <img src={"/logo.png"} alt="logo" draggable="false" />
                <Typography variant="h4" sx={{ m: '0.5vh 0 2vh' }}>
                    Reset password
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
                        <PasswordHide values={values} setValues={setValues} label={"Password"} isError={passwordError} setIsError={setPasswordError}
                            helpText={"Password must be at least 8 characters, one letter, one number and one special character."} />
                    </div>
                </Box>
                <Button variant="contained" onClick={handle_submit}
                    style={{ margin: '3vh 0 0', backgroundColor: "#023047" }}> Change password</Button>
                <div className="login-links bold-link">
                    <Typography variant="body1">
                        <span>  Remember password?  </span> <Link to="/Login"> Log In</Link>
                    </Typography>
                </div>
            </div>
        </div >
    );
}

export default Reset;