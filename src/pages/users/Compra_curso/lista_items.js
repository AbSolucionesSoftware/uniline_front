import React from 'react';
import { Box, makeStyles, Grid, Typography } from '@material-ui/core';
import LinkMaterial from '@material-ui/core/Link';
import { formatoMexico } from '../../../config/reuserFunction';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	buttons: {
		display: 'block'
	},
	grid: {
		backgroundColor: theme.palette.background.paper
	}
}));

function ListaCompra(props) {
	const classes = useStyles();
	const { curso } = props

	return (
		<Box mb={3} boxShadow={3} p={3} className={classes.grid}>
			<Grid container spacing={2}>
				<Grid item lg={3} sm={3} xs={12}>
					<Box display="flex" justifyContent="center" alignItems="center" height="100%">
						<img alt="imagen carrito" src={curso.urlPromotionalImage} className={classes.imagen} />
					</Box>
				</Grid>
				<Grid item lg={6} sm={6} xs={12}>
					<Box>
						<LinkMaterial
							href={`/curso/${curso.slug}`}
							target="_blank"
							rel="noopener"
							color="inherit"
							underline="none"
						>
							<Typography variant="h5">{curso.title}</Typography>
						</LinkMaterial>
						<Typography variant="subtitle1" color="textSecondary">
							{`Por ${curso.idProfessor.name}`}
							{curso.idProfessor.profession ? `, ${curso.idProfessor.profession}` : ''}
						</Typography>
					</Box>
				</Grid>
				<Grid item lg={3} sm={3} xs={12}>
					<Box height="100%">
						<Box display="flex" justifyContent="flex-end">
							{curso.priceCourse.free ? (
								<Typography variant="h6" color="textPrimary">
									¡Gratis!
								</Typography>
							) : curso.priceCourse.promotionPrice ? (
								<Box>
									<Typography variant="h6" align="right" color="textPrimary">
										{formatoMexico(curso.priceCourse.promotionPrice)} MXN$
									</Typography>
									<Typography variant="subtitle1" align="right" color="textSecondary">
										<s>{formatoMexico(curso.priceCourse.price)} MXN$</s>
									</Typography>
								</Box>
							) : (
								<Typography variant="h6" color="textPrimary" align="right">
									{formatoMexico(curso.priceCourse.price)} MXN$
								</Typography>
							)}
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default withRouter(ListaCompra)
