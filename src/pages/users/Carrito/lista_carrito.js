import React, { useContext } from 'react';
import { Box, makeStyles, Grid, Typography, Button } from '@material-ui/core';
import LinkMaterial from '@material-ui/core/Link';
import { formatoMexico } from '../../../config/reuserFunction';
import { NavContext } from '../../../context/context_nav';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	buttons: {
		display: 'block'
	}
}));

function ListaCarrito(props) {
	const classes = useStyles();
	const { articulo, setLoading, setSnackbar, user } = props
	let token = localStorage.getItem('token');
	const curso = articulo.course;
	const { update, setUpdate } = useContext(NavContext);

	if (!curso) return null;

	const eliminarCursoCarrito = async (idcurso) => {
		setLoading(true);
		await clienteAxios
			.delete(`/cart/${user._id}/delete/${idcurso}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setUpdate(!update);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					setSnackbar({
						open: true,
						mensaje: err.response.data.message,
						status: 'error'
					});
				} else {
					setSnackbar({
						open: true,
						mensaje: 'Al parecer no se a podido conectar al servidor.',
						status: 'error'
					});
				}
			});
	};

	const pagarCurso = (curso) => {
		let cursos = [];

		if (curso.priceCourse.promotionPrice) {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: curso.priceCourse.promotionPrice,
				persentagePromotion: curso.priceCourse.persentagePromotion,
				idCourse: curso._id,
				course: curso,
				promotion: true
			});
		} else {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: 0,
				persentagePromotion: '',
				idCourse: curso._id,
				course: curso,
				promotion: false
			});
		}
		
		localStorage.setItem('payment', JSON.stringify({
			user: user,
			courses: cursos
		}))
		/* setTimeout(() => {
			props.history.push(`/compra/${curso.slug}`);
		}, 500); */
		setTimeout(() => {
			props.history.push(`/compra`);
		}, 500);
	};

	return (
		<Box my={3}>
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
						<Box display="flex" justifyContent="flex-end">
							<div>
								<Button color="primary" className={classes.buttons} size="small" onClick={() => pagarCurso(curso)}>
									Comprar
								</Button>
								<Button
									color="primary"
									className={classes.buttons}
									size="small"
									onClick={() => eliminarCursoCarrito(curso._id)}
								>
									Eliminar
								</Button>
							</div>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default withRouter(ListaCarrito)
