export default () => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.crisp_id;
  
    (function() {
        var d = document;
        var s = d.createElement("script");

        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();
};