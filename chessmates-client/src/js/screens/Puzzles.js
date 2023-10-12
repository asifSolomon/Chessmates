import Navbar from "../Navbar";
import "../../css/learn.css";
import "../../css/puzzles.css"
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import GameBoard from "../board/GameBoard";
import { useSocket } from "../contexts/SocketProvider";
import { useAuth } from "../contexts/AuthProvider";
import { url } from "../constants";
import httpClient from "../httpClient";

const Puzzles = () => {
    const [fen, setFen] = useState("8/8/8/8/8/8/8/8");
    const [status, setStatus] = useState("start");
    const [tries, setTries] = useState(0);
    const socket = useSocket();
    const { userData, auth, logout } = useAuth()
    const fetchData = async () => {

        if (auth) {
            const TARGET = `${url}/new_puzzle`
            try {
                // get the data from the api
                const res = await httpClient.get(TARGET, {
                    withCredentials: true, headers: {
                        'auth': auth
                    }
                });
                // set state with the result
                setFen(res.data);
                console.log("~ res.data", res.data)
            }
            catch (e) {
                console.log("~ e", e)
                logout()
            }
        }
    }
    useEffect(() => {
        // call the function
        fetchData();
    }, []);

    useEffect(() => {
        if (socket == null) return;
        socket.on("status", (data) => {
            setStatus(data);
            setTries((prev) => {
                return prev + 1;
            })
        })
        return () => {
            if (socket != null) {
                socket.off('status');
            }
        }
    }, [socket, setStatus])
    return (
        <div className="puzzles-container">
            <Navbar />
            <div className="learn-content">
                <div className="board-container">
                    <GameBoard fen={fen} inGame={true} gameColor={"white"} puzzle={true} />
                </div>
                <div className="puzzles-text">
                    <div className="puzzle-number">
                        <Typography variant="h4" gutterBottom sx={{ padding: "8px", color: "white", marginBottom: "0" }}>
                            Puzzle number {userData["currEx"]}
                        </Typography>
                    </div>
                    <div className="instructions">

                        {status != "finished" && <>
                            <Typography variant="h4" >
                                Your Turn
                            </Typography>
                            <Typography variant="h5">
                                Try to find the best moves for white!
                            </Typography>
                        </>
                        }
                        <Typography variant="h3" sx={{ marginTop: "5vh" }}>
                            {(status == "check" || status == "finished") && "Well done!"}
                            {status == "wrong" && "Try again"}
                        </Typography>
                    </div>
                    {(status == "check" || status == "finished") && <img src={"/check.png"}
                        key={tries + 1} className="scale-in-center" style={{ maxHeight: "25vh", margin: "4vh" }} />}
                    {status == "wrong" && <img src={"/wrong.png"} className="wobble-hor-bottom"
                        key={tries + 2} style={{ maxHeight: "25vh", margin: "4vh" }} />}
                    {status == "finished" && <div className="next-button">
                        <IconButton onClick={() => window.location.reload()}>
                            <SkipNextIcon sx={{ fontSize: 80 }} />
                        </ IconButton>
                    </div>}
                </div>
            </div>

        </div>
    );
}

export default Puzzles;