// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accessToken;
let username = "";

// Redirect: once login is successful and redirects with tokens, call Graph API
myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
    console.error(err);
});

async function handleResponse(resp) {
    if (resp !== null) {
        username = resp.account.username;
        // showWelcomeMessage(resp.account);
        seeProfile();
    } else {
        /**
         * See here for more info on account retrieval:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
        const currentAccounts = myMSALObj.getAllAccounts();
        if (currentAccounts === null) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username;
            // showWelcomeMessage(currentAccounts[0]);
            seeProfile();
        }
    }
}

async function signIn() {
    await myMSALObj.loginRedirect(loginRequest);
}

async function signOut() {
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };

    await myMSALObj.logout(logoutRequest);
}

async function getTokenRedirect(request) {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = myMSALObj.getAccountByUsername(username);

    return await myMSALObj.acquireTokenSilent(request).catch(async error => {
        console.warn("silent token acquisition fails. acquiring token using redirect");
        if (error instanceof msal.InteractionRequiredAuthError) {
            // fallback to interaction when silent call fails
            myMSALObj.acquireTokenRedirect(request);
        } else {
            console.warn(error);
        }
    });

}

async function seeProfile() {
    await getTokenRedirect(loginRequest).then(response => {
        callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
    }).catch(error => {
        console.error(error);
    });
}