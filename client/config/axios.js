import axios from "axios";
import { createBrowserHistory } from "history";
import { redirect } from 'react-router-dom'
let history = createBrowserHistory();

import config from "../config.json"

const instance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true
})

instance.interceptors.response.use(res => {
    // console.log(res)
    return res
}, err => {
    // console.log(err)
    if(err.response.status === 401){
        //redirect ke login
        // console.log("error")
        // history.replace("/");
        // window.location.href = "/";
    }

    return Promise.reject(err)
})

export default instance