import React, { Fragment } from 'react';
import QueueAnim from 'rc-queue-anim';
import { makeStyles, Grid, Box, Button, Typography } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

import Celular from '../../../../images/Celular.gif';
import { Link } from 'react-router-dom';
import imagenBanner from '../../../../images/banner3.jpg';
import logoUniline from '../../../../images/uniline3.png';

const useStyles = makeStyles((theme) => ({
	altura: {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('xs')]: {
			height: "40vh"
		}
	},
	bannerTwo: {
		height: '65vh',
		backgroundColor: '#fff',
		[theme.breakpoints.down('xs')]: {
			minHeight: '90vh'
		}
	},
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	bannerContainer: {
		minHeight: '65vh',
		backgroundImage: `url(${imagenBanner})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		[theme.breakpoints.down('xs')]: {
			minHeight: '90vh'
		}
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
}));

export default function Banner() {
	const token = localStorage.getItem('token');
	const classes = useStyles();

	return (
		<Fragment>
			<Carousel interval={5000} indicators={false}>
				<Grid container className={classes.bannerContainer} display="flex">
					<Grid item md={6} lg={7} xs={12}>
						<Box display="flex" justifyContent="center" alignItems="center" height="100%">
							<Box p={5}>
								<QueueAnim delay={700} className="queue-simple">
									<Box key="a">
										<img alt="logo uniline" src={logoUniline} className={classes.imagenLogo} />
										<Box my={2} style={{ color: '#F9F9F9' }}>
											<Typography variant="h4" >
												<b>APRENDE DESDE CASA EN EL MOMENTO QUE TÚ QUIERAS.</b>
											</Typography>
											<Typography variant="h5">Tu salón de clases está en tu casa..</Typography>
										</Box>
									</Box>
									{!token ? (
										<Box key="b">
											<Box display="flex" justifyContent="center" my={2}>
												<Button
													className={classes.button}
													variant="contained"
													color="primary"
													component={Link}
													to="/login"
												>
													Conmenzar ahora
												</Button>
											</Box>
										</Box>
									) : null}
								</QueueAnim>
							</Box>
						</Box>
					</Grid>
					{/* <Hidden smDown>
						<Grid item sm={6}>
							<QueueAnim delay={800} className="queue-simple">
								<img key="a" alt="Escritorio animado" src={Imagen} className={classes.imagen} />
							</QueueAnim>
						</Grid>
					</Hidden> */}
				</Grid>

				<Grid container className={classes.bannerTwo}>
					<Grid item xs={12} lg={6} className={classes.altura}>
						<QueueAnim delay={900}>
							<img key="a" alt="Celualar Animado" src={Celular} className={classes.imagen} />
						</QueueAnim>
					</Grid>

					<Grid item xs={12} lg={6} className={classes.altura}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<QueueAnim delay={700} className="queue-simple">
								<Box key="a">
									<Typography variant="h3" align="center" color="primary">
										<b>Aprende desde casa en el momento que quieras</b>
									</Typography>
								</Box>
								{!token ? (
									<Box key="b">
										<Box display="flex" justifyContent="center" my={2}>
											<Button
												className={classes.button}
												variant="contained"
												color="primary"
												component={Link}
												to="/login"
											>
												Conmenzar ahora
											</Button>
										</Box>
									</Box>
								) : null}
							</QueueAnim>
						</Box>
					</Grid>
				</Grid>
			</Carousel>
		</Fragment>
	);
}
