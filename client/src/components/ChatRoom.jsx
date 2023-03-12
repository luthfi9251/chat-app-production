import style from "./ChatRoom.module.css";
import ChatBubble from "./ChatBubble";
import SidebarContext from "../context/SidebarContext";
import UserContext from "../context/UserContext";
import useWindowSize from "../../hooks/useWindowSize";
import hamburgerIcon from "../assets/hamburger-icon.png";
import sendIcon from "../assets/send_icon.png";
import { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../config/axios";
import config from "../../config.json";

export default function ChatRoom() {
    let BASE_URL = config.socketUrl;

    let [text, setText] = useState("");
    let [chat, setChat] = useState([]);
    let { handleOpenAndClose, roomActive, friendActive } =
        useContext(SidebarContext);
    let { user } = useContext(UserContext);
    let size = useWindowSize();
    const socket = useRef();
    const bottom = useRef(null);

    const scrollToBottom = () => {
        // console.log(bottom.current.scrollHeight);
        // let y = bottom.current.scrollHeight + 567890;
        bottom.current?.scrollIntoView({
            lock: "nearest",
            inline: "center",
            behavior: "smooth",
            alignToTop: false,
        });
        // bottom.current.scrollTop = y;
    };

    useEffect(() => {
        socket.current = io(BASE_URL);

        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        // console.log(chat);
        socket.current.on("incoming", handleNewMessage);
        scrollToBottom();
        return () => {
            socket.current.off("incoming", handleNewMessage);
        };
    }, [socket.current, chat]);

    useEffect(() => {
        // console.log("reset room chat");
        // setChat([]);
        if (roomActive !== 0) {
            // socket.current.emit("leave room", roomActive);
            socket.current.emit("join room", roomActive);
            axiosInstance
                .get(`/chatapi/chat?conid=${roomActive}`)
                .then((res) => {
                    // console.log(res);
                    setChat(res.data);
                    scrollToBottom();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [roomActive]);

    let handleSendMessage = () => {
        if (text === "") return;
        let body = {
            text: text,
            senderId: user._id,
        };
        axiosInstance
            .post(`/chatapi/chat?conid=${roomActive}`, body)
            .then((res) => {
                // console.log(res);
                body.createdAt = new Date().toISOString();
                // setChat([...chat, body]);
                // console.log(chat);
                setText("");
                scrollToBottom();
            })
            .catch((err) => {
                console.log(err);
            });
        // console.log(friendActive);
        socket.current.emit("message", {
            text,
            roomActive,
            senderId: user._id,
            createdAt: new Date().toISOString(),
        });
    };

    const handleNewMessage = (data) => {
        // console.log(data);
        // console.log(chat);
        setChat([...chat, data]);
        scrollToBottom();
    };

    if (roomActive === 0) {
        return (
            <div className={style.container}>
                <p className={style.noChat}>Open a chat</p>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <div className={style.header}>
                <img
                    onClick={handleOpenAndClose}
                    src={hamburgerIcon}
                    style={{ display: size.width >= 768 ? "none" : "block" }}
                    className={style.icon}
                    alt="icon"
                />
                <div className={style.wrapper}>
                    <img
                        src={friendActive.profilePicture}
                        className={style.profile}
                        alt="Profil Picture"
                    />
                    <span>{friendActive.name}</span>
                </div>
            </div>
            <div className={style.chat}>
                {chat.map((item, i) => {
                    return (
                        <ChatBubble
                            key={i}
                            isSelf={item.senderId === user._id}
                            data={item}
                        />
                    );
                })}
                <div className={style.bottom} ref={bottom}></div>
            </div>
            <div className={style.footer}>
                <input
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <button onClick={handleSendMessage}>
                    <img src={sendIcon} alt="" />
                </button>
            </div>
        </div>
    );
}
