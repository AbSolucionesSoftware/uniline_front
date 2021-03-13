import React from 'react';
import './footer.scss';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Hidden, Typography, Button } from '@material-ui/core';

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { Link } from 'react-router-dom';

import Imagen from '../../images/uniline2.png';
import ImagenDark from '../../images/unilineDark.png';

const useStyles = makeStyles((theme) => ({
	background: {
		backgroundColor: theme.palette.background.paper
	},
	root: {
		flexGrow: 1
	},
	appfoot: {
		backgroundColor: theme.palette.info.main
	},
	marginText: {
		marginTop: theme.spacing(1)
	},
	appSupFoot: {
		backgroundColor: theme.palette.info.light
	},
	imgContainer: {
		height: 70,
		display: 'flex',
		justifyContent: 'center',
		marginTop: theme.spacing(5)
	},
	cover: {
		maxWidth: '100%',
		maxHeight: '100%'
	}
}));

export default function Footer({ darkTheme }) {
	const classes = useStyles();

	return (
		<Box position="relative" zIndex="2" className={classes.background} boxShadow={3}>
			<Grid container>
				<Grid item sm={4} xs={12}>
					<Typography className={classes.marginText} align="center" variant="subtitle1">
						<LocationOnIcon style={{ fontSize: 50 }} />
						<br />
						Javier Mina 450, Interior 22, Privada San Javier <br />
						Autlan de Navarro, Jalisco, Mex. <br />
					</Typography>
				</Grid>
				<Hidden xsDown>
					<Grid item sm={4}>
						<Box className={classes.imgContainer}>
							<img alt="Uniline" src={darkTheme ? ImagenDark : Imagen } className={classes.cover} />
						</Box>
					</Grid>
				</Hidden>

				<Grid item sm={4} xs={12} align="center">
					<Typography className={classes.marginText} variant="h6">
						Contácto
					</Typography>
					<Box className={classes.marginText}>
						<FacebookIcon id="is" style={{ fontSize: 40 }} />
						<InstagramIcon id="is" style={{ fontSize: 40 }} />
						<WhatsAppIcon id="is" style={{ fontSize: 40 }} />
					</Box>
					<Typography>O al tel. <b>3171035768</b></Typography>
				</Grid>
			</Grid>
			<Box mt={3}>
				<Grid container spacing={2} justify="center" alignItems="center" style={{ width: '100%'}}>
					<Grid item>
						<Button style={{ fontSize: 12 }} component={Link} to="/politicas">
							Políticas de Privacidad
						</Button>
					</Grid>
					<Grid item>
						<Button style={{ fontSize: 12 }} component={Link} to="/imagen_corporativa">
							Imagen corporativa
						</Button>
					</Grid>
					<Grid item>
						<Typography>© AB Soluciones Empresariales 2020 All rights reserved.</Typography>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
