import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Paypal from 'paypal-checkout';
import { Box } from '@material-ui/core';
import { Fragment } from 'react';
import { withRouter } from 'react-router-dom';

function PagoPaypalMovil(props) {
    let user = { _id: '' };
	let token = localStorage.getItem('token');
    const [ status, setStatus ] = useState();
    const total = props.match.params.amount;

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));
    if (!token || !user) props.history.push('/');

	const order = {
		customer: '',
		total: parseInt(total).toFixed(2)
	};

	const paypalConfig = {
		currency: 'MXN',
		env: 'sandbox', //sandbox o production
		client: {
			sandbox: process.env.REACT_APP_PAYPAL_SANDBOX
			/* production: process.env.REACT_APP_PAYPAL_LIVE */
		}
	};

    console.log(status);

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
					custom: order.customer || ''
				}
			],
			note_to_payer: 'Contáctanos para cualquier aclaración'
		};

		return actions.payment.create({ payment });
	};

	const onAuthorize = (data, actions) => {
		return actions.payment
			.execute()
			.then((response) => {
                setStatus(response)
			})
			.catch((error) => {
                setStatus(error)
			});
	};

	const onError = (error) => {
		console.log(error);
        setStatus(error)
	};

	const onCancel = (data, actions) => {
		console.log('pago cancelado');
        setStatus('Pago Cancelado')
	};

	return (
		<Fragment>
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
			</Box>
		</Fragment>
	);
}
export default withRouter(PagoPaypalMovil)
