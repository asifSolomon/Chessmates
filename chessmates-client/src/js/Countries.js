
import { countries } from "./constants";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const Countries = ({ country, setCountry }) => {
    return (
        <TextField
            select
            label="Country"
            margin="dense"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
        >
            {countries.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                    <div className="country">
                        <img
                            loading="lazy"
                            width="30"
                            src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w80/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                            style={{ margin: "0 1vw 0 0" }}
                        />
                        {option.label}
                    </div>
                </MenuItem>
            ))}
        </TextField>);
}

export default Countries;