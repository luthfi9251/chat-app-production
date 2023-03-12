import { useContext, useEffect, useState, useRef } from "react";
import styles from "./Profile.module.css";
import PageLayout from "../components/PageLayout";
import UserContext from "../context/UserContext";
import axiosInstance from "../../config/axios";

export default function Profile() {
    let { user, setUser } = useContext(UserContext);
    let [image, setImage] = useState(user.profilePicture);
    let [username, setUsername] = useState(user.username);
    let [name, setName] = useState(user.name);
    let [email, setEmail] = useState(user.email);
    let [fileUp, setFileUp] = useState(null);
    let [loading, setLoading] = useState(false);

    let fileRef = useRef(null);

    let handleFile = () => {
        fileRef.current.click();
    };
    let getImageURL = (e) => {
        setFileUp(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    let updateProfile = () => {
        axiosInstance
            .get(`/api/getprofile`, {
                withCredentials: true,
            })
            .then((res) => {
                // console.log(res.data.data);
                setUser(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let handlePostRequest = () => {
        setLoading(true);
        const file = new FormData();
        file.append("image", fileUp);
        file.append("username", username);
        file.append("name", name);
        file.append("email", email);

        axiosInstance
            .post("/api/updateprofile", file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                updateProfile();
            })
            .catch((err) => {
                console.log(err);
            });

        // console.log(body);
    };

    // useEffect(() => {
    //     console.log(image);
    // }, [image]);

    return (
        <PageLayout>
            <h2>Profile</h2>
            <div className={styles.picture}>
                <img src={image} alt="hallo dek" />
                <input
                    type="file"
                    name="image"
                    id="image"
                    className={styles.button}
                    ref={fileRef}
                    onChange={getImageURL}
                    accept="image/*"
                />
                <button className={styles.button} onClick={handleFile}>
                    Change photo profile
                </button>
            </div>
            <div className={styles.form}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={username}
                />
                <label htmlFor="name">Name</label>
                <input
                    type="email"
                    name="username"
                    id="name"
                    defaultValue={name}
                />
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    defaultValue={email}
                />
                <button className={styles.button} onClick={handlePostRequest}>
                    {loading ? "Loading..." : "Save"}
                </button>
            </div>
        </PageLayout>
    );
}
