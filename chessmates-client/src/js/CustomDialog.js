import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';


const CustomDialog = ({ title, open, setOpen, body, over, won }) => {
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle> {title} </DialogTitle>
            {body && <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
                {over && (won ?
                    <img src={"/win.png"} style={{ maxHeight: "200px" }} /> :
                    <img src={"/lose.png"} style={{ maxHeight: "200px" }} />)}
            </DialogContent>}
        </Dialog>
    );
}

export default CustomDialog;