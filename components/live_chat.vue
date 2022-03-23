<template>
    <transition name="fade">
        <div v-show="isFinishCalculated" class="bg-white" id="live_chat_container">
            <div id="live_chat_box" class="d-flex flex-column">
                <div class="mb-auto mx-2 overflow-y-auto scrollbar scrollbar-theme" id="live_chat_content">
                    <div class="p-2">
                        <div v-for="item in liveChatItems" v-on:dblclick="pinMessage(item.hid)">
                            <live-chat-message :item="item" :moderators="moderators" class="mb-2"></live-chat-message>
                        </div>
                    </div>
                </div>

                <div v-if="pinMessageItem" id="pinMessageItem_area" class="px-3 pt-1 pb-2" v-on:dblclick="removePinMessage()">
                    <hr style="margin: 0px 0px 10px 0px; background: white;">
                    <live-chat-message :item="pinMessageItem" :moderators="moderators"></live-chat-message>
                </div>

                <div v-show="isOpenEmojiContainer" id="emoji_container" class="p-2">
                    <div class="d-flex justify-content-start flex-wrap scrollbar scrollbar-theme" id="emoji_box">
                        <div v-for="emoji in emojiList" class="m-1 d-flex justify-content-center emoji-item user-selection-none" @click.prevent="addEmojiToText(emoji)">{{ emoji }}</div>
                    </div> 
                </div>

                <!-- <div v-show="isOpenStickerContainer" id="sticker_container" class="p-2">
                    <div class="d-flex justify-content-around flex-wrap scrollbar scrollbar-theme" id="sticker_box">
                        <div v-for="sticker in stickers" class="sticker_item mx-auto" @click.prevent="clickSendStickerButton(sticker)" :style="{'background-image': 'url(/images/auditorium/stickers/'+ sticker +'.png)'}"></div>
                    </div>
                </div> -->

                <div v-if="source != 'open_link'" id="text_area" class="mt-2">
                    <div id="text_area_items" class="d-flex justify-content-between align-items-center border-radius-05 border-theme-2">
                        <img src="/static/images/auditorium/emoji.svg" height="16px" width="16px" class="cursor-pointer ml-2" @click.prevent="onToggleEmojiContainer()">
                        <!-- <a href="#" id="emoji_btn" @click.prevent="onToggleEmojiContainer()"><i class="far fa-smile text-danger"></i></a> -->
                        <!-- <a href="#" id="sticker_btn" @click.prevent="onToggleStickerContainer()"><i class="fa fa-heart text-gold"></i></a> -->
                        <input type="text" id="chat_field" class="form-control" placeholder="Write your message here..." v-model="message" :disabled="!isAllowSendLiveChat" @keypress="onTypingMessage()" @keyup.enter="clickSendLiveChatButton">
                        <img src="/static/images/auditorium/send_theme.svg" height="16px" width="16px" class="cursor-pointer mr-2" @click.prevent="clickSendLiveChatButton()">
                        <!-- <live-emoji></live-emoji> -->
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default {
    props: ['room', 'source'],
    data () {
        return {
            isFinishCalculated: false,

            message: null,
            messageLimit: 150,
            isOpenEmojiContainer: false,
            isOpenStickerContainer: false,
            isAllowSendLiveChat: true,
            isAllowSendSticker: true,
            blockMessageTimer: 3000,

            stickers: 5,
            emojiList: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😬','🤥','😌','😔','😪','🤤','😴','😷','😵','🤯','🤠','😎','🤓','🧐','😟','🙁','😮','😯','😲','😳','😦','😧','😨','😰','😥','😢','😭','😱','🤡','👹','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','💋','💌','💘','💝','💖','💗','💓','💞','💕','💟','🧡','💛','💚','💙','💜','🖤','💯','💫','💦','💨','💣','💬','💭','💤','👋','🤚','🖐','✋','🖖','👌','🤞','🤟','🤘','🤙','👈','👉','👆','👇','👍','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏'],
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user,
            moderators: state => state.live_chat.moderators,
            liveChatItems: state => state.live_chat.items,
            pinMessageItem: state => state.live_chat.pin_message,
            isShowTranslation: state => state.setting.is_show_translation,
        }),
        isModerator(){
            return this.moderators.includes(this.user.hid);
        }
    },
    mounted() {
        this.setMyRoom(this.room);

    
        this.$socket.emit('getLiveChatMessagesL', this.room, 20);
        this.$socket.emit('getPinMessage', this.room);
        this.$socket.emit('getModerators');

        window.addEventListener('resize', this.onHandleWindowResize);
        setTimeout(() => {
            this.onHandleWindowResize();
        }, 500)
    },
    methods: {
        ...mapMutations({
            setMyRoom: 'live_chat/setMyRoom',
        }),
        onHandleWindowResize() {
            var $win = $(window);
            var winW = $win.width();
            var winH = $win.height();

            var streamHeight = $('#stream_container').height();

            if(this.source == 'open_link'){
                $('body').css('padding', '20px');
                $('#live_chat_container').css('height', winH - 40);
            }else if(winW > 992){
                $('#live_chat_container').css('height', streamHeight);
            }else{
                $('#live_chat_container').css('height', '500px');
            }

            this.isFinishCalculated = true;
            this.$emit('update:isFinishCalculated', true);
        },
        onToggleEmojiContainer(){
            if(this.isOpenStickerContainer){
                this.isOpenStickerContainer = false;
            }

            this.isOpenEmojiContainer = !this.isOpenEmojiContainer;
        },
        onToggleStickerContainer(){
            if(this.isOpenEmojiContainer){
                this.isOpenEmojiContainer = false;
            }

            this.isOpenStickerContainer = !this.isOpenStickerContainer;
        },
        addEmojiToText(item){
            var chatInput = $('#chat_field')[0];
            if(!this.isAllowSendLiveChat || (!this.isModerator && $("#chat_field").val().length >= this.messageLimit - 1)) return chatInput.focus();

            var startPos = chatInput.selectionStart,
                endPos = chatInput.selectionEnd,
                cursorPos = startPos,
                tmpStr = chatInput.value;

            this.message = tmpStr.substring(0, startPos) + item + tmpStr.substring(endPos, tmpStr.length);
            setTimeout(() => {
                cursorPos += item.length;
                chatInput.focus();
                chatInput.selectionStart = chatInput.selectionEnd = cursorPos;
            }, 10);
        },
        onTypingMessage(event){
            event = (event)? event : window.event;
            if(!this.isModerator && $("#chat_field").val().length >= this.messageLimit) return event.preventDefault();
        },
        clickSendLiveChatButton() {
            if(!this.message || !this.isAllowSendLiveChat) return;

            if(!this.isModerator){
                this.isAllowSendLiveChat = false;
                setTimeout(() => {
                    this.isAllowSendLiveChat = true;
                }, this.blockMessageTimer);
            }

            var messageObj = {
                room: this.room,
                title: this.user.title,
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                name: this.user.name,
                email: this.user.email,
                mobile: this.user.mobile,
                country: this.user.country,
                place: this.user.place,
                specialty: this.user.specialty,
                mrn_number: this.user.mrn_number,
                id_number: this.user.id_number,
                mcr_number: this.user.mcr_number,
                prc_number: this.user.prc_number,
                user_hid: this.user.hid,
                pin: false,
                message: this.isModerator? this.message : this.message.substring(0, this.messageLimit)
            }

            this.$socket.emit('sendLiveChatMessage', messageObj);
            this.isOpenEmojiContainer = false;
            this.message = '';

            this.$store.dispatch('auth/onSetGA', `send@${this.room}@message`);
        },
        clickSendStickerButton(item) {
            if(!item || !this.isAllowSendSticker) return;

            if(!this.isModerator){
                this.isAllowSendSticker = false;
                setTimeout(() => {
                    this.isAllowSendSticker = true;
                }, this.blockMessageTimer);
            }

            var messageObj = {
                room: this.room,
                title: this.user.title,
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                name: this.user.name,
                email: this.user.email,
                mobile: this.user.mobile,
                country: this.user.country,
                place: this.user.place,
                specialty: this.user.specialty,
                mrn_number: this.user.mrn_number,
                id_number: this.user.id_number,
                mcr_number: this.user.mcr_number,
                prc_number: this.user.prc_number,
                user_hid: this.user.hid,
                pin: false,
                message: `${process.env.domain_url}/images/auditorium/stickers/${item}.png`
            }

            this.$socket.emit('sendLiveChatMessage', messageObj);
            this.isOpenStickerContainer = false;

            this.$store.dispatch('auth/onSetGA', `send@${this.room}@sticker`);
        },
        async pinMessage(hid) {
            if(this.isModerator){
                const res = await Swal.fire({
                    title: `Are you sure?`,
                    text: `This message will pin on live chat!`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#007bff',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Pin it!'
                });
                if (res.value) this.$socket.emit('setPinMessage', this.room, hid, {pin:true});
            }
        },
        removePinMessage() {
            if(this.isModerator){
                this.$socket.emit('removePinMessage', this.room);
            }
        },
    },
    watch: {
        'isShowTranslation'(){
            if(this.room == 'plenary'){
                this.onHandleWindowResize();
            }
        }
    }
}
</script>

<style lang="scss">
    #live_chat_container{
        border-bottom-left-radius: .5rem;
        border-bottom-right-radius: .5rem;

        #live_chat_box{
            border: none !important;
            height: calc(100% - 16px);
            font-size: 14px;

            #emoji_container, #sticker_container{
                background: rgba(0, 0, 0, .2);
            }

            #emoji_box, #sticker_box{
                max-height: 140px;
                min-height: 100px;
                overflow-y: scroll;
            }

            .emoji-item{
                cursor: pointer;
                font-size: 20px;
                width: 25px;
                height: 25px;
            }

            .sticker_item{
                width: 80px;
                height: 80px;
                border: none;
                cursor: pointer;
                display: inline-block;
                background-color: transparent;
                background-size: cover;
            }

            #text_area{
                width: 95%;
                height: 31px;
                padding: 0;
                margin: 0 auto 10px;
                
                #text_area_items{
                    /*height: 31px;*/
                    background-color: white;
                   
                    #chat_field{
                        border: none;
                        margin: 0 5px 0 0;
                        width: 100%;
                        font-size: 14px;
                        color: black;     
                        background: transparent;   
                    }

                    #emoji_btn, #sticker_btn{
                        margin-left: 4px;
                        margin-top: 1px;
                        font-size: 24px;
                    }
                }
            }
        }
    }
</style>