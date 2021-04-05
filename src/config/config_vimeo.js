const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(
	'b2af4468710c93e79707cfdbd36e8090a22ba023',
	'NERzVNSwQkIfxL7T4QvpEpwlOf5u+cjzQq0u71G4jE7BzATZRudjfbAQAPzBZT3kgJFyXtyg7bC9B0XeA6hylQyk7RvbSupNfjv49ZuasGvvv9D40zSEbg5yoc9yJ7q4',
	'b5397e1eef8a02fe5c3e0041e703af59'
);
export {client}


export const configVimeo = (title) => {
	return {
		name: title,
		embed: {
			buttons: {
				fullscreen: true,
				embed: false,
				hd: true,
				like: false,
				scaling: true,
				share: false,
				watchlater: false
			},
			volume: true,
			logos: {
				custom: {
					active: false,
					sticky: false
				},
				vimeo: false
			},
			playbar: true,
			title: {
				name: 'show',
				owner: 'hide',
				portrait: 'hide'
			},
			color: 'black'
		},
		privacy: {
			view: 'disable',
			download: false,
			comments: 'nobody',
			embed: "whitelist"
		},
		review_page: {
			vimeo_logo: true,
			active: true,
			notes: false
		}
	};
};

export const ClientRequestVimeo = (client, uri) => {
    return (
        client.request(
            {
                method: 'PUT',
                path: uri + '/privacy/domains/uniline.online'
            },
            function(error, body, status_code, headers) {
                console.log(uri + ' will only be embeddable on "https://uniline.online".');
                client.request(
                    {
                        method: 'PATCH',
                        path: uri,
                        query: {
                            privacy: {
                                embed: 'whitelist'
                            }
                        }
                    },
                    function(error, body, status_code, headers) {
                        console.log(uri + ' will only be embeddable on "https://uniline.online.');
                    }
                );
            }
        )
    )
}

/* export const ClientRequestVimeo = (client, uri) => {
    return (
        client.request({
			method: 'PATCH',
			path: uri,
			query: {
			  'privacy': {
				'view': 'password'
			  },
			  'password': 'helloworld'
			}
		  }, function (error, body, status_code, headers) {
			console.log(uri + ' will now require a password to be viewed on Vimeo.')
		  })
    )
} */