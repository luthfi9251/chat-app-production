import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import Contact from "./Contact";
import useWindowSize from "../../hooks/useWindowSize";
import SidebarContext from "../context/SidebarContext";
import UserContext from "../context/UserContext";

import profileIcon from "../assets/profile_icon.png";
import settingIcon from "../assets/setting_icon.png";
import logOutIcon from "../assets/log_out_icon.png";
import addIcon from "../assets/add-icon.png";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "../../config/axios";

const linkList = [
    {
        icon: profileIcon,
        href: "/profile",
    },
    {
        icon: addIcon,
        href: "/friends",
    },
    {
        icon: settingIcon,
        href: "/",
    },
    {
        icon: logOutIcon,
        href: "/",
    },
];

function LinkIcon({ data }) {
    return (
        <div className={style.linkItem}>
            <Link to={data.href} className={style.linkComp}>
                <img src={data.icon} alt="icon" className={style.linkImage} />
            </Link>
        </div>
    );
}

export default function Sidebar() {
    let { isOpen } = useContext(SidebarContext);
    let { user } = useContext(UserContext);
    let [friend, setFriend] = useState([]);
    let [search, setSearch] = useState("");

    let getFriend = () => {
        axiosInstance
            .get(`/chatapi/?search=${search}`)
            .then((res) => {
                // console.log(res);
                setFriend(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        // console.log(axiosInstance);
        getFriend();
    }, []);

    useEffect(() => {
        // console.log(axiosInstance);
        getFriend();
    }, [search]);

    return (
        <div
            className={style.container}
            style={{
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            }}
        >
            <div className={style.navbar}>
                <div className={style.profilePict}>
                    <img
                        src={user.profilePicture}
                        alt="profile pict"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className={style.linkContainer}>
                    {linkList.map((item, key) => {
                        return <LinkIcon key={key} data={item} />;
                    })}
                </div>
            </div>
            <div className={style.contactContainer}>
                <div className={style.searchContainer}>
                    <input
                        type="text"
                        placeholder="search friends"
                        className={style.search}
                        onChange={handleSearch}
                        value={search}
                    />
                </div>
                <div className={style.contactWrapper}>
                    {friend.map((item, i) => {
                        return <Contact key={i} data={item} />;
                    })}
                </div>
            </div>
        </div>
    );
}
