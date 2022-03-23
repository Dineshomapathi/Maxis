<template>
	<div class="d-flex align-items-start">
		<div class="flex-shrink-0">
		    <div v-if="isShowAvatar" class="d-flex justify-content-center align-items-center my-avatar" :class="getAvatarClass(item.user_hid)">
		        <p class="m-0" style="font-size: 1.1em">{{ item.name.substr(0, 1).toUpperCase() }}</p>
		    </div>
		</div>
		<div class="text-break m-0">
		    <span class="align-items-start font-weight-bold" :class="getNameTextColorClass(item.user_hid)">{{ getMessageName(item) }}:&nbsp;</span>
		    <div v-if="item.message.includes('/images/auditorium/stickers')" class='sticker_message' :style="{'background-image': 'url('+ item.message + ')'}"></div>
		    <span v-else class="font-weight-bold" :class="getMessageTextColorClass(item.user_hid)" v-html="convertTextToUrl(item.message)"></span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			item: {default: null},
			moderators: {default: []},
			isShowAvatar: {default: false},
		},
		methods: {
			getAvatarClass(user_hid){
				return this.moderators.includes(user_hid)? 'bg-gold text-black' : 'bg-theme text-white';
			},
			getNameTextColorClass(user_hid){
				return this.moderators.includes(user_hid)? 'text-black' : 'text-theme';
			},
			getMessageTextColorClass(user_hid){
				return this.moderators.includes(user_hid)? 'text-theme' : 'text-black';
			},
			getMessageName(item){
				return item.name;
				// return this.moderators.includes(item.user_hid)? 'Admin' : item.name;
			},
			convertTextToUrl(text) {
			    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
			    return text.replace(urlRegex, function(url,b,c) {
			        var url2 = (c == 'www.') ?  'http://' +url : url;
			        return '<a href="' + url2 + '" target="_blank" class="text-black"><u>' + url + '</u></a>';
			    }) 
			},
		}
	}
</script>

<style>
	.my-avatar{
	    border-radius: 1.1em; 
	    width: 2.2em; 
	    height: 2.2em;
	    margin-right: 5px;
	}

	.sticker_message{
		height: 100px;
		width: 100px;
		background-size: contain
	}
</style>