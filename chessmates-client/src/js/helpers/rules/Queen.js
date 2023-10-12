import Piece from './Piece.js';
import Bishop from './Bishop.js';
import Rook from './Rook.js';

export default class Queen extends Piece {

    // return arr with attacked squares without king validation
    psedoLogicalMoves() {
        let res = []
        const b = new Bishop(this.myColor, this.pieces, this.from_i, this.from_j, this.gameOptions).psedoLogicalMoves()
        const r = new Rook(this.myColor, this.pieces, this.from_i, this.from_j, this.gameOptions).psedoLogicalMoves()
        res.push(...b, ...r);
        return res;
    }

}
