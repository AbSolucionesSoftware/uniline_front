import React, { Fragment, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, useTheme } from '@material-ui/core';
import { CardElement } from '@stripe/react-stripe-js';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';

export default function PagoCredito({ compra, total }) {
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LLAVE);
	const [ idPago, setIdPago ] = useState('');
	const [ card, setCard ] = useState({});
	const [ loadingPago, setLoadingPago ] = useState(false);
	const [ loadingCancel, setLoadingCancel ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const realizarPago = async () => {
		setLoadingPago(true);
		await clienteAxios
			.put(
				`/pay/confirm/${idPago}`,
				{
					idPay: idPago
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoadingPago(false);
				window.location.href = `/payment_success/${idPago}`;
			})
			.catch((err) => {
				setLoadingPago(false);
				if (err.response) {
					window.location.href = `/payment_failed/${idPago}/${err.response.data.message}`;
				} else {
					window.location.href = `/payment_failed/${idPago}/Al parecer no se a podido conectar al servidor`;
				}
			});
	};

	const cancelarPago = async () => {
		setLoadingCancel(true);
		setTimeout(() => {
			window.location.href = '/';
		}, 1000);
	};

	return (
		<Fragment>
			{idPago ? (
				<Box>
					<Box my={4}>
						<Box my={1}>
							<Typography><b>Se aplicará el cargo a esta tarjeta:</b></Typography>
						</Box>
						<Grid container spacing={2}>
							<Grid item>
								<FontAwesomeIcon
									icon={card.brand === 'visa' ? faCcVisa : faCcMastercard}
									style={{ fontSize: '50px', color: theme.palette.primary.main }}
								/>
							</Grid>
							<Grid item>
								<Typography>
									<b>Tipo de tarjeta: </b>
									{card.funding}
								</Typography>
								<Typography>
									<b>Tarjeta: </b>*********{card.last4}
								</Typography>
								<Typography>
									<b>Expira: </b>
									{card.exp_month}/{card.exp_year}
								</Typography>
							</Grid>
						</Grid>
					</Box>
					<Box my={1}>
						<Button
							fullWidth
							color="secondary"
							size="large"
							variant="contained"
							startIcon={loadingPago ? <CircularProgress color="inherit" size={20} /> : null}
							onClick={() => realizarPago()}
						>
							Realizar Pago
						</Button>
					</Box>
					<Box my={1}>
						<Button
							fullWidth
							color="secondary"
							size="large"
							variant="outlined"
							startIcon={loadingCancel ? <CircularProgress color="inherit" size={20} /> : null}
							onClick={() => cancelarPago()}
						>
							Cancelar
						</Button>
					</Box>
				</Box>
			) : (
				<Elements stripe={stripePromise}>
					<CheckOutForm compra={compra} total={total} setIdPago={setIdPago} setCard={setCard} />
				</Elements>
			)}
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
		</Fragment>
	);
}

const CheckOutForm = ({ compra, total, setIdPago, setCard }) => {
	const theme = useTheme();
	const stripe = useStripe();
	const elements = useElements();
	const token = localStorage.getItem('token');

	const [ loadingCancel, setLoadingCancel ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const CARD_OPTIONS = {
		iconStyle: 'solid',
		style: {
			base: {
				iconColor: theme.palette.primary.main,
				color: theme.palette.text.primary,
				fontWeight: 400,
				fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
				fontSize: '16px',
				fontSmoothing: 'antialiased',
				':-webkit-autofill': { color: theme.palette.text.primary },
				'::placeholder': { color: theme.palette.text.hint }
			},
			invalid: {
				iconColor: theme.palette.error.main,
				color: theme.palette.error.main
			}
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}
		setLoading(true);
		const cardElement = elements.getElement(CardElement);

		// Use your card Element with other Stripe.js APIs
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement
		});

		if (error) {
			setLoading(false);
			setSnackbar({
				open: true,
				mensaje: 'Al parecer no se a podido conectar al servidor.',
				status: 'error'
			});
		} else {
			const datos = {
				idStripe: paymentMethod,
				courses: compra.courses,
				username: compra.user.name,
				idUser: compra.user._id,
				total: total,
				typePay: 'stripe'
			};
			crearPagoBD(datos);
		}
	};

	const crearPagoBD = async (datos) => {
		await clienteAxios
			.post(`/pay/generate`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setIdPago(res.data.idPay);
				setCard(datos.idStripe.card);
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

	const cancelarPago = async () => {
		setLoadingCancel(true);
		setTimeout(() => {
			window.location.href = '/';
		}, 1000);
	};

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<form onSubmit={handleSubmit}>
				<Box my={4}>
					<CardElement options={CARD_OPTIONS} />
				</Box>
				<Button
					fullWidth
					color="secondary"
					size="large"
					variant="contained"
					type="submit"
					disabled={!stripe}
					startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
				>
					Comprobar tarjeta
				</Button>
				<Box my={1}>
					<Button
						fullWidth
						color="secondary"
						size="large"
						variant="outlined"
						startIcon={loadingCancel ? <CircularProgress color="inherit" size={20} /> : null}
						onClick={() => cancelarPago()}
					>
						Cancelar
					</Button>
				</Box>
			</form>
		</Fragment>
	);
};
