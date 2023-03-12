import React, { Children, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "./App";
import Login from "./pages/Login";
import ChatPage from "./pages/Chat";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import "./index.css";

import UserContext from "./context/UserContext";

// axios.defaults.baseURL = "http://localhost:4000";
// axios.defaults.withCredentials = true;

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },
        {
            path: "/chat",
            element: <ChatPage />,
        },
        {
            path: "/friends",
            element: <Friends />,
        },
    ],
    {
        basename: "/",
    }
);

function ContextUser({ children }) {
    let [user, setUser] = useState({});

    const userValue = { user, setUser };

    return (
        <>
            <UserContext.Provider value={userValue}>
                {children}
            </UserContext.Provider>
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextUser>
            <RouterProvider router={router} />
        </ContextUser>
    </React.StrictMode>
);
