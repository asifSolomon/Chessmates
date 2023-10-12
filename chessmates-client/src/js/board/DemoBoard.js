import Board from "./Board";
import { useState, useEffect } from "react";
import { FEN, startColors } from "../constants"

const DeomBoard = ({ gameOptions, fenString }) => {
    const [pieces, setPieces] = useState();
    const [colors, setColors] = useState(null);

    useEffect(() => {
        setPieces(FEN(fenString));
        setColors(JSON.parse(JSON.stringify(startColors)));
    }, [fenString, gameOptions])

    return (
        <Board gameColor={"white"} isTurn={true} gameOptions={gameOptions} pieces={pieces}
            setPieces={setPieces} colors={colors} setColors={setColors} playMove={true} />
    );
}

export default DeomBoard;