import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Select from 'react-select';
import { useSocket } from "../../contexts/SocketProvider";
import { useState, useEffect } from 'react';
import { url, customStyles } from '../../constants';
import httpClient from '../../httpClient';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Online = ({ gameTime, setGameTime }) => {
    const navigate = useNavigate();
    let isMounted = true;
    const socket = useSocket();
    const [usersData, setUsersData] = useState(null);
    const { auth, logout } = useAuth();
    const [loading, setLoading] = useState(false);


    const get_users = async () => {

        try {
            const TARGET = `${url}/get_users`
            const resp = await httpClient.get(TARGET, {
                withCredentials: true, headers: {
                    'auth': auth
                }
            });
            if (isMounted) setUsersData(resp.data);
        } catch (error) {
            logout();
        }
    }
    useEffect(() => {
        get_users()

        return () => {
            isMounted = false;
        };
    }, []);


    useEffect(() => {
        if (socket == null) return;
        socket.on('new_users', get_users)
        socket.on("game_started", () => {
            socket.emit("start_game", { "auth": auth });
            navigate("/play");
        })
        return () => {
            isMounted = false;
            if (socket != null) {
                socket.off('new_users');
                socket.off('game_started');
            }
        }
    }, [socket])

    const gameTimes = [1, 3, 5, 10, 15];
    const handle_submit = (e) => {
        if (socket) {
            socket.emit("search_game", {
                "auth": auth,
                "time": gameTime
            })
        }
        setLoading(true);
    }

    return (
        <div className="online-container">
            <Select isDisabled={loading} options={gameTimes.map((option) => (
                { value: { option }, label: `${option} Min` }))}
                value={{ value: { gameTime }, label: `${gameTime} Min` }}
                onChange={(e) => { setGameTime(e.value.option) }}
                styles={customStyles}
                isSearchable={false}
            />
            {loading ?
                <CircularProgress size={"4vw"} onClick={() => {
                    setLoading(false)
                }}
                    style={{
                        marginTop: '6vh'
                    }} /> : <Button variant="contained" onClick={handle_submit}
                        style={{
                            marginTop: '6vh', backgroundColor: "#023047", width: "20vw",
                            fontSize: "3.5vh"
                        }}>
                    Play
                </Button>}


            <div className="online-players-container">
                <div className="online-title">
                    <Typography variant="h6" sx={{ color: "#ffffff" }}>
                        Online players
                    </Typography>
                </div>
                <List
                    sx={{
                        bgcolor: '#ffffff',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                        maxHeight: '31.8vh'
                    }}
                >
                    {usersData && usersData.map((details, id) => (
                        < ul key={id + 1}>

                            {
                                <ListItem key={id + 1}>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <div style={{ flex: "1" }} >{`#${id + 1}`}</div>
                                        <div style={{ flex: "4" }} > {`${details["username"]} (${details["elo"]}) `}<img
                                            src={`https://flagcdn.com/20x15/${details["code"]}.png`}
                                            srcSet={`https://flagcdn.com/40x30/${details["code"]}.png 2x,
                                            https://flagcdn.com/60x45/${details["code"]}.png 3x`}
                                            width="20"
                                            height="15"
                                            alt={details["code"]} /></div>
                                    </div>


                                </ListItem>
                            }
                        </ul>
                    ))}
                </List>
            </div>
        </div >
    );
}

export default Online;