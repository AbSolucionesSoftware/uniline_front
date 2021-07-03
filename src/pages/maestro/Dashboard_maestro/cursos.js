import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { makeStyles, Button, Grid, Box, Chip, useTheme, Hidden } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ImageSearchOutlinedIcon from '@material-ui/icons/ImageSearchOutlined';
import PublicIcon from '@material-ui/icons/Public';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import { Link } from 'react-router-dom';
import { formatoFecha, formatoMexico } from '../../../config/reuserFunction';
import clienteAxios from '../../../config/axios';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import {
	verificarBloquesCurso,
	verificarInformacionCurso,
	verificarLearningsCurso,
	verificarPrecioCurso
} from '../Subir_curso/verificar_contenido';
import LinkMaterial from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
	cardContent: {
		minHeight: 200,
		[theme.breakpoints.down('md')]: {
			height: 'auto'
		}
	},
	imgContainer: {
		height: '200px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			height: 'auto',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}
	},
	chips: {
		marginLeft: theme.spacing(2),
		marginBottom: 12,
		[theme.breakpoints.down('sm')]: {
			marginLeft: 0,
			marginBottom: 10,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	actions: {
		height: '100%',
		display: 'flex',
		justifyContent: 'space-evenly'
	},
	content: {
		padding: '10px 10px 0px 10px'
	},
	cover: {
		maxWidth: '100%',
		maxHeight: '100%'
	}
}));

export default function CursosProfesor({ datos, update, setUpdate }) {
	const classes = useStyles();
	const theme = useTheme();
	const curso = datos.course;
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ open, setOpen ] = useState(false);
	const [ blocks, setBlocks ] = useState([]);

	const obtenerBloquesBD = useCallback(
		async () => {
			if (curso._id && token) {
				await clienteAxios
					.get(`/course/data/${curso._id}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setBlocks(res.data);
					})
					.catch((err) => {
						return;
					});
			}
		},
		[ curso._id, token ]
	);

	const publicarCurso = async () => {
		if (
			verificarInformacionCurso(curso) &&
			verificarLearningsCurso(curso) &&
			verificarBloquesCurso(blocks) &&
			verificarPrecioCurso(curso)
		) {
			await clienteAxios
				.put(
					`/course/public/${curso._id}`,
					{
						publication: !curso.publication
					},
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setSnackbar({
						open: true,
						mensaje: res.data.message,
						status: 'success'
					});
					setLoading(false);
					setUpdate(!update);
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
		} else {
			setSnackbar({
				open: true,
				mensaje: 'Tu curso aun esta incompleto.',
				status: 'error'
			});
		}
	};

	const eliminarCurso = async () => {
		await clienteAxios
			.delete(`/course/${curso._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setLoading(false);
				setUpdate(!update);
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

	useEffect(
		() => {
			obtenerBloquesBD();
		},
		[ obtenerBloquesBD ]
	);

	const toggleModal = () => {
		setOpen(!open);
	};

	return (
		<Fragment>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Grid item xs={12}>
				<Box mt={2} boxShadow={3} borderRadius={10}>
					<Card className={classes.cardContent} variant="outlined">
						<Grid container>
							<Grid item sm={12} md={3}>
								<LinkMaterial
									component={Link}
									to={`/instructor/contenido_curso/${curso._id}/general`}
									underline="none"
									color="inherit"
								>
									<Box
										className={classes.imgContainer}
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										{!curso.urlPromotionalImage ? (
											<Box textAlign="center">
												<Box display="flex" justifyContent="center" alignItems="center">
													<ImageSearchOutlinedIcon style={{ fontSize: 40 }} />
												</Box>
												<Typography>Este curso aun no tiene imagen</Typography>
											</Box>
										) : (
											<img
												className={classes.cover}
												src={curso.urlPromotionalImage}
												alt="imagen promocional del curso"
											/>
										)}
									</Box>
								</LinkMaterial>
							</Grid>
							<Grid item sm={12} md={7}>
								<LinkMaterial
									component={Link}
									to={`/instructor/contenido_curso/${curso._id}/general`}
									underline="none"
									color="inherit"
								>
									<Box display="flex" flexDirection="column">
										<CardContent className={classes.content}>
											<Typography component="h5" variant="h5">
												{curso.title}
											</Typography>
											<Typography variant="subtitle1" color="textSecondary">
												{formatoFecha(curso.createdAt)}
											</Typography>
										</CardContent>
										<Grid container>
											<Grid item>
												<Box component="fieldset" borderColor="transparent">
													<Typography component="legend">Ventas</Typography>
													<Typography>${formatoMexico(datos.sales)}</Typography>
												</Box>
											</Grid>
											<Grid item>
												<Box component="fieldset" borderColor="transparent">
													<Typography component="legend">Alumnos inscritos</Typography>
													<Typography>{datos.numInscription}</Typography>
												</Box>
											</Grid>
											<Grid item>
												{!curso.qualification ? (
													<Box component="fieldset" borderColor="transparent">
														<Typography component="legend">Sin calificaciones</Typography>
													</Box>
												) : (
													<Box component="fieldset" borderColor="transparent">
														<Typography component="legend">
															{datos.numCalification === 1 ? (
																`1 calificacion`
															) : (
																`${datos.numCalification} calificaciones`
															)}
														</Typography>
														<Rating
															name="read-only"
															value={curso.qualification}
															readOnly
															precision={0.5}
														/>
													</Box>
												)}
											</Grid>
										</Grid>
									</Box>
								</LinkMaterial>
								<LinkMaterial
									component={Link}
									to={`/instructor/contenido_curso/${curso._id}/general`}
									underline="none"
									color="inherit"
								>
									<Grid container className={classes.chips} spacing={2}>
										<Grid item>
											<Hidden xsDown>
												<Chip
													color={curso.publication ? 'primary' : 'secondary'}
													label={curso.publication ? 'Publicado' : 'No publicado'}
													icon={curso.publication ? <DoneIcon /> : <VisibilityOffIcon />}
												/>
											</Hidden>
											<Hidden smUp>
												<Chip
													color={curso.publication ? 'primary' : 'secondary'}
													icon={curso.publication ? <DoneIcon /> : <VisibilityOffIcon />}
												/>
											</Hidden>
										</Grid>
										<Grid item>
											<Hidden xsDown>
												{curso.priceCourse && curso.priceCourse.promotionPrice ? (
													<Chip
														variant="outlined"
														label="Con descuento"
														icon={<LocalOfferOutlinedIcon />}
														style={{
															backgroundColor: theme.palette.success.secondary
														}}
													/>
												) : null}
											</Hidden>
											<Hidden smUp>
												{curso.priceCourse && curso.priceCourse.promotionPrice ? (
													<Chip
														variant="outlined"
														icon={<LocalOfferOutlinedIcon />}
														style={{
															backgroundColor: theme.palette.success.secondary
														}}
													/>
												) : null}
											</Hidden>
										</Grid>
										<Grid item>
											<Chip
												variant="outlined"
												label={
													!curso.priceCourse ? (
														'Sin precio'
													) : curso.priceCourse.free ? (
														'Gratis'
													) : curso.priceCourse.promotionPrice ? (
														<Box>
															<b style={{ marginRight: theme.spacing(1) }}>
																{formatoMexico(curso.priceCourse.promotionPrice)}
															</b>
															<s>{formatoMexico(curso.priceCourse.price)}</s>
														</Box>
													) : (
														formatoMexico(curso.priceCourse.price)
													)
												}
												icon={<AttachMoneyIcon />}
											/>
										</Grid>
									</Grid>
								</LinkMaterial>
							</Grid>
							<Grid item xs={12} sm={12} md={2}>
								<Box p={1} className={classes.actions} alignItems="center">
									<Grid container spacing={1}>
										<Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color={curso.publication ? 'primary' : 'default'}
												variant="contained"
												onClick={() => publicarCurso()}
												startIcon={<PublicIcon />}
											>
												{curso.publication ? 'Publicado' : 'Publicar'}
											</Button>
										</Grid>
										{/* <Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color="primary"
												variant="contained"
												component={Link}
												to={`/instructor/contenido_curso/${curso._id}/general`}
											>
												Más detalles
											</Button>
										</Grid> */}
										<Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color="primary"
												variant="contained"
												target="_blank"
												href={`/dashboard/${curso.slug}`}
												startIcon={<ExitToAppIcon />}
											>
												Ver curso
											</Button>
										</Grid>
										{!datos.blockCourse && datos.numInscription === 0 ? (
											<Grid item xs={12} md={12} sm={4} >
												<ModalDelete open={open} toggleModal={toggleModal} eliminarCurso={eliminarCurso} />
											</Grid>
										) : null}
									</Grid>
								</Box>
							</Grid>
						</Grid>
					</Card>
				</Box>
			</Grid>
		</Fragment>
	);
}

const ModalDelete = ({ open, toggleModal, eliminarCurso }) => {
	return (
		<Fragment>
			<Button fullWidth color="secondary" variant="contained" startIcon={<DeleteIcon />} onClick={toggleModal}>
				Eliminar
			</Button>
			<Dialog open={open} onClose={toggleModal}>
				<DialogTitle>{'Estás seguro de eliminar este curso?'}</DialogTitle>
				<DialogActions>
					<Button onClick={toggleModal} color="primary">
						Cancelar
					</Button>
					<Button onClick={eliminarCurso} color="secondary" autoFocus>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
