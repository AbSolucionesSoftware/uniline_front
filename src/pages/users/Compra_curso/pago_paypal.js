import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Paypal from 'paypal-checkout';
import { Box, Hidden } from '@material-ui/core';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { Fragment } from 'react';
import clienteAxios from '../../../config/axios';

export default function PagoPaypal({ order, compra, total }) {
	const token = localStorage.getItem('token');
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const paypalConfig = {
		currency: 'MXN',
		env: 'production', //sandbox o production
		client: {
			/* sandbox: process.env.REACT_APP_PAYPAL_SANDBOX, */
			production: process.env.REACT_APP_PAYPAL_LIVE
		}
	};

	const PayPalButton = Paypal.Button.driver('react', { React, ReactDOM });

	const payment = (data, actions) => {
		const payment = {
			transactions: [
				{
					amount: {
						total: order.total,
						currency: paypalConfig.currency
					},
					description: 'Compra en UNILINE',
					custom: order.customer || '',
					item_list: {
						items: order.items
					}
				}
			],
			note_to_payer: 'Contáctanos para cualquier aclaración'
		};

		return actions.payment.create({ payment });
	};

	const onAuthorize = (data, actions) => {
		return actions.payment
			.execute()
			.then(async (response) => {
				await clienteAxios
					.post(
						`/pay/confirm/paypal`,
						{
							idPaypal: response.id,
							courses: compra.courses,
							username: compra.user.name,
							idUser: compra.user._id,
							total: total,
							typePay: 'paypal'
						},
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						window.location.href = `/payment_success/${res.data.idPay}`;
					})
					.catch((err) => {
						if (err.response) {
							window.location.href = `/payment_failed/paypal/${err.response.data.message}`;
						} else {
							window.location.href = `/payment_failed/paypal/Al parecer no se a podido conectar al servidor`;
						}
					});
			})
			.catch((error) => {
				setSnackbar({
					open: true,
					mensaje: error,
					status: 'error'
				});
			});
	};

	const onError = (error) => {
		setSnackbar({
			open: true,
			mensaje: error,
			status: 'error'
		});
	};

	const onCancel = (data, actions) => {
		setSnackbar({
			open: true,
			mensaje: 'Pago cancelado',
			status: 'info'
		});
	};

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box display="flex" justifyContent="center">
				<Hidden xsDown>
					<PayPalButton
						env={paypalConfig.env}
						client={paypalConfig.client}
						payment={(data, actions) => payment(data, actions)}
						onAuthorize={(data, actions) => onAuthorize(data, actions)}
						onCancel={(data, actions) => onCancel(data, actions)}
						onError={(error) => onError(error)}
						style={{
							label: 'pay',
							size: 'large',
							shape: 'rect',
							color: 'blue'
						}}
						commit
						locale="es_MX"
					/>
				</Hidden>
				<Hidden smUp>
					<PayPalButton
						env={paypalConfig.env}
						client={paypalConfig.client}
						payment={(data, actions) => payment(data, actions)}
						onAuthorize={(data, actions) => onAuthorize(data, actions)}
						onCancel={(data, actions) => onCancel(data, actions)}
						onError={(error) => onError(error)}
						style={{
							label: 'pay',
							size: 'medium',
							shape: 'rect',
							color: 'blue'
						}}
						commit
						locale="es_MX"
					/>
				</Hidden>
			</Box>
		</Fragment>
	);
}
