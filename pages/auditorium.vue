<template>
    <div class="bg-box">
        <div class="d-flex justify-content-between align-items-center py-2 px-3 py-md-3 px-md-4">
            <div></div>
            <!-- <img src="/static/images/auditorium/top_left.png" class="d-none d-md-block" height="24px">
            <img src="/static/images/auditorium/top_left_mobile.svg" class="d-block d-md-none" style="height: 40px; max-width: 50%; object-fit: contain;"> -->
            <img src="/static/images/auditorium/top_right.png" style="height: 40px; max-width: 35%; object-fit: contain;">
        </div>
        <div v-if="isStreamStart" class="padding-box d-flex flex-column">
            <div class="stream_video embed-responsive embed-responsive-16by9" style="background: black;">
                <iframe class="embed-responsive-item" :src="streamUrl" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen scrolling="no" frameBorder="0"></iframe>
            </div>
            <div v-if="isShowPostQuestion" class="mt-3 mb-1 w-100" id="question_container">
                <div class="d-flex justify-content-between align-items-center" id="question_box">
                    <input type="text" class="form-control input-field border-theme-2" id="question_field" placeholder="Ask a question" v-model="question" @keyup.enter="clickSubmitPostQuestion()">
                    <a href="#" class="btn btn-theme" id="send_question_btn" @click.prevent="clickSubmitPostQuestion()">SUBMIT</a>
                </div>
            </div>
        </div>
        <div v-else class="div-center" id="thanks_box">
            <div class="d-flex-center h-100 w-100">
                <h4 class="mb-0">Thanks for attending!</h4>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import {mapActions, mapMutations, mapState} from "vuex";

export default {
    data () {
        return {
            room: 'auditorium',
            question: null
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user,
            streamUrl: state => state.setting.stream_url,
            isStreamStart: state => state.setting.is_stream_start,
            isShowPostQuestion: state => state.setting.is_show_post_question,
        }),
    },
    mounted() {

    },
    methods: {
        clickSubmitPostQuestion() {
            if(!this.question) return;
            
            var questionObj = {
                room: this.room,
                name: this.user.name,
                email: this.user.email,
                question: this.question
            }

            this.$socket.emit('submitPostQuestion', questionObj, (res) => {
                console.log('submitPostQuestionCallback', res);
                this.question = '';

                Swal.fire({
                    title: 'Thanks for your question.',
                    icon: 'success',
                })
            });

            this.$store.dispatch('auth/onSetGA', 'send@question');
        }
    },
    watch: {

    }
}
</script>

<style lang="scss">
    .bg-box{
        background: #000 url(/static/images/bg.jpg) no-repeat center center;
        -moz-background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        overflow-y: auto;
    }

    .padding-box{
        padding: 10px 350px;
    }

    @media screen and (max-width: 1500px) {
        .padding-box{
            padding: 30px 150px;
        }
    }

    @media screen and (max-width: 991px) {
        .padding-box{
            padding: 10px;
        }
    }

    @media screen and (max-height: 500px) and (min-width: 500px) and (max-width: 991px){
        .padding-box{
            padding: 0 100px;
        }
    }

    #question_box{
        /*background-color: white;*/
        background: transparent;
        padding: 0;
        height: auto;
        
        #question_field{
            color: white;
            background: rgba(0, 0, 0, .7);
            width: 100%;
            border-radius: .5em;
            padding: 1.1rem 0.75rem !important;
        }

        #send_question_btn{
            font-size: 12px;
            padding: 9px 24px !important;
            border-radius: .5em;
        }
    }

    #thanks_box{
        width: 500px;
        max-width: 90%;
        height: 250px;
        max-height: 90%;
        color: white;
        background: rgba(0, 0, 0, .5);
        border-radius: 2rem
    }
</style>