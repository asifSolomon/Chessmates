import { useTimer } from 'react-timer-hook';
import { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../contexts/AuthProvider';
import { useSocket } from '../../contexts/SocketProvider';
import CustomDialog from '../../CustomDialog';


const Time = ({ currGameTime, inGame, opponent, gameColor }) => {
    const [overOpen, setOverOpen] = useState(false);
    const { userData, auth, setChangeData } = useAuth();
    const [body, setBody] = useState("");
    const [title, setTitle] = useState("");
    const [over, setOver] = useState(false);
    const [won, setWon] = useState(true);
    const socket = useSocket();
    const timeIsUp = useCallback(
        () => {
            if (socket) {
                socket.emit("check_time", {
                    "auth": auth
                })
            }
        },
        [socket, auth]
    )



    const {
        seconds: mySeconds,
        minutes: myMinutes,
        pause: myPause,
        resume: myResume,
        restart: myRestart
    } = useTimer({ expiryTimestamp: new Date(), onExpire: timeIsUp });
    const {
        seconds: oppSeconds,
        minutes: oppMinutes,
        pause: oppPause,
        resume: oppResume,
        restart: oppRestart
    } = useTimer({ expiryTimestamp: new Date(), onExpire: () => timeIsUp });
    useEffect(() => {
        let time = new Date();
        // console.log("problem~ time", time)
        time.setMinutes(time.getMinutes() + currGameTime)
        myRestart(time, inGame && gameColor === "white");
        oppRestart(time, inGame && gameColor === "black");
    }, [currGameTime, inGame, gameColor])

    useEffect(() => {
        if (socket == null) return;
        const handle_move = (data) => {
            console.log("~ data", data)
            // console.log("time ~ hreeeeeee")
            if (data["color"] === gameColor) {
                myPause()
                console.log("~ myPause")
                oppResume()
            }
            else {
                oppPause()
                console.log("~ oppPause")
                myResume()
            }
        }
        socket.on("move", handle_move)
        return () => {
            // console.log("~ nooooo2")
            if (socket != null) {
                socket.off('move', handle_move);
            }
        }
    }, [socket, gameColor, myPause, myResume, oppPause, oppResume])
    useEffect(() => {
        if (socket == null) return;
        socket.on("game_over", (data) => {
            setChangeData((prev) => {
                console.log("~ prev", prev)
                return !prev;
            });
            setOver(true);
            if (data["res"].startsWith("white") || data["res"].startsWith("black")) {
                if (data["res"].startsWith(gameColor)) {
                    setWon(true);
                }
                else {
                    setWon(false);
                }
            }
            setOverOpen(true);
            setTitle(`Game over - ${data["res"]}`);
            setBody(`Ended by ${data["text"]}`)
            myPause();
            oppPause();
        })
        return () => {
            if (socket != null) {
                socket.off('game_over');
            }
        }
    }, [socket, setOverOpen, setTitle, setBody, myPause, oppPause])

    return (
        <div className="time-comp-container">
            <CustomDialog open={overOpen} setOpen={setOverOpen} title={title} body={body}
                over={over} won={won} />
            {inGame && <><div className="clock">
                <Typography variant="h4" sx={{ color: "#ffffff", backgroundColor: "#023047", borderRadius: "10%", padding: "5px 0" }}>
                    {`${oppMinutes.toString().padStart(2, "0")}:${oppSeconds.toString().padStart(2, "0")}`}
                </Typography>
            </div>
                <div className="opponent">
                    <Typography variant="h6" sx={{ color: "#000000", marginBottom: "15vh" }}>
                        {`${opponent["username"]} (${opponent["elo"]}) `}
                        <img
                            width="32"
                            height="24"
                            alt={`${'il'}`}
                            src={`https://flagcdn.com/32x24/${opponent["code"]}.png`}
                            srcSet={`https://flagcdn.com/64x48/${opponent["code"]}.png 2x,
                                    https://flagcdn.com/96x72/${opponent["code"]}.png 3x`} />
                    </Typography>
                </div></>}
            {userData && <div className="player">
                <Typography variant="h6" sx={{ color: "#000000" }}>
                    {`${userData["username"]} (${userData["elo"]}) `}
                    <img
                        width="32"
                        height="24"
                        alt={`${'us'}`}
                        src={`https://flagcdn.com/32x24/${userData["code"]}.png`}
                        srcSet={`https://flagcdn.com/64x48/${userData["code"]}.png 2x,
                                    https://flagcdn.com/96x72/${userData["code"]}.png 3x`} />
                </Typography>
            </div>}
            <div className="clock">
                <Typography variant="h4" sx={{
                    color: "#ffffff", backgroundColor: "#023047",
                    borderRadius: "10%", padding: "5px 0"
                }}>
                    {`${myMinutes.toString().padStart(2, "0")}:${mySeconds.toString().padStart(2, "0")}`}
                </Typography>
            </div>
        </div>
    );
}

export default Time;
