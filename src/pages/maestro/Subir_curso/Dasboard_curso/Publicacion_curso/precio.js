import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Divider, Grid, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { CursoContext } from '../../../../../context/curso_context';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';
import Spin from '../../../../../components/Spin/spin';
import PromocionCurso from './promocion';
import GenerarCupones from './cupones';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper
	}
}));

export default function PrecioCurso() {
	const classes = useStyles();
	const { datos, setDatos, update, setUpdate } = useContext(CursoContext);
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const obtenerDatos = (e) => {
		setDatos({
			...datos,
			priceCourse: {
				free: false,
                price: e.target.value,
                promotionPrice: 0,
				persentagePromotion: 0
                
			}
		});
	};

	const messages = (message, status) => {
		if (status === 'success') {
			setLoading(false);
			setSnackbar({
				open: true,
				mensaje: message.data.message,
				status: 'success'
			});
		} else {
			setLoading(false);
			if (message.response) {
				setSnackbar({
					open: true,
					mensaje: message.response.data.message,
					status: 'error'
				});
			} else {
				setSnackbar({
					open: true,
					mensaje: 'Al parecer no se a podido conectar al servidor.',
					status: 'error'
				});
			}
		}
	};

	const guardarPreciosBD = async () => {
		if (!datos.priceCourse) {
			return;
		}
		if (!datos.priceCourse.price || datos.priceCourse.price <= 0) {
			return;
		}
		const nuevos_datos = {
			priceCourse: {
				free: datos.priceCourse.free ? datos.priceCourse.free : false,
				price: datos.priceCourse.price,
				promotionPrice: datos.priceCourse.promotionPrice ? datos.priceCourse.promotionPrice : 0,
				persentagePromotion: datos.priceCourse.persentagePromotion ? datos.priceCourse.persentagePromotion : 0
			}
		};
		await clienteAxios
			.put(`/course/price-promotion/${datos._id}`, nuevos_datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				messages(res, 'success');
				setUpdate(!update);
			})
			.catch((err) => {
				messages(err, 'success');
			});
	};

	const guardarCursoGratis = async (free) => {
		await clienteAxios
			.put(
				`/course/price-promotion/${datos._id}`,
				{
					priceCourse: {
						free,
						price: 0,
						promotionPrice: 0,
						persentagePromotion: 0
					}
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				messages(res, 'success');
				setUpdate(!update);
			})
			.catch((err) => {
				MessageSnackbar(err, 'error');
			});
	};

	return (
		<Box p={5} boxShadow={5} className={classes.color}>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box mb={2}>
				<Alert severity="info">
					Aquí podrás ponerle precio a tus cursos, promociones o cupones para tus estudiantes
				</Alert>
			</Box>
			<Box my={3}>
				<Typography variant="h6" style={{ marginBottom: 10 }}>
					Precio del curso
				</Typography>
				<form className={classes.root} noValidate autoComplete="off">
					<Grid container spacing={2}>
						<Grid item>
							<TextField
								id="outlined-basic"
								name="price"
								type="number"
								label="Precio"
								variant="outlined"
								size="small"
								onChange={obtenerDatos}
								value={!datos.priceCourse || !datos.priceCourse.price ? '' : datos.priceCourse.price}
								disabled={!datos.priceCourse || !datos.priceCourse.free ? false : true}
							/>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								disableElevation
								disabled={!datos.priceCourse || !datos.priceCourse.free ? false : true}
								onClick={guardarPreciosBD}
							>
								Guardar
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant="outlined"
								color={!datos.priceCourse || !datos.priceCourse.free ? 'inherit' : 'primary'}
								onClick={() => {
									guardarCursoGratis(
										!datos.priceCourse || !datos.priceCourse.free ? true : !datos.priceCourse.free
									);
								}}
							>
								{!datos.priceCourse || !datos.priceCourse.free ? (
									'Poner tu curso GRATIS'
								) : (
									'tu curso está GRATIS'
								)}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Box>
			<Divider />
			<Box my={3}>
				<Typography variant="h6" style={{ marginBottom: 10 }}>
					Promociones
				</Typography>
				<Box>
					{!datos.priceCourse || !datos.priceCourse.price || datos.priceCourse.free ? (
						<Alert severity="info">
							No puedes poner promocion sin precio o si tu curso esta en modo gratuito
						</Alert>
					) : (
						<PromocionCurso />
					)}
				</Box>
			</Box>
			<Divider />
			<Box my={3}>
				<Typography variant="h6" style={{ marginBottom: 10 }}>
					Cupones
				</Typography>
				<Box>
					{!datos.priceCourse || !datos.priceCourse.price || datos.priceCourse.free ? (
						<Alert severity="info">
							No puedes agregar cupones sin precio o si tu curso esta en modo gratuito
						</Alert>
					) : (
						<GenerarCupones />
					)}
				</Box>
			</Box>
		</Box>
	);
}
