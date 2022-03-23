export default {
    mode: 'spa',
    target: 'static',
    head: {
        title: 'M Nation',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no,  maximum-scale=1, minimal-ui, viewport-fit=cover' },
            { name: 'description', content: '' },
            { name: 'title', content: 'M Nation' },

            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: 'M Nation' },
            { name: 'twitter:site', content: 'M Nation' },
            { name: 'twitter:description', content: '' },

            { name: 'og:type', content: 'website' },
            { name: 'og:title', content: 'M Nation' },
            { name: 'og:description', content: '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css' },
            { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.1/animate.min.css' },
            // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap' },
            { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css' },
        ],
        script: [
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.15.0/umd/popper.min.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.0/jquery.matchHeight-min.js' },
            { src: 'https://alcdn.msauth.net/browser/2.17.0/js/msal-browser.min.js' },
            { src: '/static/azure/authConfig.js?v=003' },
            { src: '/static/azure/graphConfig.js?v=002' },
            { src: '/static/azure/ui.js?v=005' },
            { src: '/static/azure/authRedirect.js?v=021' },
            { src: '/static/azure/graph.js?v=005' },
        ]
    },
    css: [
        '@/assets/css/styles.scss' 
    ],
    plugins: [
        { src: '~plugins/msocket.js', mode: 'client' },
        // { src: '~plugins/crisp.js', mode: 'client' },
    ],
    components: true,
    buildModules: [
        ['@nuxtjs/google-analytics', {
            id: 'UA-177103410-68'
        }]
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/gtm',
        // '@nuxtjs/auth-next'
    ],
    gtm: {
        id: 'GTM-T772KN8',
        debug: true,
    },
    axios: {
        
    },
    build: {
    
    },
    generate: {
        routes: []
    },
    dev: process.env.NODE_ENV !== 'production',
    env: {
        website_title: `M Nation`,
        domain_url: (process.env.NODE_ENV !== 'production') ? `http://localhost:3008` : `https://mnation2022.maxis.com.my`,
        cms_url: (process.env.NODE_ENV !== 'production') ? `http://localhost:3009` : `https://cms.mnation2022.maxis.com.my`,
        api_url: (process.env.NODE_ENV !== 'production') ? 'http://localhost:3010' : 'https://api.mnation2022.maxis.com.my',
        socket_url: (process.env.NODE_ENV !== 'production') ? 'http://localhost:3011' : 'https://socket.mnation2022.maxis.com.my',
        cookie_name: 'mnation_user',
        secret_passphrase: 'mnation_secret'
    },
    router: {
        // middleware: ['auth'],
        base: '/',
        // base: (process.env.NODE_ENV !== 'production') ? '/' : '',
    },
    server: {
        port: 3008,
        host: 'localhost'
    },
    // auth: {
    //     redirect: {
    //       login: '/login',
    //       callback: '/login'
    //     },
    //     strategies: {
    //         aad: {
    //             scheme: 'oauth2',
    //             endpoints: {
    //                 authorization: 'https://websso.maxis.com.my/nidp/oauth/nam/authz',
    //                 token: 'https://websso.maxis.com.my/nidp/oauth/nam/token',
    //                 userInfo: 'https://websso.maxis.com.my/nidp/oauth/nam/userinfo',
    //                 logout: 'https://websso.maxis.com.my/nidp/oauth/v1/nam/end_session'
    //             },
    //             token: {
    //                 property: 'access_token',
    //                 type: 'Bearer',
    //                 maxAge: 1800
    //             },
    //             refreshToken: {
    //                 property: 'refresh_token',
    //                 maxAge: 60 * 60 * 24 * 30
    //             },
    //             responseType: 'code',
    //             grantType: 'authorization_code',
    //             accessType: 'offline',
    //             redirectUri: 'https://stg.mnation2022.maxis.com.my/login',
    //             logoutRedirectUri: 'https://stg.mnation2022.maxis.com.my/logout',
    //             // ******** change this for your Application (Client) ID ********
    //             clientId: '68ef1bf2-2cfb-4eaa-b3ef-51fbc0ee5713',
    //             codeChallengeMethod: 'S256',
    //             scope: ['MNation'],
    //             autoLogout: true
    //         }
    //     }
    // }
}
