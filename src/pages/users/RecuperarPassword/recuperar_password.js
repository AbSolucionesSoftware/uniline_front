import React, { useState } from 'react';
import { Box, Button, CircularProgress, Container, TextField, Typography } from '@material-ui/core';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function RecuperarPassword(props) {
	const [ datos, setDatos ] = useState({ password: '', repeatPassword: '' });
	const [ validate, setValidate ] = useState({ validate: false, message: '' });
	const [ loading, setLoading ] = useState(false);
	const [ redir, setRedir ] = useState(false);
	const [ mostrarPass, setMostrarPass ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const key = props.match.params.url;

	const obtenerCampos = (e) => {
		setDatos({ ...datos, [e.target.name]: e.target.value });
		setValidate({ validate: false, message: '' });
	};

	const enviarDatosBD = async () => {
		if (!datos.password || !datos.repeatPassword) {
			setValidate({ validate: true, message: 'Este campo es requeridos' });
			return;
		}
		if (datos.password !== datos.repeatPassword) {
			setValidate({ validate: true, message: 'Las contraseñas no son iguales' });
			return;
		}
		setLoading(true);
		await clienteAxios
			.put(`/user/verify/${key}`, {
				password: datos.password,
				repeatPassword: datos.repeatPassword
			})
			.then((res) => {
				setLoading(false);
				const token = res.data.token;
				const decoded = jwt_decode(token);
				localStorage.setItem('token', token);
				localStorage.setItem('student', JSON.stringify(decoded));
				setRedir(true);
				setTimeout(() => {
					props.history.push('/login');
					setRedir(false);
				}, 1200);
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
		<Container maxWidth="sm">
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box minHeight="90vh" p={5}>
				<Box display="flex" justifyContent="center">
					{loading ? <CircularProgress /> : null}
					{redir ? <Typography variant="h6">Redireccionando a login...</Typography> : null}
				</Box>
				<Box my={4}>
					<Typography variant="h6" color="textSecondary">
						Escribe y confirma tu nueva contraseña
					</Typography>
				</Box>
				<Box my={2}>
					<TextField
						error={validate.validate}
						helperText={validate.message}
						variant="outlined"
						fullWidth
						required
						id="password"
						name="password"
						label="Contraseña"
						type={mostrarPass ? 'text' : 'password'}
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<TextField
						error={validate.validate}
						helperText={validate.message}
						variant="outlined"
						fullWidth
						required
						id="repeatPassword"
						name="repeatPassword"
						label="Repite tu contraseña"
						type={mostrarPass ? 'text' : 'password'}
						onChange={obtenerCampos}
					/>
				</Box>
				<Button color="primary" onClick={() => setMostrarPass(!mostrarPass)}>
					{mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
				</Button>
				<Box my={5} display="flex" justifyContent="center">
					<Button variant="contained" color="primary" onClick={() => enviarDatosBD()}>
						Cambiar contraseña
					</Button>
				</Box>
			</Box>
		</Container>
	);
}

export default withRouter(RecuperarPassword);
