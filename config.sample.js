var config = {
	local:{
		mode:"local",
		port:3000,
		mongo:{
			host:"127.0.0.1",
			port:27017,
			db:'tweetmap'
		},
		twit: {
			consumer_key:'', 
			consumer_secret:'', 
			access_token:'', 
			access_token_secret:''
		}
	},
	production:{
		mode:"production",
		port:4000,
		mongo:{
			host:"127.0.0.1",
			port:27017,
			db:'tweetmap'
		},
		twit: {
			consumer_key:'', 
			consumer_secret:'', 
			access_token:'', 
			access_token_secret:''
		}
	}
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}