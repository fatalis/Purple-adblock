const random = require('random')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

var USHER_API = 'http://usher.twitch.tv/api/channel/hls/{channel}.m3u8?player=twitchweb' +
    '&token={token}&sig={sig}&$allow_audio_only=true&allow_source=true' +
    '&type=any&p={random}';
var TOKEN_API = 'http://api.twitch.tv/api/channels/{channel}/access_token';

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

async function get_token_and_signature(channel) {
	request = '{"operationName":"PlaybackAccessToken","extensions":{"persistedQuery":{"version":1,"sha256Hash":"0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"}},"variables":{"isLive":true,"login":"' + channel + '","isVod":false,"vodID":"","playerType":"site"}}';
	
	//proxy
    const proxyAgent = new HttpsProxyAgent('http://');
8000
	 var r = await fetch("https://gql.twitch.tv/gql", {
		 agent: proxyAgent,
		 timeout: 4000,
		 method: 'POST',
		 body : request,
		 headers: {
			'Client-ID': "kimne78kx3ncx6brgo4mv6wki5h1ko",
			'Device-ID': makeid(32)
		  }
		});

		return await r.json();
}

async function get_live_stream(channel){
	try{
			
		//proxy
		const proxyAgent = new HttpsProxyAgent('http://');

		//i think that call is not necessary
		var json = await get_token_and_signature(channel);
		rr = random.int(0, 1E7);
		
		var sig = json['data']['streamPlaybackAccessToken']['signature']
		var token = json['data']['streamPlaybackAccessToken']['value']

		const str = `http://usher.ttvnw.net/api/channel/hls/${channel}.m3u8?player=twitchweb&fast_bread=true&token=${token}&sig=${sig}&$allow_audio_only=true&allow_source=true&type=any&p=${rr}`;

		var r = await fetch(str, {
			agent: proxyAgent,
			timeout: 4000,
			method: 'GET'
		});
		
		return [await r.text(), r.status, true];
	}catch{
		return [await "offline :(", 500, false];
	}
}

module.exports = { get_token_and_signature, get_live_stream};