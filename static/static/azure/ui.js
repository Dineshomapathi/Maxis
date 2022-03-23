function updateUI(data, endpoint) {
    console.log('Graph API responded at: ' + new Date().toString());

    // $('.btn-login-petronas, .btn-loading').toggle();
    // onHandleLoadingOverlay(true);
    // $("#overlayrunning").toggle();

    var user = {
        name: data.displayName,
        email: data.userPrincipalName,
    };

    localStorage.setItem('MicrosoftUser', JSON.stringify(user));
    localStorage.setItem('MicrosoftLogin', 'Yes');

    // if(localStorage.getItem("MicrosoftUser") != null){
    //     window.setTimeout(function() {
    //         window.location.href = 'https://d1o8a6hv2sforu.cloudfront.net/maxis-wall';
    //     }, 1000);
    // }
}