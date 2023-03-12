import style from "./Login.module.css";
import { useState } from "react";
import config from "../../config.json";

import googleIcon from "../assets/google-icon.png";

export default function Login() {
    let BASE_URL = config.baseUrl;

    let handleClick = () => {
        window.open(`${BASE_URL}/auth/google`, "_self");
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <h2>Chat App</h2>
                <p>Please Sign In to continue</p>
                <button onClick={handleClick}>
                    <img src={googleIcon} className={style.icon} alt="" />
                    <p>Sign In with Google</p>
                </button>
            </div>
        </div>
    );
}
