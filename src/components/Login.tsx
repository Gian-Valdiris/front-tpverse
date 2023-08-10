import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import CryptoJS from "crypto-js";
import { configMFA } from "../auth/authConfig";

export default function Login() {
    const key = "d57fCy8eLG7hWWe8WfjxSBRpGecNfkPe";
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState<any>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isAuthenticated && Boolean(sessionStorage.getItem("Redirect"))) {
            setTimeout(() => {
                sessionStorage.removeItem("Redirect");
            }, 1200);
        }
    }, [isAuthenticated, accounts]);

    function onLogin(e: SyntheticEvent) {
        e.preventDefault();
        loginWauth();
    }
    function loginWauth() {
        if (isAuthenticated) {
            requestProfileData();
        } else {
            instance.loginRedirect();
            sessionStorage.setItem("Redirect", String(true));
        }
    }
    async function callMsGraph(token: string) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        return fetch(`https://graph.microsoft.com/beta/me`, {
            method: "GET",
            headers,
        }).then((response) => response.json());
    }
    function requestProfileData() {
        const request = {
            ...configMFA,
            account: accounts[0],
        };
        instance
            .acquireTokenSilent(request)
            .then((response) => {
                setAccessToken(response.accessToken);
                callMsGraph(response.accessToken).then(async (data) => {
                    // Do what you want with the data, such as putting it in localstorage
                    console.log(data);
                    let userinfo: any = {
                        idccms: parseInt(data.employeeId),
                        userName: data.mailNickname,
                        name: data.displayName,
                        mail: data.mail,
                        token: response.accessToken,
                    };
                    let userInfoTokenCrypt = CryptoJS.AES.encrypt(
                        JSON.stringify(userinfo),
                        key ?? ""
                    ).toString();
                    localStorage.setItem("info", userInfoTokenCrypt);

                    // let userInfoCrypt = CryptoJS.AES.encrypt(
                    //     JSON.stringify(userinfo),
                    //     key ?? ""
                    // ).toString();
                    // localStorage.setItem("info", userInfoCrypt);
                    navigate("/home");
                });
            })
            .catch((_e) => {
                instance.acquireTokenPopup(request).then((response) => {
                    setAccessToken(response.accessToken);
                });
                setError(
                    "No se pudo iniciar sesión, intentalo de nuevo más tarde."
                );
            });
    }

	function onLoginAssGuest(e: SyntheticEvent): void {
		e.preventDefault();
		navigate("/home");
	}

    return (
        <>
            <form onSubmit={onLogin}>
                <button type="submit">Iniciar sesión</button>
                <p>{error}</p>
            </form>
            <form onSubmit={onLoginAssGuest}>
                <button type="submit">Iniciar como invitado</button>
            </form>
        </>
    );
}
