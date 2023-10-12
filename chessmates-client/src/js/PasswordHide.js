import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';


const PasswordHide = ({ values, setValues, label, isError, setIsError, errorText, helpText, notRequired }) => {
    const handleChange = (prop) => (event) => {
        if (isError) {
            setIsError(false);
        }
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <TextField
            required={!notRequired}
            variant="standard"
            label={label}
            value={values.password}
            margin="dense"
            type={values.showPassword ? 'text' : 'password'}
            onChange={handleChange('password')}
            error={isError}
            helperText={isError && errorText}
            InputProps={{
                endAdornment:
                    < InputAdornment position="end" >
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment >,
                startAdornment:
                    helpText && <Tooltip title={<span style={{ fontSize: "1vw", color: "white" }}>{helpText}</span>} >
                        <InputAdornment position="start">
                            <QuestionMarkIcon />
                        </InputAdornment>
                    </Tooltip >
            }}
        />
    );
}

export default PasswordHide;