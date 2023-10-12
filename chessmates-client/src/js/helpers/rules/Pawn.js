import Piece from './Piece.js';

export default class Pawn extends Piece {
    constructor(myColor, pieces, from_i, from_j, gameOptions) {
        super(myColor, pieces, from_i, from_j, gameOptions);
        this.move = this.myColor === "white" ? -1 : 1;
    }

    // return arr with possible moves without king validation
    // note that attacked sqaures are diffrent
    psedoLogicalMoves() {
        const startPos = this.myColor === "white" ? 6 : 1;
        let res = []
        let desJ = this.from_j, desI = this.from_i + 1 * this.move;
        if (Piece.pieceColor(this.pieces[desI][desJ]) === "none") {
            res.push({ "i": desI, "j": desJ })
            desI += 1 * this.move;
            if (this.from_i === startPos && Piece.pieceColor(this.pieces[desI][desJ]) === "none") {
                res.push({ "i": desI, "j": desJ })
                // set en passent - server side
            }
        }
        const attacked = this.attacked();
        res.push(...attacked);
        return res;
    }

    attacked() {
        let res = []
        let desJ = this.from_j + 1, desI = this.from_i + 1 * this.move;
        const opponent = this.myColor === "white" ? "black" : "white";
        const passant = this.gameOptions["en passant"];
        if (desJ < 8 && desJ >= 0) {
            if (Piece.pieceColor(this.pieces[desI][desJ]) === opponent) {
                res.push({ "i": desI, "j": desJ });
            }
            else if (passant && passant["i"] === desI && passant["j"] === desJ) {
                res.push({ "i": desI, "j": desJ });
            }
        }
        desJ = this.from_j - 1;
        if (desJ < 8 && desJ >= 0) {
            if (Piece.pieceColor(this.pieces[desI][desJ]) === opponent) {
                res.push({ "i": desI, "j": desJ });
            }
            else if (passant && passant["i"] === desI && passant["j"] === desJ) {
                res.push({ "i": desI, "j": desJ });
            }
        }
        return res;
    }

    validMoves() {
        const copyPieces = JSON.parse(JSON.stringify(this.pieces));
        copyPieces[this.from_i][this.from_j] = null;
        const passant = this.gameOptions["en passant"];
        const logical = this.psedoLogicalMoves();
        let res = [];
        logical.forEach((element, index) => {
            let i, j;
            if (index !== 0) {
                copyPieces[this.from_i][this.from_j] = this.name;
                i = logical[index - 1]["i"]; j = logical[index - 1]["j"];
                if (passant && passant["i"] === i && passant["j"] === j) {
                    copyPieces[i + -1 * this.move][j] = this.pieces[i + -1 * this.move][j];
                }
                copyPieces[i][j] = this.pieces[i][j];
            }
            copyPieces[this.from_i][this.from_j] = null;
            i = element["i"]; j = element["j"];
            copyPieces[i][j] = this.name;
            if (passant && passant["i"] === i && passant["j"] === j) {
                copyPieces[i + -1 * this.move][j] = null;
            }
            if (!this.kingAttacked(copyPieces)) {
                res.push(element);
            }
        })

        return res;
    }
}