import Square from "./Square";
import { useState, useMemo, useEffect } from "react";
import PromotionDialog from "../helpers/promotion";
import { black, white } from "../constants";

const Board = ({ gameColor, isTurn, gameOptions, pieces, setPieces, colors, setColors, playMove, puzzle }) => {
    const [dots, setDots] = useState(Array(8).fill(Array(8).fill(null)));
    const [currPiece, setCurrPiece] = useState("empty");
    const [currInd, setCurrInd] = useState(null);
    const [open, setOpen] = useState(false);
    const [poromotJ, setPoromotJ] = useState(null);
    let isBlack = gameColor === "black";

    useEffect(() => {
        setDots(Array(8).fill(Array(8).fill(null)));
        setCurrInd(null);
        setCurrPiece("empty");

    }, [pieces]);

    const curr_board = useMemo(() => {
        return colors && pieces && (isBlack ? pieces.slice(0).reverse() : pieces).map((line, i) => {
            return line && (isBlack ? line.slice(0).reverse() : line).map((piece, j) => {
                return <Square
                    path={piece ? `pieces/${piece}.png` : piece}
                    key={isBlack ? (7 - i) * 8 + (7 - j) : i * 8 + j}
                    ind={isBlack ? (7 - i) * 8 + (7 - j) : i * 8 + j}
                    s_color={((i + j) % 2) ? black : white}
                    pieces={pieces}
                    setPieces={setPieces}
                    colors={colors}
                    setColors={setColors}
                    currPiece={currPiece}
                    setCurrPiece={setCurrPiece}
                    currInd={currInd}
                    setCurrInd={setCurrInd}
                    game_color={gameColor}
                    isTurn={isTurn}
                    setOpen={setOpen}
                    setPoromotJ={setPoromotJ}
                    dots={dots}
                    setDots={setDots}
                    gameOptions={gameOptions}
                    playMove={playMove}
                    puzzle={puzzle}
                />
            })
        })
    }, [pieces, dots, colors, currInd, currPiece, gameOptions, isTurn, gameColor]);

    return (
        <div>  <div className="chessboard">{pieces && curr_board} </div>
            <PromotionDialog
                open={open}
                setOpen={setOpen}
                color={gameColor}
                currInd={currInd}
                poromotJ={poromotJ}
                setPieces={setPieces}
                pieces={pieces}
                setColors={setColors}
                setCurrInd={setCurrInd}
                setCurrPiece={setCurrPiece}
                setDots={setDots}
                playMove={playMove}
                puzzle={puzzle}
            />
        </div>

    );
}

export default Board;