import _ from 'lodash';
import {TweenMax} from "gsap";

export default {
    namespaced: true,
    state: () => ({
        items: [],
        moderators: [],
        pin_message: null,
        my_room: null,
    }),
    actions: {
        SOCKET_onGetLiveChatMessagesL({commit,dispatch}, res){
            console.log('SOCKET_onGetLiveChatMessagesL ->', res);
            commit('setItems', res.items);
            dispatch('scroll', false)
        },

        SOCKET_onGlobalSendLiveChatMessage({state,commit,dispatch}, res){
            if(res.item.room == state.my_room){
                console.log('SOCKET_onGlobalSendLiveChatMessage ->', res);
                commit('addItem', res.item);
                dispatch('scroll', true);
            }
        },

        SOCKET_onGetPinMessage({state,commit,dispatch}, res){
            console.log('SOCKET_onGetPinMessage ->', res);
            if(res.item){
                commit('pinItem', res.item);
            }
        },

        SOCKET_onSetPinMessage({state,commit,dispatch}, res){
            if(res.item.room == state.my_room){
                console.log('SOCKET_onSetPinMessage ->', res);
                commit('pinItem', res.item.message? res.item : null);
            }
        },

        SOCKET_onRemoveMessage({state,commit}, res){
            if(res.item.room == state.my_room){
                console.log('SOCKET_onRemoveMessage ->', res);
                commit('removeItem', res.item);
            }
        },

        SOCKET_onEmptyLiveChat({state,commit}, res){
            if(res.item == state.my_room){
                console.log('SOCKET_onEmptyLiveChat ->', res);
                commit('setItems', []);
                commit('pinItem', null);
            }
        },
        
        SOCKET_onGetModerators({state,commit}, res){
            console.log('SOCKET_onGetModerators ->', res);
            commit('setModerators', res.items);
        },

        scroll({state, commit, rootState}, res){
            if(!state.moderators.includes(rootState.auth.user? rootState.auth.user.hid : 'z_live_chat')){
                TweenMax.delayedCall(.1, () => {
                    TweenMax.killTweensOf('#live_chat_content');
                    var num =  ($('#live_chat_content > div').height() + 80) - $('#live_chat_content').height();
                    if (res == true){
                        TweenMax.to(`#live_chat_content`, .3, {scrollTop: num});
                    } else {
                        TweenMax.set(`#live_chat_content`, {scrollTop: num});
                    }
                });
            }
        },
    },
    mutations: {
        setItems(state, items){
            state.items = items;
        },
        addItem(state, item){
            if(state.items.length > 1000){
                state.items.splice(0, 500);
            }
            state.items.push(item);
        },
        pinItem(state, item){
            state.pin_message = item;
        },
        removeItem(state, item){
            if(state.pin_message){
                if(item.hid == state.pin_message.hid){
                    state.pin_message = null;
                }
            }

            state.items = _.reject(state.items, {hid:item.hid});
        },

        setModerators(state, items){
            state.moderators = items;
        },
        setMyRoom(state, item){
            state.my_room = item;
            state.items = [];
            state.pin_message = null;
        },
    }
}

