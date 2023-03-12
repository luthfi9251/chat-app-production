import axiosInstance from "../../config/axios";
import style from "./Friends.module.css";
import FriendItem from "../components/FriendItem";
import PageLayout from "../components/PageLayout";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Friends() {
    let [search, setSearch] = useState("");
    let [active, setActive] = useState(1);
    let [dataAdd, setDataAdd] = useState([]);
    let [dataFriend, setDataFriend] = useState([]);
    let [dataPending, setDataPending] = useState([]);
    let { user, setUser } = useContext(UserContext);
    let navigate = useNavigate();

    let getAllFriendsData = () => {
        axiosInstance
            .get(`/api/getuser?search=${search}`, {
                withCredentials: true,
            })
            .then((res) => {
                setDataAdd(res.data.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/");
                }
                console.log(err);
            });
    };

    let getPendingData = () => {
        axiosInstance
            .get(`/api/getpendingfriends?search=${search}`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log(res.data);
                setDataPending(res.data.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/");
                }
            });
    };

    let getFriendList = () => {
        axiosInstance
            .get(`/api/getallfriends?search=${search}`, {
                withCredentials: true,
            })
            .then((res) => {
                setDataFriend(res.data.data);
                console.log(res.data.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/");
                }
            });
    };

    useEffect(() => {
        switch (active) {
            case 0:
                getFriendList();
                break;
            case 1:
                getAllFriendsData();
                break;
            case 2:
                getPendingData();
                break;
            default:
                break;
        }
    }, [search]);

    useEffect(() => {
        axiosInstance
            .get(`/api/getprofile`, {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    let handleButtonFriend = () => {
        setActive(0);
        getFriendList();
    };
    let handleButtonAddFriend = () => {
        setActive(1);
        getAllFriendsData();
    };
    let handleButtonPendingFriend = () => {
        setActive(2);
        getPendingData();
    };

    return (
        <PageLayout>
            <h2>Friends</h2>
            <div className={style.buttonWrapper}>
                <button
                    className={active === 0 ? style.buttonActive : undefined}
                    onClick={handleButtonFriend}
                >
                    My Friends
                </button>
                <button
                    className={active === 1 ? style.buttonActive : undefined}
                    onClick={handleButtonAddFriend}
                >
                    Add Friends
                </button>
                <button
                    className={active === 2 ? style.buttonActive : undefined}
                    onClick={handleButtonPendingFriend}
                >
                    Pending
                </button>
            </div>
            <div className={style.list}>
                <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FriendWrapper
                    mode={active}
                    data={[
                        [dataFriend, getFriendList],
                        [dataAdd, getAllFriendsData],
                        [dataPending, getPendingData],
                    ]}
                />
            </div>
        </PageLayout>
    );
}

function FriendWrapper({ mode, data }) {
    return (
        <>
            {data[mode][0].map((item, i) => {
                return (
                    <FriendItem
                        mode={mode}
                        data={item}
                        setter={data[mode][1]}
                        key={i}
                    />
                );
            })}
        </>
    );
}
