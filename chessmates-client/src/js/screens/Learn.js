import Navbar from "../Navbar";
import Select from 'react-select';
import "../../css/learn.css";
import { useState } from "react";
import { customStyles } from "../constants";
import Typography from '@mui/material/Typography';
import DeomBoard from "../board/DemoBoard";

const pieces = ["Rook", "Knight", "Pawn", "Bishop", "Queen", "King", "Castle", "Checkmate", "En passant"]
const instructions = {
    "Rook": "The Rook moves in straight lines.",
    "Knight": "The Knight jumps like the letter L",
    "Pawn": "Pawns move one square forward but capture diagonally. \
    On the second rank can move 2 squares at once. \
    When they reach the other side of the board, they become a stronger piece!",
    "Bishop": "The Bishop moves diagonally",
    "Queen": "The Queen is like Rook and Bishop. It moves in straight lines or diagonally.",
    "King": "The king move only one square in any direction but cannot be attacked.",
    "Castle": "Castle is moving the king two squres right or left and the rook on the same time. \
    You cannot castle if the king has already moved or the rook has already moved or king is attacked on the way.",
    "Checkmate": "Checkmate is the way to win a chess game. \
    You need to trap your opponent king and attack him. Look at athe board. \
    The game is over - Black won!",
    "En passant": "Black just moved the pawn by two squares! Take it en passant. \
    En passant only works immediately after the opponent moved the pawn."
}
const deafOptions = {
    "k": false,
    "q": false,
    "en passant": {
        "i": -1,
        "j": -1
    }
}
const demo = {
    "Rook": {
        "fen": "8/8/8/8/3R4/8/8/8",
        "options": deafOptions
    },
    "Knight": {
        "fen": "8/8/8/8/3N4/8/8/8",
        "options": deafOptions
    },
    "Bishop": {
        "fen": "8/8/8/8/3B4/8/8/8",
        "options": deafOptions
    },
    "Queen": {
        "fen": "8/8/8/8/3Q4/8/8/8",
        "options": deafOptions
    },
    "King": {
        "fen": "8/8/8/8/3K4/8/3q4/8",
        "options": deafOptions
    },
    "Pawn": {
        "fen": "6b1/3n4/5r2/8/8/8/4P3/8",
        "options": deafOptions
    },
    "Castle": {
        "fen": "8/8/8/8/8/8/8/R3K2R",
        "options": {
            "k": true,
            "q": true,
            "en passant": {
                "i": -1,
                "j": -1
            }
        }
    },
    "Checkmate": {
        "fen": "rnb1k1nr/pppp1ppp/8/2b1N3/4P3/2N5/PPPP1qPP/R1BQKB1R",
        "options": deafOptions,
        "not_playable": true
    },
    "En passant": {
        "fen": "8/8/8/3pP3/8/8/8/8",
        "options": {
            "k": false,
            "q": false,
            "en passant": {
                "i": 2,
                "j": 3
            }
        }
    }
}

const Learn = () => {

    const [currPiece, setCurrPiece] = useState("Rook");
    return (
        <div className="learn-container">
            <Navbar />
            <div className="learn-content">
                <div className="board-container">
                    <DeomBoard fenString={demo[currPiece]["fen"]}
                        gameOptions={demo[currPiece]["options"]} />
                </div>
                <div className="learn-text">
                    <Select options={pieces.map((option) => ({ value: option, label: option }))}
                        value={{ value: currPiece, label: currPiece }}
                        onChange={(e) => {
                            setCurrPiece(e.value);
                        }}
                        styles={customStyles}
                        isSearchable={false}
                    />
                    <div className="instructions">
                        <Typography variant="h4" gutterBottom sx={{ marginTop: "4vh", paddingLeft: "1vw" }}>
                            {instructions[currPiece]}
                        </Typography>
                        <Typography variant="h4" sx={{ paddingLeft: "1vw" }}>
                            {!demo[currPiece]["not_playable"] && "Try to move it on the demo board."}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Learn;