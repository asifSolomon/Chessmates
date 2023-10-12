import Board from "./Board";
import { useSocket } from "../contexts/SocketProvider";
import { useState, useEffect } from "react";
import { doMove } from "../helpers/rules/rules";
import { FEN, startColors, uci } from "../constants"

const GameBoard = ({ inGame, gameColor, fen, puzzle }) => {
    const socket = useSocket();
    const [pieces, setPieces] = useState();
    const [isTurn, setIsTurn] = useState(inGame && gameColor === "white");
    const [colors, setColors] = useState(null);
    const [gameOptions, setGameOptions] = useState({
        "k": false,
        "q": false,
        "en passant": {
            "i": -1,
            "j": -1
        }
    });
    useEffect(() => {
        setIsTurn(inGame && gameColor === "white");
    }, [inGame, gameColor]);
    useEffect(() => {
        setPieces(FEN(fen));
        setColors(JSON.parse(JSON.stringify(startColors)));
    }, [inGame, fen])

    useEffect(() => {
        if (socket == null) return;
        const handle_move = (data) => {
            setIsTurn((prev) => !prev)
            const move = data["move"]
            const i = move[1], j = uci.indexOf(move[0]), desI = move[3], desJ = uci.indexOf(move[2]);
            doMove(data["color"], i, j, desI, desJ, pieces, gameOptions, data["promotionPiece"], setPieces, gameOptions["en passant"])
            const newColors = JSON.parse(JSON.stringify(startColors));
            newColors[i][j] = "#d0d46c";
            newColors[desI][desJ] = "#b0a43c";
            setColors(newColors);
            setGameOptions(data["game_options"])
        }
        socket.on("move", handle_move)
        return () => {
            // console.log("~ nooooo")
            if (socket != null) {
                socket.off('move', handle_move);
            }
        }
    }, [socket, pieces, gameOptions])
    return (
        <Board gameColor={gameColor} isTurn={isTurn} gameOptions={gameOptions} pieces={pieces}
            setPieces={setPieces} colors={colors} setColors={setColors} puzzle={puzzle} />
    );
}

export default GameBoard;