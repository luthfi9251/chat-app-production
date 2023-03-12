import { useState, useContext, useEffect } from "react";
import axiosInstance from "../../config/axios";
import style from "./FriendItem.module.css";
import UserContext from "../context/UserContext";
import trashIcon from "../assets/trash-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import addIcon from "../assets/add-icon.png";
import checkIcon from "../assets/check-icon.png";

export default function FriendItem({ mode, data, setter }) {
    let { user, setUser } = useContext(UserContext);
    // data = data[0]
    // let setter = data[1]

    let handleAddFriend = () => {
        let dataBody = {
            conversationId: null,
            accepted: 0,
            requestBy: user._id,
            member: [user._id, data._id],
        };
        console.log(dataBody);
        axiosInstance
            .post(`/api/addfriend`, dataBody, { withCredentials: true })
            .then((res) => {
                console.log(res);
                setUser(res.data.data);
                setter();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let handlePendingUser = () => {
        let action = data.isSelf ? "rejected" : "accepted";
        axiosInstance
            .post(
                `/api/pendinguser?action=${action}`,
                { member: [user._id, data._id] },
                { withCredentials: true }
            )
            .then((res) => {
                console.log(res);
                setUser(res.data.data);
                setter();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let handleDeleteFriends = () => {
        axiosInstance
            .post(
                `/api/deletefriend`,
                { member: [user._id, data._id] },
                { withCredentials: true }
            )
            .then((res) => {
                console.log(res);
                setUser(res.data.data);
                setter();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    switch (mode) {
        case 0:
            return (
                <div className={style.container}>
                    <img
                        src={data.profilePicture}
                        alt="profile"
                        referrerPolicy="no-referrer"
                    />
                    <div>
                        <span className={style.name}>{data.name}</span>
                        <span className={style.userName}>{data.username}</span>
                    </div>
                    <button onClick={handleDeleteFriends}>
                        <img
                            src={
                                mode === 0
                                    ? trashIcon
                                    : mode === 1
                                    ? addIcon
                                    : deleteIcon
                            }
                            alt=""
                        />
                    </button>
                </div>
            );
        case 2:
            return (
                <div className={style.container}>
                    <img
                        src={data.profilePicture}
                        alt="profile"
                        referrerPolicy="no-referrer"
                    />
                    <div>
                        <span className={style.name}>{data.name}</span>
                        <span className={style.userName}>{data.username}</span>
                        <span className={style.info}>
                            {data.isSelf ? "Request sent!" : "Friend request"}
                        </span>
                    </div>
                    <button onClick={handlePendingUser}>
                        <img
                            src={data.isSelf ? deleteIcon : checkIcon}
                            alt=""
                        />
                    </button>
                </div>
            );
        default:
            return (
                <div className={style.container}>
                    <img
                        src={data.profilePicture}
                        alt="profile"
                        referrerPolicy="no-referrer"
                    />
                    <div>
                        <span className={style.name}>{data.name}</span>
                        <span className={style.userName}>{data.username}</span>
                    </div>
                    <button onClick={handleAddFriend}>
                        <img
                            src={
                                mode === 0
                                    ? trashIcon
                                    : mode === 1
                                    ? addIcon
                                    : deleteIcon
                            }
                            alt=""
                        />
                    </button>
                </div>
            );
    }
}
