import React, { useContext, useState } from 'react';
import { Box, Container, Grid, makeStyles, Typography, Button, Divider } from '@material-ui/core';
import ImagenCart from '../../../images/Cart.png';
import { NavContext } from '../../../context/context_nav';
import ListaCarrito from './lista_carrito';
import SpinNormal from '../../../components/Spin/spinNormal';
import { Fragment } from 'react';
import { formatoMexico } from '../../../config/reuserFunction';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	background: {
		backgroundColor: theme.palette.background.paper
	}
}));

export default function Carrito(props) {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const { carrito, update, setUpdate } = useContext(NavContext);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	let user = { _id: '' };

	if (!token || !user) props.history.push('/');
	
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	if (carrito.length === 0) {
		return <SpinNormal />;
	}

	if (carrito.courses && carrito.courses.length === 0) {
		return (
			<Container maxWidth="lg">
				<Box height="80vh" mt={5}>
					<Box display="flex" justifyContent="center">
						<Box height="60vh">
							<img alt="error 404" src={ImagenCart} className={classes.imagen} />
						</Box>
					</Box>
					<Typography variant="h4" align="center">
						Tu carrito esta vacío
					</Typography>
				</Box>
			</Container>
		);
	}

	const render_lista = carrito.courses.map((articulo, index) => {
		return (
			<Fragment key={index}>
				<ListaCarrito articulo={articulo} setLoading={setLoading} setSnackbar={setSnackbar} user={user} />
				{carrito.courses.length !== index + 1 ? <Divider /> : null}
			</Fragment>
		);
	});

	/* total de carrito */
	let total = 0;
	let totalAnterior = 0;
	let descuento = 0;
	let promocion = false;
	carrito.courses.forEach((articulo) => {
		if (articulo.course.priceCourse.free) {
			total += 0;
		} else {
			if (articulo.course.priceCourse.promotionPrice) {
				total += articulo.course.priceCourse.promotionPrice;
				promocion = true;
			} else {
				total += articulo.course.priceCourse.price;
			}
		}
		totalAnterior += articulo.course.priceCourse.price;
		descuento = ((total * 100 / totalAnterior - 100) * -1).toFixed(2);
	});

	const eliminarCarrito = async () => {
		setLoading(true);
		await clienteAxios
			.delete(`/cart/${user._id}/`, {
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

	return (
		<Container maxWidth="lg">
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box mt={5}>
				<Box mb={2}>
					<Typography variant="h4" align="center">
						Tu carrito de compras
					</Typography>
				</Box>
				<Box boxShadow={2} p={5} minHeight="70vh" className={classes.background}>
					<Grid container spacing={2}>
						<Grid item lg={8} md={8} xs={12}>
							<Box display="flex" justifyContent="center">
								<Button size="small" color="primary" onClick={() => eliminarCarrito()}>
									Vaciar carrito
								</Button>
							</Box>
							{render_lista}
						</Grid>
						<Grid item lg={4} md={4} xs={12}>
							<Box p={4}>
								<Typography variant="h5">Total:</Typography>
								<Typography variant="h4">
									<b>{formatoMexico(total)} $MXN</b>
								</Typography>
								{promocion ? (
									<Grid container spacing={3}>
										<Grid item>
											<Typography variant="h6" color="textSecondary">
												<s>{formatoMexico(totalAnterior)} $MXN</s>
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="h6" color="textSecondary">
												{descuento}% de descuento
											</Typography>
										</Grid>
									</Grid>
								) : null}
								<Box my={2}>
									<Divider />
								</Box>
								<Button fullWidth color="secondary" size="large" variant="contained" component={Link} to={`/carrito/compra/${carrito._id}`}>
									Pagar ahora
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
