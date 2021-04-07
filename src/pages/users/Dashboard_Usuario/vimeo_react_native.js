import React/* , { useState } */ from 'react';
import Vimeo from '@u-wave/react-vimeo';
import { Box, Button, makeStyles } from '@material-ui/core';
/* import { Helmet } from 'react-helmet'; */
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
	video: {
		backgroundColor: '#1A1A1A',
		/* width: '100vh', */
		/* [theme.breakpoints.down('sm')]: {
			height: '40vh'
		} */
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
/* 	const [ update, setUpdate ] = useState(""); */
	const url = props.match.params.url;
	const info_url = props.match.params.info;
	const info_local = process.env.REACT_APP_VIMEO_RN;

	if (info_url !== info_local) return null;

	const jalaPorfa = () => {
		document.getElementById('jalaPorfa').click();
	}

	return (
		<Fragment>
			{/* <Helmet>
				<title>{update}</title>
			</Helmet> */}
			<div className={classes.video}>
				<Vimeo
					video={url}
					autoplay={true}
					onEnd={jalaPorfa}
					id="vimeo-player-mobile"
					/* className={classes.vimeoPlayer} */
					responsive={true}
				/>
				<Box my={2} display="none">
					<Button id="jalaPorfa" color="primary" variant="contained" fullWidth onClick={() => props.history.push('/vimeo_mobil_change/true')}>
						Jala porfa
					</Button>
				</Box>
			</div>
		</Fragment>
	);
}
