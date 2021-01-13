export const configVimeo = (datos) => {
	return {
		name: datos.title,
		embed: {
			buttons: {
				fullscreen: true,
				embed: false,
				hd: true,
				like: true,
				scaling: true,
				share: false,
				watchlater: false
			},
			volume: true,
			logos: {
				custom: {
					active: true,
					sticky: false
				},
				vimeo: false
			},
			playbar: true,
			title: {
				name: 'show',
				owner: 'show',
				portrait: 'show'
			},
			color: 'black'
		},
		privacy: {
			view: 'anybody',
			download: false,
			comments: 'nobody'
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
                path: uri + '/privacy/domains/http://localhost:3000'
            },
            function(error, body, status_code, headers) {
                console.log(uri + ' will only be embeddable on "http://localhost:3000".');
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
                        console.log(uri + ' will only be embeddable on "http://localhost:3000".');
                    }
                );
            }
        )
    )
}