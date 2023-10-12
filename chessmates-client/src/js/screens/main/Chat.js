import 'bootstrap/dist/css/bootstrap-grid.min.css'
import "../../../css/chat.css"
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketProvider';
import { useAuth } from '../../contexts/AuthProvider';


const Chat = () => {
    const socket = useSocket();
    const { auth, userData } = useAuth();
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);


    useEffect(() => {
        if (socket == null) return;
        socket.on("chat_message", (data) => {
            setMessages((prev) => {
                const newMessages = [...prev];
                const you = userData["username"] === data["sender"];
                newMessages.push({
                    you: you,
                    text: data["message"],
                    sender: you ? "You" : data["sender"]
                });
                return newMessages;
            })
        })
        return () => {
            if (socket != null) {
                socket.off('chat_message');
            }
        }
    }, [socket, setMessages])
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages]);

    return (
        <div>
            <div className="chat-container">
                <div className="d-flex flex-column flex-grow-1">
                    <div className="d-flex flex-column align-items-start justify-content-end px-3">
                        {messages.map((message, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`my-1 d-flex flex-column  ${message.you ? 'align-self-end align-items-end' : 'align-items-start'}`}
                                >
                                    <div className={`bubble ${message.you ? "bubble-right you" : "bubble-left other"}`}>
                                        {message.text}
                                    </div>
                                    <div style={{ color: "#808080", fontSize: "14px" }}>
                                        {message.sender}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-send">
                <OutlinedInput
                    fullWidth
                    placeholder={"message..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    sx={{ backgroundColor: "#F5F5F5", padding: "2px" }}
                    endAdornment={
                        <InputAdornment position="end">
                            <Button variant="contained" endIcon={<SendIcon />} onClick={
                                (e) => {
                                    e.preventDefault()
                                    if (inputMessage !== "") {
                                        socket.emit("chat_message", { "auth": auth, "message": inputMessage })
                                    }
                                    setInputMessage("")
                                }
                            }>
                                Send
                            </Button>
                        </InputAdornment>
                    }
                />

            </div>
        </div>
    );
}

export default Chat;