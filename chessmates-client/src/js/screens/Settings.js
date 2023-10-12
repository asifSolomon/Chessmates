
import "../../css/settings.css"
import { useState } from "react";
import httpClient from '../httpClient';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { url } from '../constants';
import PasswordHide from '../PasswordHide';
import CustomDialog from '../CustomDialog';
import Navbar from "../Navbar";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from "../contexts/AuthProvider";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Countries from "../Countries";
import { validateEmail, validateUser, validatePassword } from "../helpers/validation";

const Settings = () => {
    const { auth, setAuth, setRefresh } = useAuth();
    const [open, setOpen] = useState(false);
    const { userData } = useAuth();
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(userData["username"]);
    const [email, setEmail] = useState(userData["email"])
    const [oldPassword, setOldPassword] = useState({
        password: '',
        showPassword: false,
    });
    const [newPassword, setNewPassword] = useState({
        password: '',
        showPassword: false,
    });
    const [country, setCountry] = useState(userData["code"].toUpperCase())
    const [emailErr, setEmailErr] = useState(false);
    const [userErr, setUserErr] = useState(false);
    const [newPassErr, setNewPassErr] = useState(false);

    const handle_submit = async (e) => {
        e.preventDefault();
        const [Vemail, Vuser] = [validateEmail(email), validateUser(user)];
        let Vpass = !newPassErr;
        setEmailErr(!Vemail);
        setUserErr(!Vuser);
        if (newPassword.password !== "") {
            Vpass = validatePassword(newPassword.password);
            setNewPassErr(!Vpass);
        }

        if (Vemail && Vuser && Vpass) {

            const data = new FormData()
            const TARGET = `${url}/update_user`
            data.append("email", email);
            data.append("username", user);
            data.append("country", country);
            if (newPassword.password !== "") {
                data.append("old_pass", oldPassword.password)
                data.append("new_pass", newPassword.password)
            }
            try {

                const res = await httpClient.post(TARGET, data, {
                    withCredentials: true, headers: {
                        'auth': auth
                    }
                });
                setAuth(res.data["auth"])
                setRefresh(res.data["refresh"])
                setTitle("Updated");
                setOpen(true);

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
        <div className="Settings-container">
            <CustomDialog title={title} open={open} setOpen={setOpen} />
            <Navbar />
            <div className="Settings-rect">
                <div className="details-rect">
                    <Typography variant="h4">
                        Settings
                    </Typography>
                    <Box component="form"
                        sx={{
                            '& .MuiTextField-root': { m: '2.5vh', width: '18vw' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
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
                        </div>
                        <div>
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
                        </div>
                        <div>
                            <Countries setCountry={setCountry} country={country} />
                        </div>
                        <div>
                            <PasswordHide notRequired={true} values={oldPassword} setValues={setOldPassword} label={"Old Password"} helpText={"Please enter your old password"} />
                        </div>
                        <div>
                            <PasswordHide notRequired={true} values={newPassword} setValues={setNewPassword} label={"New Password"}
                                isError={newPassErr} setIsError={setNewPassErr}
                                helpText={"Password must be at least 8 characters, one letter, one number and one special character."} />
                        </div>
                    </Box>
                    <Button variant="contained" onClick={handle_submit}
                        style={{ marginTop: '1vh', backgroundColor: "#023047" }}>
                        Update details
                    </Button>

                </div>
            </div>
        </div>
    );
}

export default Settings;