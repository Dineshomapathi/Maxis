import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default {
    namespaced: true,
    state: () => ({
        stream_url: null,
        notification_text: null,
        is_show_post_question: false,
        is_show_notification: false,
        is_stream_start: false,
    }),
    actions: {
        SOCKET_onGetSetting({commit}, res){
           console.log('SOCKET_onGetSetting ->', res);
           commit('setItem', res.item);
        },
        SOCKET_onGlobalUpdateSetting({commit}, res){
            console.log('SOCKET_onGlobalUpdateSetting ->', res);
            commit('updateItem', { key: res.item.name, value: res.item.value });
        },
        SOCKET_onGlobalRefreshPage({commit}, res){
            console.log('SOCKET_onGlobalRefreshPage ->', res);
            window.location.reload(true);
        },
        SOCKET_onGlobalEnterAuditorium({commit, rootState}, res){
            console.log('SOCKET_onGlobalEnterAuditorium ->', res);
            if(rootState.auth.user){
                this.$router.push({ path: '/expo/plenary/' });
            }
        },
        SOCKET_onGlobalShowAuditoriumNoti({state, commit, rootState}, res){
            console.log('SOCKET_onGlobalShowAuditoriumNoti ->', res);
            if(rootState.auth.user && window.location.pathname.includes('/expo/lobby')){
                Swal.fire({
                    icon: 'info',
                    html: `<p>${ state.notification_text }</p>`
                }).then((result) => {
                    if(result.isConfirmed){
                        this.$router.push({ path: '/expo/plenary/' });
                    }
                })
            }
        },
        SOCKET_onGlobalNotification({state, commit, rootState}, res){
            console.log('SOCKET_onGlobalNotification ->', res);
            if(rootState.auth.user && window.location.pathname.includes('auditorium')){
                Swal.fire({
                    icon: 'info',
                    html: `<p>${state.notification_text}</p>`
                });
            }
        },
    },
    mutations: {
        setItem(state, item){
            Object.keys(state).forEach((key) => {
                if(item[key]){
                    state[key] = item[key];
                }
            });
        },
        updateItem(state, {key, value}){
            state[key] = value;
        },
    }
}

