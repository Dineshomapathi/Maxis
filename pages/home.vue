<template>
    <div class="">
        <div class="d-flex-center flex-column padding-box" id="home_container">
            <img src="/static/images/home/title.png" width="80%" class="mt-0 mt-md-5">
            <div class="row mt-5 mb-4">
                <div v-for="item in items" class="col-12 col-md-4 text-center">
                    <a href="#" @click.prevent="onClickHomeBtn(item.slug)">
                        <img :src="`/static/images/home/${item.slug}.png`" class="w-75 w-sm-50 w-md-100 px-0 px-md-2 home-item">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data (){
        return {
            items: [
                { name: 'View M Nation Agenda', slug: 'agenda' },
                { name: 'Enter M Nation', slug: 'auditorium' },
                { name: 'Rangkaian Maxis Wall', slug: 'maxis_wall' },
            ],
        }
    },
    computed: {

    },
    mounted(){

    },
    methods: {
        onClickHomeBtn(item){
            this.$store.dispatch('auth/onSetGA', `open@${item}`);

            if(item == 'maxis_wall'){

            }else{
                this.$router.push({ path: `/${item}` });
            }
        },
    },
    watch: {

    }
}
</script>

<style lang="scss">
    .padding-box{
        padding: 30px 300px;
    }

    #home_container{
        height: 100%;

    }

    .home-item:hover{
        animation: bounce .7s;
    }

    @keyframes bounce{
        0%, 100%{
            transform: scale(1);
        }

        40%{
            transform: scale(1.05);
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
        #home_container{
            height: auto;
        }
    }
</style>