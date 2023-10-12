import Piece from './Piece.js';

export default class Rook extends Piece {


    // return arr with attacked squares without king validation
    psedoLogicalMoves() {
        // rook moves
        const X = [1, -1, 0, 0];
        const Y = [0, 0, -1, 1];
        let res = []
        // Check if each possible move is valid or not
        for (let i = 0; i < 4; i++) {
            // Position of rook after move
            let x = X[i] + this.from_i;
            let y = Y[i] + this.from_j;
            while (x < 8 && x >= 0 && y < 8 && y >= 0 &&
                Piece.pieceColor(this.pieces[x][y]) !== this.myColor) {
                res.push({ "i": x, "j": y })
                if (Piece.pieceColor(this.pieces[x][y]) !== "none") break;
                x += X[i]; y += Y[i];
            }
        }
        return res;
    }
}