import React, { Fragment, useContext, useState } from 'react';
import { Box, CardContent, Divider, Button, TextField, Chip, Dialog } from '@material-ui/core';
import { makeStyles, Typography, IconButton, CircularProgress } from '@material-ui/core';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PlayCircleFilledOutlinedIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import WarningIcon from '@material-ui/icons/Warning';
import { formatoMexico } from '../../../config/reuserFunction';
import { withRouter } from 'react-router-dom';
import RegistroAlterno from '../RegistroAlterno/registro_alterno';
import { NavContext } from '../../../context/context_nav';
import { AgregarCarritoBD, CanjearCupon } from '../PeticionesCompras/peticiones_compras';
import { FacebookShareButton, WhatsappShareButton } from 'react-share';
import urlPage from '../../../config/url';

const useStyles = makeStyles((theme) => ({
	background: {
		height: 220,
		backgroundColor: '#434343'
	},
	buttonPlay: {
		color: 'white',
		fontSize: 80
	},
	backgroundPlay: {
		height: 220,
		width: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0, 0.3)!important',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	imagen: {
		maxWidth: '100%',
		maxHeight: '100%',
		position: 'relative'
	}
}));

function VistaCursoPanelPrincipal(props) {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const { curso, handleVideoModal, setSnackbar } = props;
	const [ cupon, setCupon ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ loadingCart, setLoadingCart ] = useState(false);
	const [ open, setOpen ] = useState(false);
	const { error, setError, update, setUpdate, carrito } = useContext(NavContext);
	let user = { _id: '' };
	const urlActual = props.match.url;

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCupon = (e) => setCupon(e.target.value);
	const handleModal = () => setOpen(!open);

	const canjearCupon = async () => {
		if (!cupon) {
			return;
		} else if (!token || !user._id) {
			handleModal();
			localStorage.setItem('coupon', JSON.stringify({ curso, cupon, urlActual }));
			return;
		}
		const result = await CanjearCupon(token, user, curso, cupon);

		setLoading(true);
		if (result.status && result.status === 200) {
			setLoading(false);
			setCupon('');
			props.history.push('/mis_cursos');
		} else {
			setLoading(false);
			if (result.response) {
				setSnackbar({
					open: true,
					mensaje: result.response.data.message,
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

	const agregarCarrito = async () => {
		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('cart', JSON.stringify({ curso: curso.course._id, urlActual }));
			return;
		}

		const result = await AgregarCarritoBD(token, user, curso.course._id);
		setLoadingCart(true);
		if (result.status && result.status === 200) {
			setLoadingCart(false);
			setUpdate(!update);
			setSnackbar({
				open: true,
				mensaje: result.data.message,
				status: 'success'
			});
		} else {
			setLoadingCart(false);
			if (result.response) {
				setSnackbar({
					open: true,
					mensaje: result.response.data.message,
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

	/* verificar si esta en carrito */
	let cart = false;
	if (carrito && carrito.courses) {
		carrito.courses.forEach((res) => {
			if (res.course._id === curso.course._id) cart = true;
		});
	}

	return (
		<Fragment>
			<Box
				height="220px"
				display="flex"
				justifyContent="center"
				alignItems="center"
				className={classes.background}
			>
				<img alt="imagen del curso" src={curso.course.urlPromotionalImage} className={classes.imagen} />
				<Box className={classes.backgroundPlay}>
					<IconButton onClick={handleVideoModal}>
						<PlayCircleFilledOutlinedIcon className={classes.buttonPlay} />
					</IconButton>
				</Box>
			</Box>
			<CardContent>
				<Box>
					{curso.course.priceCourse ? curso.course.priceCourse.free ? (
						<Chip
							className={classes.free}
							label={
								<Typography variant="h6" color="textPrimary">
									¡Este curso es gratis!
								</Typography>
							}
						/>
					) : curso.course.priceCourse.promotionPrice ? (
						<Box display="flex" justifyContent="center">
							<Box mr={2}>
								<Typography variant="h5" color="textPrimary">
									<b>{formatoMexico(curso.course.priceCourse.promotionPrice)} MX$</b>
								</Typography>
							</Box>
							<Typography variant="h5" color="textSecondary">
								<s>{formatoMexico(curso.course.priceCourse.price)} MX$</s>
							</Typography>
						</Box>
					) : (
						<Typography variant="h5" color="textPrimary">
							<b>{formatoMexico(curso.course.priceCourse.price)} MX$</b>
						</Typography>
					) : (
						<Typography variant="h5" color="textPrimary">
							<b>0 MX$</b>
						</Typography>
					)}
				</Box>
				<Box my={1}>
					<Button
						color="primary"
						variant="contained"
						fullWidth
						size="large"
						disabled={!curso.course.priceCourse ? true : false}
					>
						Comprar ahora
					</Button>
				</Box>
				<Box my={1}>
					{cart ? (
						<Button
							color="secondary"
							variant="outlined"
							fullWidth
							size="large"
							startIcon={<ShoppingCartOutlinedIcon />}
							onClick={() => props.history.push('/carrito')}
						>
							Ir al carrito
						</Button>
					) : (
						<Button
							color="secondary"
							variant="outlined"
							disabled={!curso.course.priceCourse ? true : false}
							fullWidth
							size="large"
							startIcon={
								loadingCart ? (
									<CircularProgress size={20} color="inherit" />
								) : (
									<ShoppingCartOutlinedIcon />
								)
							}
							onClick={() => agregarCarrito()}
						>
							Agregar a carrito
						</Button>
					)}
				</Box>
				<Divider />
				<Box my={2}>
					<Typography variant="subtitle1" align="center" color="textSecondary">
						<b>¡Canjea tu cupón aquí!</b>
					</Typography>
					<Box display="flex" justifyContent="space-around">
						<TextField variant="outlined" label="código de cupon" size="small" onChange={obtenerCupon} />
						<Button
							variant="contained"
							color="secondary"
							endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
							onClick={() => canjearCupon()}
						>
							Canjear
						</Button>
					</Box>
				</Box>
				<Divider />
				<Box mt={2}>
					<Typography variant="subtitle1" align="center" color="textSecondary">
						<b>Comparte este curso con tus amigos</b>
					</Typography>
					<Box display="flex" justifyContent="space-around">
						<FacebookShareButton url={urlPage + urlActual} quote={curso.course.title}>
							<Button variant="outlined" color="primary" startIcon={<FacebookIcon />}>
								Facebook
							</Button>
						</FacebookShareButton>
						<WhatsappShareButton url={urlPage + urlActual} title={curso.course.title} separator=":: ">
							<Button variant="outlined" color="primary" startIcon={<WhatsAppIcon />}>
								WhatsApp
							</Button>
						</WhatsappShareButton>
					</Box>
				</Box>
			</CardContent>
			<ModalRegistro handleModal={handleModal} open={open} error={error} setError={setError} />
		</Fragment>
	);
}

const ModalRegistro = ({ handleModal, open, error, setError }) => {
	const handleClose = () => {
		handleModal();
		localStorage.removeItem('coupon');
		localStorage.removeItem('cart');
		setError({ error: false, message: '' });
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth>
			{!error.error ? (
				<RegistroAlterno />
			) : error.message.response ? (
				<Box m={5} display="flex" alignItems="center">
					<WarningIcon style={{ fontSize: 70, marginRight: 10 }} color="error" />
					<Box>
						<Typography variant="h6">Lo sentimos</Typography>
						<Typography variant="h5">{error.message.response.data.message}</Typography>
					</Box>
				</Box>
			) : (
				<div>hubo un error desconocido</div>
			)}
		</Dialog>
	);
};
export default withRouter(VistaCursoPanelPrincipal);
