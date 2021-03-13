import React, { useCallback, useEffect, useState } from 'react';
import { Box, Container, Typography, useTheme, Button } from '@material-ui/core';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import { Link } from 'react-router-dom';
import clienteAxios from '../../../config/axios';

export default function PagoFailed(props) {
	const message = props.match.params.message;
    const idPago = props.match.params.idPago;
	const theme = useTheme();
    const token = localStorage.getItem('token');
    const [ cursos, setCursos ] = useState([]);

    const obtenerCursos = useCallback(
		async () => {
			await clienteAxios
				.get(`/pay/${idPago}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setCursos(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ token, idPago ]
	);

    useEffect(
		() => {
			obtenerCursos();
		},
		[ obtenerCursos ]
	);

    if(cursos.length === 0 && idPago !== 'paypal') return null
    if(!token || token === null) props.history.push("/")

	return (
		<Container maxWidth="md">
			<Box
				height="90vh"
				display="flex"
				justifyContent="center"
				alignItems="center"
				boxShadow={1}
				style={{ backgroundColor: theme.palette.background.paper }}
			>
				<div>
					<Box display="flex" justifyContent="center" alignItems="center">
						<HighlightOffTwoToneIcon style={{ fontSize: 150, color: theme.palette.error.main }} />
					</Box>
					<Box mt={4} textAlign="center">
						<Typography variant="h5">
							<b>Hay un problema con su pago</b>
						</Typography>
						<Typography variant="h5">{message}</Typography>
					</Box>
					<Box my={5} display="flex" justifyContent="center">
						<Button
							color="primary"
							size="large"
							variant="contained"
							startIcon={<ReplyAllIcon />}
							component={Link}
							to="/compra"
						>
							Reintentar pago
						</Button>
					</Box>
				</div>
			</Box>
		</Container>
	);
}
