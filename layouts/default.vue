<template>
    <!-- <div class="bg-box" id="default_box">
        <div class="d-flex justify-content-between align-items-center py-3 px-3 px-md-4">
            <img src="/static/images/logo.png" style="height: 40px; max-width: 35%; object-fit: contain;">

            <div v-if="user" id="nav_container">
                <img src="/static/images/nav/menu.png" class="cursor-pointer shadow rounded-circle" id="menu_img" @click.prevent="isOpenNavBar = !isOpenNavBar">
                <transition name="fade">
                    <div v-show="isOpenNavBar" class="bg-white border-radius-1 shadow mt-3" id="nav_box">
                        <table id="nav_table">
                            <tr v-for="navItem in navItems" class="nav-items cursor-pointer" @click.prevent="onSelectNavItem(navItem.slug)">
                                <td>
                                    <img :src="`/static/images/nav/${navItem.slug}.png`" height="50px" class="mr-1">
                                </td>
                                <td class="font-weight-bold">
                                    {{ navItem.name }}
                                </td>
                            </tr>
                        </table>
                    </div>
                </transition>
            </div>
        </div>
        
        <nuxt-child style="min-height: calc(100% - 100px);" />
    </div> -->
    <nuxt-child />
</template>

<script>
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import {mapActions, mapMutations, mapState} from "vuex"

export default {
    data (){
        return {
            routePermission: {
                guest: ['login'],
                user: ['wall'],
                // user: ['home', 'auditorium', 'agenda'],
            },

            navItems: [
                { name: 'M Nation 2020', slug: 'home' },
                { name: 'View M Nation Agenda', slug: 'agenda' },
                { name: 'Enter M Nation', slug: 'auditorium' },
                { name: 'Rangkaian Maxis Wall', slug: 'maxis_wall' },
            ],

            isOpenNavBar: false,
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user,
        }),
    },
    mounted(){
        const cookieItem = JSON.parse(localStorage.getItem(process.env.cookie_name));
        // var user = obj? obj : null;
        
        if(cookieItem){
            try{
                var tempUser = CryptoJS.AES.decrypt(cookieItem, process.env.secret_passphrase);
                var user = JSON.parse(tempUser.toString(CryptoJS.enc.Utf8));
            }catch(err){
                localStorage.removeItem(process.env.cookie_name);
                window.location.href = '/';
            }

            if(!this.routePermission.user.includes(this.$route.name?.split('-')[0])){
                this.$router.push({path: `/${this.routePermission.user[0]}/`});
            }

            this.$axios.$get(`${process.env.api_url}/api/get_setting`).then((res) => {
                console.log('API_settingCallback', res);
                this.$store.commit('setting/setItem', res.item);
            });
            
            this.$store.commit('auth/setUser', user);
            // this.$socket.emit('getSetting');
            // this.setUser(user);
        }else{
            if(!this.routePermission.guest.includes(this.$route.name?.split('-')[0])){
                this.$router.push({path: `/`});
            }
        }
    },
    methods: {
        onSelectNavItem(item){
            this.isOpenNavBar = false;
            this.$store.dispatch('auth/onSetGA', `open@${item}`);

            if(item == 'maxis_wall'){

            }else{
                this.selectedNav = item;
                this.$router.push({ path: `/${item}` });
            }
        },
    },
    watch: {
        
    }
}
</script>

<style lang="scss">
    #default_box{
        background: #000 url(/static/images/bg.jpg) no-repeat center center;
        -moz-background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        overflow-y: auto;
    }

    #nav_container{
        position: relative;
        z-index: 999;

        #menu_img{
            height: 50px;
            width: 50px;
        }

        #nav_box{
            width: 280px;
            position: absolute;
            right: 0;

            #nav_table{
                border-collapse: separate;
                border-spacing: 1rem;

                .nav-items{
                    img{
                        height: 30px;
                        width: 30px;
                        object-fit: contain;
                    }
                }
            }
        }
    }


    @media screen and (max-width: 767px){
        #nav_container{
            #menu_img{
                height: 40px;
                width: 40px;
            }
        }
    }
</style>
