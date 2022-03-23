<template>
    <div class="bg-box" style="overflow-y: auto;">
    	<img src="/static/images/coming_soon.jpg" class="d-portrait-none w-100">
    	<img src="/static/images/coming_soon_mobile.jpg" class="d-portrait-block w-100">
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
export default {
	mounted(){
		// auto sign in when enter login page
		// this.$auth.loginWith('aad');
		// signIn('redirect');
        setTimeout(() => {
	        const cookieItem = JSON.parse(localStorage.getItem(process.env.cookie_name));
	        const microsoftUser = JSON.parse(localStorage.getItem("MicrosoftUser"));

			if(cookieItem){
				return window.location.href = 'https://rmwall.maxis.com.my';
				// return this.$router.replace({ path: "/wall/" });
			}else if(microsoftUser){
	        	console.log({microsoftUser});
				if(microsoftUser.name && microsoftUser.email){
					var data = Object.assign({}, microsoftUser);
					data.login_type = 'sso';

					this.$axios.$post(`${process.env.api_url}/api/login`, {data: CryptoJS.AES.encrypt(JSON.stringify(data), process.env.secret_passphrase).toString()}).then((res) => {
					    console.log('loginCallback', res);

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
	        				localStorage.removeItem("MicrosoftUser");

					        this.$store.commit('auth/setUser', item);

					        this.$gtm.push({ event: 'click_event', action: 'login', user: item.email});
					        this.$ga.event({ eventCategory: 'click_event', eventAction: 'login', user: item.email });

					        this.$socket.emit('getSetting');

            				return window.location.href = 'https://rmwall.maxis.com.my';
					        // return this.$router.replace({ path: '/wall/'});
					        // return this.$router.replace({ path: '/auditorium/'});
					    }
					    
					    return Swal.fire({
					        title: res.message.title,
					        text: res.message.text,
					        icon: res.message.icon,
					    });
					});
				}else{
					return signIn('redirect');
				}
			}else{
				return signIn('redirect');
			}

        }, 2000);
	}
}
</script>

<style lang="scss">

</style>