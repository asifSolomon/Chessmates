import GameBoard from "../../board/GameBoard";
import Navbar from "../../Navbar";
import Time from "./time";
import Online from "./online";
import Chat from "./Chat";
import { useState, useEffect } from "react";
import httpClient from "../../httpClient";
import { url } from "../../constants";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const Home = ({ inGame }) => {
    const navigate = useNavigate();
    const [gameTime, setGameTime] = useState(5);
    const [gameColor, setGameColor] = useState(null);
    const { logout, refresh, setAuth, auth } = useAuth();
    const [opponent, setOpponent] = useState({
        "code": "il",
        "elo": "elo",
        "username": "opponent"
    });
    const MINUTE_MS = 60000;


    useEffect(() => {
        const interval = setInterval(async () => {
            console.log('Logs every 5 minutes');
            if (auth === null || refresh === null) return;
            // console.log("~ auth", auth)

            const TARGET = `${url}/update_token_refresh`
            try {
                const res = await httpClient.get(TARGET, {
                    withCredentials: true, headers: {
                        'auth': auth,
                        'refresh': refresh
                    }
                });
                setAuth(res.data["auth"]);
                // console.log("~ res.data", res.data)
            }
            catch (e) {
                console.log("~ e", e)
                logout()
            }
        }, MINUTE_MS * 10);
        return () => clearInterval(interval);
        // This represents the unmount function, 
        // in which you need to clear your interval to prevent memory leaks.
    }, [refresh, auth]);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {

            if (inGame && auth) {
                console.log("~ get opponent")

                const TARGET = `${url}/get_opponent`
                try {
                    // get the data from the api
                    const res = await httpClient.get(TARGET, {
                        withCredentials: true, headers: {
                            'auth': auth
                        }
                    });
                    // set state with the result
                    setOpponent(res.data["opponent"]);
                    setGameColor(res.data["color"]);
                }
                catch (e) {
                    console.log("~ e", e)
                    navigate("/")
                }
            }
        }

        // call the function
        fetchData();

    }, [inGame]);

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-content">
                <div className="time-container">
                    <Time currGameTime={gameTime} inGame={inGame}
                        opponent={opponent} gameColor={gameColor} />
                </div>
                <div className="board-container">
                    <GameBoard inGame={inGame} gameColor={gameColor} fen={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"} />
                </div>
                <div>
                    {inGame ? <Chat /> : <Online gameTime={gameTime} setGameTime={setGameTime} />}
                </div>
            </div>
        </div>


    );
}

export default Home;