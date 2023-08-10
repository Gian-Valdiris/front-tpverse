import { useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const unityContextLocation = "Unity";

export function TPVerse() {
    const key = "d57fCy8eLG7hWWe8WfjxSBRpGecNfkPe";
    const navigate = useNavigate();
    var user: any;

    const {
        unityProvider,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext({
        loaderUrl: `${unityContextLocation}/Build/Unity.loader.js`,
        dataUrl: `${unityContextLocation}/Build/Unity.data`,
        frameworkUrl: `${unityContextLocation}/Build/Unity.framework.js`,
        codeUrl: `${unityContextLocation}/Build/Unity.wasm`,
    });
    const handleLogin = useCallback(() => {
        sendMessage("LoginManager", "OnLoginUser", JSON.stringify(user));
    }, [sendMessage]);

    const [, setImg] = useState<any>();
    const getImg = async (token: any) => {
        const responseImg = await fetch(
            `https://graph.microsoft.com/v1.0/me/photo/$value`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const pictureBlob = await responseImg.blob();
        const reader = new FileReader();
        reader.readAsDataURL(pictureBlob);
        console.log(reader);
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(pictureBlob);
        setImg(imageUrl);
    };

    useEffect(() => {
        if (localStorage.getItem("info")) {
            const userinfoBytes = CryptoJS.AES.decrypt(
                localStorage.getItem("info") ?? "",
                key
            );
            user = JSON.parse(userinfoBytes.toString(CryptoJS.enc.Utf8));
            console.log(user);
            getImg(user.token);
            if (user) {
                let userKeys = Object.keys(user);
                addEventListener("OnLoadGame", handleLogin);
                if (userKeys.length >= 4) {
                    return () => {
                        removeEventListener("OnLoadGame", handleLogin);
                    };
                }
            } else {
                navigate("/");
            }
        } else {
            user = "";
        }
    }, [addEventListener, removeEventListener, handleLogin]);

    return (
        <>
            {/* <p>Imagen de perfil:</p>
            <img id="profile" src={img} alt="profile" /> */}
            <div className="dark">
                <video
                    id="videoHidden"
                    width="1280px"
                    height="720px"
                    style={{ position: "absolute", zIndex: -10 }}
                    autoPlay
                    hidden
                ></video>
                <canvas
                    id="canvasHidden"
                    width="1280px"
                    height="720px"
                    style={{ position: "absolute", zIndex: -10 }}
                    hidden
                ></canvas>
                <div id="unity-container" className="unity-desktop">
                    <canvas id="unity-canvas"></canvas>
                </div>
                <div id="loading-cover" style={{ display: "none" }}>
                    <div id="unity-loading-bar">
                        <div id="unity-logo">
                            <img src="logo.png" alt="" />
                        </div>
                        <div
                            id="unity-progress-bar-empty"
                            style={{ display: "none" }}
                        >
                            <div id="unity-progress-bar-full"></div>
                        </div>
                        <div className="spinner"></div>
                    </div>
                </div>
                <div
                    id="unity-fullscreen-button"
                    style={{ display: "none" }}
                ></div>
            </div>
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                }}
            />
            {/* <button onClick={handleFullScreen}>Full screen</button> */}
        </>
    );
}
