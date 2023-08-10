export const configMFA:any = {
    auth: {
        clientId: "e9c17bad-826c-4d45-a4fe-1c1c7ccce9e5",
        authority:
            "https://login.microsoftonline.com/638fcbaf-ba4c-43e1-adae-5475c970fe10",
        redirectUri: "/",
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: "memoryStorage",
        storeAuthStateInCookie: true,
        secureCookies: true,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
