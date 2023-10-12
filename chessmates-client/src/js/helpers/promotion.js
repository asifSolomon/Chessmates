import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { useAuth } from '../contexts/AuthProvider';
import { useSocket } from '../contexts/SocketProvider';
import { uci, startColors } from '../constants';
import { doMove } from './rules/rules';

const PromotionDialog = ({ open, setOpen, color, currInd, poromotJ, setCurrPiece, setCurrInd,
  setDots, playMove, pieces, setPieces, setColors, puzzle }) => {
  const socket = useSocket();
  const { auth } = useAuth();

  const oprionsPieces = color === "black" ? ['b', 'n', 'r', 'q'] : ['B', 'N', 'R', 'Q'];
  const promotI = color === "white" ? 0 : 7;

  const handleClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (value) => {
    setOpen(false);

    setCurrPiece("empty");
    setCurrInd(null);
    setDots(Array(8).fill(Array(8).fill(null)));
    const move = uci[(currInd % 8)] + (8 - Math.floor(currInd / 8)).toString() +
      uci[poromotJ] + (8 - promotI).toString() + value.toLowerCase();
    // console.log("~ move", move)
    if (playMove) {
      doMove("white", Math.floor(currInd / 8), currInd % 8, promotI, poromotJ,
        pieces, "noOptions", value, setPieces, "noOptions")
      setColors(startColors);
    }
    else {
      socket.emit(puzzle ? "puzzle_move" : "move", { "auth": auth, "move": move })
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle> Choose a piece for promotion </DialogTitle>
      {/* spacing, xs part/12 of port for bigger screens, sm = smaller screens */}
      <List component={Stack} direction="row" sx={{ pt: "3vh" }} spacing={{ xs: 8, sm: 4 }}>
        {oprionsPieces.map((piece) => (
          <ListItem button onClick={() => handleListItemClick(piece)} key={piece}>
            <img src={`pieces/${piece}.png`} draggable="false" alt="chess-piece" style={{ maxHeight: "10vh", }} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default PromotionDialog;