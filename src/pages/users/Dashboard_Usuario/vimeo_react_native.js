import React, { useState } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import { makeStyles } from '@material-ui/core';

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
    const [ update, setUpdate ] = useState(false);
    const url = props.match.params.url;
    const info_url = props.match.params.info;
    const info_local = process.env.REACT_APP_VIMEO_RN;

    if(info_url !== info_local) return null    

	return (
		<div className={classes.video}>
            <div id="on-change-var">{update}</div>
			<Vimeo
				video={url}
				autoplay={true}
				onEnd={() => setUpdate(!update)}
				id="vimeo-player-mobile"
				className={classes.vimeoPlayer}
			/>
		</div>
	);
}
