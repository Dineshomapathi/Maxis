const msalConfig = {
    auth: {
        clientId: "83e256e6-b8a4-4fe9-bc19-fbe39d500920",
        authority: "https://login.microsoftonline.com/5a5d28b7-2b31-4397-b7b5-a3328b8f8d18",
        redirectUri: "https://mnation2022.maxis.com.my/login",
        postLogoutRedirectUri: "https://mnation2022.maxis.com.my"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
};

// Add scopes here for access token to be used at Microsoft Graph API endpoints.
const tokenRequest = {
    scopes: ["User.Read"]
};