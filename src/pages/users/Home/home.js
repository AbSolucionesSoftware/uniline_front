import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import imagenBanner from '../../../images/banner3.jpg';
import logoUniline from '../../../images/uniline3.png';
import CursosComprados from './Cursos/cursos';

const useStyles = makeStyles((theme) => ({
	bannerContainer: {
		minHeight: '65vh',
		backgroundImage: `url(${imagenBanner})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover'
	},
	imagenLogo: {
		height: 120,
		[theme.breakpoints.down('xs')]: {
			height: 100,
			width: '100%'
		}
	},
	button: {
		height: 65,
		width: 250,
		fontSize: 20
	},
	font: {
		fontWeight: 'bold'
	}
}));

export default function Home() {
	const classes = useStyles();
	const token = localStorage.getItem('token');

	return (
		<Box>
			<Grid container className={classes.bannerContainer}>
				<Grid item md={6} lg={7} xs={12}>
					<Box display="flex" justifyContent="center" alignItems="center" height="100%">
						<Box p={5}>
							<img alt="logo uniline" src={logoUniline} className={classes.imagenLogo} />
							<Box my={2} style={{ color: '#F9F9F9' }}>
								<Typography variant="h4" className={classes.font}>
									APRENDE DESDE CASA EN EL MOMENTO QUE TÚ QUIERAS.
								</Typography>
								<Typography variant="h5">Tu salón de clases está en tu casa..</Typography>
							</Box>
							<Box display="flex" justifyContent="center" my={2}>
								{!token ? (
									<Button className={classes.button} variant="contained" color="primary" component={Link} to="/login">
										Conmenzar ahora
									</Button>
								) : null}
							</Box>
						</Box>
					</Box>
				</Grid>
			</Grid>
			<Box p={5}>
				<CursosComprados />
			</Box>
			<Box>todos los cursos</Box>

			{/* <ul>
				<Link to="/busqueda/algo">resultado busqueda</Link>
			</ul>
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul>
			<ul>
				<Link to="/dashboard/algo">dashboard usuario</Link>
			</ul>
			<ul>
				<Link to="/curso/algo">curso</Link>
			</ul> */}
		</Box>
	);
}
