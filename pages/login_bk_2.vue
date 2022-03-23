<template>
    <div class="bg-box">
        <div class="d-flex-center padding-box" id="auth_container">
            <div class="col-12 col-md-6">
                <div id="auth_box">
                    <div class="d-flex-center" id="auth_title_box">
                        <h3 class="text-theme">LOGIN</h3>
                        <!-- <h3 class="d-none d-md-block text-theme">LOGIN</h3>
                        <img src="/static/images/auth/title.png" width="70%" class="d-block d-md-none text-theme pt-3 pb-5 px-2"> -->
                    </div>

                    <div class="py-3 px-5">
                        <!-- <h3 class="d-block d-md-none text-center text-white">LOGIN</h3> -->

                        <label class="text-white mb-0 mt-2">Name</label>
                        <input type="text" class="form-control border-radius-05" v-model.trim="data.name">

                        <label class="text-white mb-0 mt-2">Email</label>
                        <input type="text" class="form-control border-radius-05" v-model.trim="data.email" @keyup.enter="onClickLoginBtn">

                        <div class="mt-3 mb-3">
                            <a v-if="isLoading" href="#" class="btn btn-success disabled w-100">
                                <div class="spinner-border spinner-border-sm" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </a>
                            <a v-else href="#" class="btn btn-theme border-radius-05 w-100" @click.prevent="onClickLoginBtn">ENTER</a>
                            <!-- <a href="#" class="btn btn-theme border-radius-05 w-100 mt-3" @click="$auth.loginWith('aad')">LOGIN WITH SSO</a> -->
                            <a href="#" class="btn btn-theme border-radius-05 w-100 mt-3" @click.prevent="loginID" id="redirect">LOGIN WITH AZURE</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="d-none d-md-block col-12 col-md-6">
                <img src="/static/images/auth/title.png" width="100%">
            </div> -->
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
export default {
    data (){
        return {
            data: {
                name: process.env.NODE_ENV !== 'production'? 'test' : null,
                email: process.env.NODE_ENV !== 'production'? 'test@test.com' : null,
            },
            isLoading: false,
        }
    },
    computed: {

    },
    mounted(){

    },
    methods: {
        onClickLoginBtn(){
            if(!this.isLoading){
                this.isLoading = true;

                if(!this.data.name || !this.data.email){
                    this.isLoading = false;
                    return Swal.fire({
                        text: 'All field are required!',
                        icon: 'info',
                    });
                }

                if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.email))){
                    this.isLoading = false;
                    return Swal.fire({
                        text: 'Please enter a valid email address',
                        icon: 'info',
                    });
                }

                var data = Object.assign({}, this.data);
                data.login_type = 'sso';

                this.$axios.$post(`${process.env.api_url}/api/login`, {data: CryptoJS.AES.encrypt(JSON.stringify(data), process.env.secret_passphrase).toString()}).then((res) => {
                    console.log('loginCallback', res);

                    this.isLoading = false;
                    if(res.message == 'success'){
                        try{
                            var tempItem = CryptoJS.AES.decrypt(res.item, process.env.secret_passphrase);
                            var item = JSON.parse(tempItem.toString(CryptoJS.enc.Utf8));
                        }catch(err){
                            return Swal.fire({
                                title: 'Error',
                                icon: 'error',
                            });
                        }

                        document.cookie = 'ga_cookie=' + item.name;
                        localStorage.setItem(process.env.cookie_name, JSON.stringify(res.item));

                        this.$store.commit('auth/setUser', item);

                        this.$gtm.push({ event: 'click_event', action: 'login', user: item.email});
                        this.$ga.event({ eventCategory: 'click_event', eventAction: 'login', user: item.email });

                        this.$socket.emit('getSetting');
                        return this.$router.replace({ path: '/auditorium/'});
                    }

                    // if(res.message.title == 'Stay Tuned!'){
                    //     return Swal.fire({
                    //         html: "Please come back at <br> 9<sup>th</sup> February, 2022 <br> 10:00am",
                    //         icon: res.message.icon,
                    //     });
                    // }
                    
                    return Swal.fire({
                        title: res.message.title,
                        text: res.message.text,
                        icon: res.message.icon,
                    });
                });

                // this.$socket.emit('nameLogin', this.data.name, this.data.email, (res) => {
                //     console.log('nameLogin', res);

                //     this.isLoading = false;
                //     if(res.message == 'success'){
                //         document.cookie = 'ga_cookie=' + res.item.name;
                //         localStorage.setItem(process.env.cookie_name, JSON.stringify(res.item));

                //         this.$store.commit('auth/setUser', res.item);

                //         this.$gtm.push({ event: 'click_event', action: 'login', user: res.item.hid});
                //         this.$ga.event({ eventCategory: 'click_event', eventAction: 'login', user: res.item.hid });

                //         this.$socket.emit('getSetting');
                //         return this.$router.replace({ path: '/auditorium/'});
                //     }

                //     if(res.message.title == 'Stay Tuned!'){
                //         return Swal.fire({
                //             html: "Please come back at <br> 9<sup>th</sup> February, 2022 <br> 10:00am",
                //             icon: res.message.icon,
                //         });
                //     }
                    
                //     return Swal.fire({
                //         title: res.message.title,
                //         text: res.message.text,
                //         icon: res.message.icon,
                //     });
                // });
            }
        },
        onClickLoginSsoBtn(){

        },
        loginID(){
            signIn(this.id);
		},
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
        padding: 30px 300px;
    }

    #auth_container{
        height: 100%;
    }

    #auth_box{
        background: transparent url(/static/images/auth/box.png) no-repeat center center;
        -moz-background-size: 100% 100%;
        -webkit-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
        overflow-y: auto;
        border-radius: 2rem;
        min-height: 400px;
        max-width: 420px;
        margin: 0 auto;

        #auth_title_box{
            background: transparent url(/static/images/auth/top_box.png) no-repeat center center;
            -moz-background-size: 100% 100%;
            -webkit-background-size: 100% 100%;
            -o-background-size: 100% 100%;
            background-size: 100% 100%;
            height: auto;
            min-height: 100px;
            width: 100%;
        }
    }

    @media screen and (max-width: 1500px){
        .padding-box{
            padding: 30px 150px;
        }
    }

    @media screen and (max-width: 991px){
        .padding-box{
            padding: 10px;
        }
    }

    @media screen and (max-width: 767px) and (max-height: 600px){
        .padding-box{
            padding: 30px 10px;
        }
    }

    @media screen and (max-height: 600px){
        #auth_container{
            height: auto;
        }
    }
</style>