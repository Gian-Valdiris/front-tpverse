import React from "react";
import ReactDOM from "react-dom/client";
import { TPVerse } from "./components/TPVerse";
import Login from "./components/Login";
import "./styles.sass";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { configMFA } from "./auth/authConfig";
const msalInstance = new PublicClientApplication(configMFA);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/home",
        element: <TPVerse />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <RouterProvider router={router} />
        </MsalProvider>
    </React.StrictMode>
);
