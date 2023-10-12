import Piece from './Piece.js';

export default class Knight extends Piece {


    // return arr with attacked squares without king validation
    psedoLogicalMoves() {
        // All possible moves of a knight
        const X = [2, 1, -1, -2, -2, -1, 1, 2];
        const Y = [1, 2, 2, 1, -1, -2, -2, -1];
        let res = []
        // Check if each possible move is valid or not
        for (let i = 0; i < 8; i++) {
            // Position of knight after move
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