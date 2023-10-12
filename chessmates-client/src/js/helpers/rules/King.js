import Piece from './Piece.js';

export default class King extends Piece {


    // return arr with attacked squares without king validation
    psedoLogicalMoves() {
        const res = this.attacked()
        const queens = this.gameOptions["q"], kings = this.gameOptions["k"];
        if (queens && this.pieces[this.from_i][this.from_j + 1] === null &&
            this.pieces[this.from_i][this.from_j + 2] === null) {
            // console.log("~ queens", queens)

            const copyPieces = JSON.parse(JSON.stringify(this.pieces));
            copyPieces[this.from_i][this.from_j] = null
            copyPieces[this.from_i][this.from_j + 1] = this.pieces[this.from_i][this.from_j];
            if (!this.kingAttacked(copyPieces)) {
                res.push({ "i": this.from_i, "j": this.from_j + 2 });
            }
        }
        if (kings && this.pieces[this.from_i][this.from_j - 1] === null &&
            this.pieces[this.from_i][this.from_j - 2] === null &&
            this.pieces[this.from_i][this.from_j - 3] === null) {
            // console.log("~ kings", queens)

            const copyPieces = JSON.parse(JSON.stringify(this.pieces));
            copyPieces[this.from_i][this.from_j] = null
            copyPieces[this.from_i][this.from_j - 1] = this.pieces[this.from_i][this.from_j];
            if (!this.kingAttacked(copyPieces)) {
                res.push({ "i": this.from_i, "j": this.from_j - 2 });
            }
        }
        return res
    }

    attacked() {
        // All possible moves of a king
        const X = [0, 0, -1, -1, -1, 1, 1, 1];
        const Y = [1, -1, 1, -1, 0, 1, -1, 0];
        let res = []
        // Check if each possible move is valid or not
        for (let i = 0; i < 8; i++) {
            // Position of king after move
            let x = this.from_i + X[i];
            let y = this.from_j + Y[i];
            if (x < 8 && x >= 0 && y < 8 && y >= 0 &&
                Piece.pieceColor(this.pieces[x][y]) !== this.myColor) {
                res.push({ "i": x, "j": y });
            }
        }
        return res;
    }

}