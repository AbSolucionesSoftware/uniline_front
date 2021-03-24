import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, Button, Typography } from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '91vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

export default function FormRegistroInstructor(props) {
	const classes = useStyles();
	const [ datos, setDatos ] = useState([]);
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const obtenerCampos = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const enviarDatosBD = async (e) => {
		e.preventDefault();
		if (!datos.name || !datos.email || !datos.password || !datos.repeatPassword) {
			setValidate(true);
			return;
		}
		setLoading(true);
		await clienteAxios
			.post('/user', datos)
			.then((res) => {
				setLoading(false);
				console.log(res);
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
		<Fragment>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<form onSubmit={enviarDatosBD}>
				<Typography variant="h4">Registra un nuevo instructor</Typography>
				<Box my={2}>
					<TextField
						error={!datos.name && validate}
						helperText={!datos.name && validate ? 'Esta campo es requerido' : null}
						fullWidth
						required
						id="mombre"
						name="name"
						label="Nombre"
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<TextField
						error={!datos.email && validate}
						helperText={!datos.email && validate ? 'Esta campo es requerido' : null}
						fullWidth
						required
						id="email"
						name="email"
						label="Email"
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<TextField
						error={!datos.password && validate}
						helperText={!datos.password && validate ? 'Esta campo es requerido' : null}
						fullWidth
						required
						id="password"
						name="password"
						label="Contraseña"
						type="password"
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<TextField
						error={!datos.repeatPassword && validate}
						helperText={!datos.repeatPassword && validate ? 'Esta campo es requerido' : null}
						fullWidth
						required
						id="repeatPassword"
						name="repeatPassword"
						label="Repite tu contraseña"
						type="password"
						onChange={obtenerCampos}
					/>
				</Box>
				<Box display="flex" justifyContent="center" my={5}>
					<Button type="submit" variant="contained" color="primary" /* onClick={() => enviarDatosBD()} */>
						Crear cuenta
					</Button>
				</Box>
			</form>
		</Fragment>
	);
}
