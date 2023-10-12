import validMove, { doMove, pieceColor, optionsMoves } from "../helpers/rules/rules";
import { useSocket } from "../contexts/SocketProvider";
import { useAuth } from "../contexts/AuthProvider";
import { uci, startColors } from "../constants";

const Square = ({ s_color, colors, setColors, path, currPiece, setCurrPiece, ind, pieces, setPieces, currInd,
    setCurrInd, isTurn, game_color, setOpen, setPoromotJ, dots, setDots, gameOptions, playMove, puzzle }) => {
    const socket = useSocket();
    const { auth } = useAuth();

    const changeColor = (color) => {
        setColors(prevState => {
            const newColors = JSON.parse(JSON.stringify(prevState));
            newColors[Math.floor(ind / 8)][ind % 8] = color;
            return newColors;
        })
    }

    return (
        <div className="square" style={{ backgroundColor: colors[Math.floor(ind / 8)][ind % 8] }}
            onClick={() => {
                if (currPiece === "empty" && path && game_color === pieceColor(path.charAt(7))) {
                    if (!isTurn) return;
                    changeColor("#d0d46c");

                    const options = optionsMoves(isTurn, game_color,
                        Math.floor(ind / 8), ind % 8, pieces, gameOptions);
                    if (options) {
                        setDots(prevState => {
                            const newDots = JSON.parse(JSON.stringify(prevState));
                            options.forEach(element => {
                                newDots[element["i"]][element["j"]] = true;
                            });
                            return newDots;
                        })
                        setCurrPiece(path);
                        setCurrInd(ind);
                    }

                }
                else if (currInd === ind) {
                    changeColor(s_color);
                    setCurrPiece("empty");
                    setCurrInd(null);
                    setDots(Array(8).fill(Array(8).fill(null)))
                }
                else if (currPiece !== "empty") {
                    if (validMove(isTurn, game_color, Math.floor(currInd / 8), currInd % 8,
                        Math.floor(ind / 8), ind % 8, pieces, setOpen, setPoromotJ, gameOptions, setPieces)) {
                        // changeColor("#b0a43c");
                        // setColors(JSON.parse(JSON.stringify(startColors)));
                        setCurrPiece("empty");
                        setCurrInd(null);
                        setDots(Array(8).fill(Array(8).fill(null)))
                        const move = uci[(currInd % 8)] + (8 - Math.floor(currInd / 8)).toString() +
                            uci[(ind % 8)] + (8 - Math.floor(ind / 8)).toString();
                        // console.log("~ emittt move", move)
                        if (playMove) {
                            doMove(game_color, Math.floor(currInd / 8), currInd % 8, Math.floor(ind / 8), ind % 8,
                                pieces, gameOptions, "noPromotionPiece", setPieces, gameOptions["en passant"])
                            setColors(startColors);
                        }
                        else {
                            socket.emit(puzzle ? "puzzle_move" : "move", { "auth": auth, "move": move })
                        }
                    }
                }

            }}>
            {console.log("1")}
            <div className="piece">
                {dots[Math.floor(ind / 8)][ind % 8] && <span className="dot"></span>}
                {path && <img src={path} draggable="false" alt="chess-piece" />}
            </div>
        </div>);
}

export default Square;