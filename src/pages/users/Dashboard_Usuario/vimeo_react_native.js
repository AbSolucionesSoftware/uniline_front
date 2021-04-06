import React, { useEffect, useState } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
	video: {
		backgroundColor: '#1A1A1A',
		height: '60vh',
		[theme.breakpoints.down('sm')]: {
			height: '40vh'
		}
	},
	vimeoPlayer: {
		height: '100%',
		width: '100%',
		'& iframe': {
			height: '100%',
			width: '100%'
		}
	}
}));

export default function VimeoReactNative(props) {
	const classes = useStyles();
	const [ update, setUpdate ] = useState("start");
	const url = props.match.params.url;
	const info_url = props.match.params.info;
	const info_local = process.env.REACT_APP_VIMEO_RN;

	useEffect(() => {
	}, [update])

	if (info_url !== info_local) return null;

	return (
		<Fragment>
			<Helmet>
				<title>{update}</title>
			</Helmet>
			<div className={classes.video}>
				<Vimeo
					video={url}
					autoplay={true}
					onEnd={() => setUpdate("finish")}
					id="vimeo-player-mobile"
					className={classes.vimeoPlayer}
				/>
			</div>
		</Fragment>
	);
}
