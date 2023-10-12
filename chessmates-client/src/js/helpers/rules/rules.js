import Bishop from "./Bishop";
import Knight from "./Knight";
import Rook from "./Rook";
import Queen from "./Queen";
import King from "./King";
import Pawn from "./Pawn";

export const pieceColor = (piece) => {
    switch (piece) {
        case ("p"):
        case ("n"):
        case ("b"):
        case ("r"):
        case ("q"):
        case ("k"):
            return "black";
        case ("P"):
        case ("N"):
        case ("B"):
        case ("R"):
        case ("Q"):
        case ("K"):
            return "white";
        default:
            return "none";
    }
}

export const createPiece = (piece, color, pieces, from_i, from_j, gameOptions) => {
    switch (piece) {
        case ("n"):
        case ("N"):
            return new Knight(color, pieces, from_i, from_j, gameOptions);
        case ("b"):
        case ("B"):
            return new Bishop(color, pieces, from_i, from_j, gameOptions);
        case ("r"):
        case ("R"):
            return new Rook(color, pieces, from_i, from_j, gameOptions);
        case ("q"):
        case ("Q"):
            return new Queen(color, pieces, from_i, from_j, gameOptions);
        case ("k"):
        case ("K"):
            return new King(color, pieces, from_i, from_j, gameOptions);
        case ("P"):
        case ("p"):
            return new Pawn(color, pieces, from_i, from_j, gameOptions);
        default:
            return alert("No such piece");
    }
}

export const switchPieces = (setPieces, from_i, from_j, to_i, to_j) => {
    setPieces(prevState => {
        const newPieces = JSON.parse(JSON.stringify(prevState));
        newPieces[to_i][to_j] = newPieces[from_i][from_j];
        newPieces[from_i][from_j] = null;
        return newPieces;
    })
}

export const optionsMoves = (Isturn, color, from_i, from_j, pieces, gameOptions) => {
    console.log("~ Isturn", Isturn)
    if (Isturn === false) {
        return false;
    }
    const piece = pieces[from_i][from_j];
    const p = createPiece(piece, color, pieces, from_i, from_j, gameOptions);
    // console.log("~ p", p)
    const res = p.validMoves();
    return res;
}

// move is Legal
export const doMove = (color, from_i, from_j, to_i, to_j, pieces, gameOptions, promotionPiece, setPieces, passant) => {
    console.log("~ color", color)

    console.log("~ from_j", from_j)
    console.log("~ from_i", from_i)
    console.log("~ to_j", to_j)
    console.log("~ to_i", to_i)
    console.log("~ passant", passant)

    console.log("~ okkkkkk pieces", pieces)

    const piece = pieces[from_i][from_j];
    console.log("~ okkkkkk piece", piece)
    const p = createPiece(piece, color, pieces, from_i, from_j, gameOptions);


    if (piece === "P" || piece === "p") {
        const promotion = color === "white" ? 0 : 7;
        if (to_i === promotion) {
            setPieces(prevState => {
                const newPieces = JSON.parse(JSON.stringify(prevState));
                newPieces[to_i][to_j] = promotionPiece;
                newPieces[from_i][from_j] = null;
                return newPieces;
            });
            return;
        }
        if (passant && passant["i"] === to_i && passant["j"] === to_j) {
            setPieces(prevState => {
                const newPieces = JSON.parse(JSON.stringify(prevState));
                newPieces[to_i + -1 * p.move][to_j] = null;
                return newPieces;
            })
        }
    }
    else if ((piece === "k" || piece === "K") && Math.abs(from_j - to_j) === 2) {
        if (from_j > to_j) {
            setPieces(prevState => {
                const newPieces = JSON.parse(JSON.stringify(prevState));
                [newPieces[to_i][from_j - 1], newPieces[to_i][from_j - 4]] = [newPieces[to_i][from_j - 4], newPieces[to_i][from_j - 1]];
                return newPieces;
            })
        }
        else {
            setPieces(prevState => {
                const newPieces = JSON.parse(JSON.stringify(prevState));
                [newPieces[to_i][from_j + 1], newPieces[to_i][from_j + 3]] = [newPieces[to_i][from_j + 3], newPieces[to_i][from_j + 1]];
                return newPieces;
            })
        }
    }
    switchPieces(setPieces, from_i, from_j, to_i, to_j);

}
const validMove = (Isturn, color, from_i, from_j, to_i, to_j,
    pieces, setOpen, setPoromotJ, gameOptions) => {
    if (Isturn === false) {
        return false;
    }
    const piece = pieces[from_i][from_j];

    const p = createPiece(piece, color, pieces, from_i, from_j, gameOptions);
    const res = p.isMovePossible(to_i, to_j);
    if (piece === "P" || piece === "p") {
        const promotion = color === "white" ? 0 : 7;
        if (res && to_i === promotion) {
            setPoromotJ(to_j);
            setOpen(true);
            return false;
        }
    }
    return res;

}

export default validMove;
