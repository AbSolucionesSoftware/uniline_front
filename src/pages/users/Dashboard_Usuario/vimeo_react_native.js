import React/* , { useState } */ from 'react';
import Vimeo from '@u-wave/react-vimeo';
import { Box, Button, makeStyles } from '@material-ui/core';
/* import { Helmet } from 'react-helmet'; */
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
	video: {
		backgroundColor: '#1A1A1A',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
		/* [theme.breakpoints.down('sm')]: {
			height: '40vh'
		} */
	},
	vimeoPlayer: {
		width: '82%',
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
		document.getElementById('jalaPorfa').innerText("cagaduarte")
		document.getElementById('jalaPorfa').click(); 
		
		/* console.log("si se ejecuta");
		window.alert("video finalizado") */
		/* window.postMessage("jalaPorfa", "*");
		window.ReactDOM. */
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
					onEnd={() => jalaPorfa()}
					id="vimeo-player-mobile"
					className={classes.vimeoPlayer}
					responsive={true}
					height={100}
					loop={false}
				/>
				<Box my={2}>
					<Button id="jalaPorfa" color="primary" variant="contained" fullWidth onClick={() => props.history.push('/vimeo_mobil_change/true')}>
						Jala porfa
					</Button>
				</Box>
			</div>
		</Fragment>
	);
}
