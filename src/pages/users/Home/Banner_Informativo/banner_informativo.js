import React from 'react';
import { Grid, makeStyles, Box, Container, Typography } from '@material-ui/core';

import imagen from '../../../../images/SchoolHome.gif';
import blog from '../../../../images/Blog.png';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.default
	},
	imagenes: {
		maxWidth: '100%',
		maxHeight: '100%',
		borderRadius: '10%'
	},
	titulos: {
		fontWeight: 'bold'
	},
	vinetas: {
		color: '#08f',
		fontSize: 30
	}
}));

export default function BannerInformativo() {
	const classes = useStyles();

	return (
		<Box className={classes.color}>
			<Container maxWidth="lg">
				<Box mt={5}>
					<Typography align="center" variant="h3" className={classes.titulos}>
						UNILINE, una escuela que nunca para...
					</Typography>
				</Box>
				<Grid container>
					<Grid item md={6} xs={12} align="center">
						<img alt="Personal animado" src={imagen} className={classes.imagenes} />
					</Grid>
					<Grid item md={6} xs={12}>
						<Box mt={10}>
							<Typography variant="h5" className={classes.titulos}>
								<FiberManualRecordIcon className={classes.vinetas} />
								Clases desde casa
							</Typography>
							<Box ml={4} mt={2}>
								<Typography variant="h5">
									Aprende de la mejor manera, con la mejor comodidad, desde tu casa.
								</Typography>
							</Box>

							<Box mt={4}>
								<Typography variant="h5" className={classes.titulos}>
									<FiberManualRecordIcon className={classes.vinetas} />
									Conciso y claro
								</Typography>
							</Box>
							<Box ml={4} mt={2}>
								<Typography variant="h5">
									Las mejores explicaciones, lo mas claro posible y no queden dudas.
								</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>
				<Grid container direction={window.screen.width > 768 ? 'row' : 'column-reverse'}>
					<Grid item md={6} xs={12}>
						<Box mt={3}>
							<Typography variant="h5" className={classes.titulos}>
								<FiberManualRecordIcon className={classes.vinetas} />
								Blogs
							</Typography>
							<Box ml={4} mt={2}>
								<Typography variant="h5">
									Tener la facilidad de calificar tus cursos, dar comentarios de estos y resolver
									todas tus dudas.
								</Typography>
							</Box>

							<Box mt={4}>
								<Typography variant="h5" className={classes.titulos}>
									<FiberManualRecordIcon className={classes.vinetas} />
									Audio y Video
								</Typography>
							</Box>
							<Box ml={4} mt={2}>
								<Typography variant="h5">
									El mejor audio y video en nuestros cursos, la mayor calidad para nuestros alumnos.
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item md={6} xs={12} align="center">
						<img alt="Blog animado" src={blog} className={classes.imagenes} />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
