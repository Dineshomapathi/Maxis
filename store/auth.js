export default {
    namespaced: true,
    state: () => ({
        user: null,
        isLogin: false,
    }),
    actions: {
        SOCKET_connect({commit, state}) {
            console.log('socket connect');
            // if (state.isLogin) {
            //     this._vm.$socket.emit('setIdentity', state.user.hid, 'user');
            // }
        },
        SOCKET_disconnect({commit}) {
            console.log('socket disconnect');
        },
        SOCKET_onGlobalDeactiveUser({commit, state}, res) {
            console.log('SOCKET_onGlobalDeactiveUser ->', res);
            if(state.user){
                localStorage.removeItem(process.env.cookie_name);
                
                window.location.href = '/';
                commit('setUser', null);
            }
        },
        SOCKET_onDeactiveUser({commit, state}, res) {
            console.log('SOCKET_onDeactiveUser ->', res);
            if(res.user_hid == state.user.hid){
                localStorage.removeItem(process.env.cookie_name);

                window.location.href = '/';
                commit('setUser', null);
            }
        },
        onSetGA({state}, res) {
            this.$gtm.push({ event: 'click_event', action: res, user: state.user.email});
            this.$ga.event({ eventCategory: 'click_event', eventAction: res, user: state.user.email });
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isLogin = user ? true : false;
        },
    }
}