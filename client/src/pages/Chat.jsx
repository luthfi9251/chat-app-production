import axiosInstance from "../../config/axios";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import styles from "./Chat.module.css";
import Sidebar from "../components/Sidebar";
import ChatRoom from "../components/ChatRoom";
import useWindowSize from "../../hooks/useWindowSize";
import SidebarContext from "../context/SidebarContext";
import { useEffect, useState } from "react";

export default function ChatPage() {
    let size = useWindowSize();
    let [isOpen, setIsOpen] = useState(true);
    let [roomActive, setRoomActive] = useState(0);
    let [friendActive, setFriendActive] = useState({});
    let { setUser } = useContext(UserContext);

    let handleOpenAndClose = () => {
        if (size.width < 768) {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        if (size.width >= 768) {
            setIsOpen(true);
        } // Set sidebar open when screen > 768
    }, [size.width]);

    useEffect(() => {
        axiosInstance
            .get(`/api/getprofile`, {
                withCredentials: true,
            })
            .then((res) => {
                // console.log(res.data.data);
                setUser(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    let contextValue = {
        isOpen,
        setIsOpen,
        handleOpenAndClose,
        roomActive,
        setRoomActive,
        friendActive,
        setFriendActive,
    };

    return (
        <div className={styles.container}>
            <SidebarContext.Provider value={contextValue}>
                <Sidebar />
                <ChatRoom />
            </SidebarContext.Provider>
        </div>
    );
}
