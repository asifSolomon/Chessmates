import { createPiece } from "./rules";

export default class Piece {
    constructor(myColor, pieces, from_i, from_j, gameOptions) {
        this.myColor = myColor;
        this.pieces = pieces;
        this.from_i = from_i
        this.from_j = from_j
        this.name = this.pieces[this.from_i][this.from_j];
        this.gameOptions = gameOptions
    }

    static pieceColor = (piece) => {
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
    psedoLogicalMoves() { alert("should be override") };
    attacked() {
        return this.psedoLogicalMoves();
    }

    kingAttacked(copyPieces) {
        let king = this.myColor === "white" ? "K" : "k", done = false;
        for (let i = 0; i < 8 && !done; i++) {
            for (let j = 0; j < 8 && !done; j++) {
                if (copyPieces[i][j] === king) {
                    king = { "i": i, "j": j };
                    done = true;
                }
            }
        }
        const opponent = this.myColor === "white" ? "black" : "white";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = copyPieces[i][j];
                if (Piece.pieceColor(piece) === opponent) {
                    const p = createPiece(piece, opponent, copyPieces, i, j, this.gameOptions);
                    const attacked = p.attacked();
                    if (!attacked) {
                        continue;
                    }
                    const ans = attacked.some(curr => king["i"] === curr["i"] && king["j"] === curr["j"]);
                    if (ans) {
                        return ans;
                    }
                }
            }
        }
        return false;
    }

    validMoves() {
        const copyPieces = JSON.parse(JSON.stringify(this.pieces));
        copyPieces[this.from_i][this.from_j] = null;
        const logical = this.psedoLogicalMoves();
        let res = [];
        logical.forEach((element, index) => {
            let i, j;
            if (index !== 0) {
                copyPieces[this.from_i][this.from_j] = this.name;
                i = logical[index - 1]["i"]; j = logical[index - 1]["j"];
                copyPieces[i][j] = this.pieces[i][j];
            }
            copyPieces[this.from_i][this.from_j] = null;
            i = element["i"]; j = element["j"];
            copyPieces[i][j] = this.name;
            if (!this.kingAttacked(copyPieces)) {
                res.push(element);
            }
        })

        return res;
    }

    isMovePossible(to_i, to_j) {
        const move = { "i": to_i, "j": to_j };
        const res = this.validMoves();
        // console.log("~ res", res)
        // console.log("~ move", move)
        return res.some(curr => move["i"] === curr["i"] && move["j"] === curr["j"]);
    }
}