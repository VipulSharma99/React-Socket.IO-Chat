import React, { useEffect, useState } from "react";
import ScrolltoBottom from "react-scroll-to-bottom";

const Chat = (props) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: props.room,
                author: props.username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes() +
                    ":",
            };
            await props.socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        props.socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [props.socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrolltoBottom className="message-container">
                    {messageList?.map((messageContent, i) => {
                        return (
                            <div
                                className="message"
                                id={
                                    props.username === messageContent.author
                                        ? "you"
                                        : "other"
                                }>
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">
                                            {messageContent.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrolltoBottom>
            </div>
            <div className="chat-footer">
                <input
                    value={currentMessage}
                    type="text"
                    placeholder="Hey..."
                    onChange={(e) => {
                        setCurrentMessage(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        e.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;
