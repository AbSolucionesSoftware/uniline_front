import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Box,
	TextField,
	Checkbox,
	FormControl,
	FormHelperText,
	FormControlLabel,
	Button,
	Typography,
	Divider
} from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';
import { Link } from 'react-router-dom';
import LinkMaterial from '@material-ui/core/Link';
import jwt_decode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '91vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

export default function FormRegistroUsuario() {
	const classes = useStyles();
	const [ datos, setDatos ] = useState([]);
	const [ checked, setChecked ] = useState(false);
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const obtenerCampos = (e) => {
		if (e.target.name === 'acceptPolicies') {
			setChecked(!checked);
			setDatos({
				...datos,
				[e.target.name]: e.target.checked
			});
			return;
		}
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const enviarDatosBD = async () => {
		if (!datos.name || !datos.email || !datos.password || !datos.repeatPassword || !datos.acceptPolicies) {
			setValidate(true);
			return;
		}
		setLoading(true);
		await clienteAxios
			.post('/user', datos)
			.then((res) => {
				setLoading(false);
				const token = res.data.token;
				const decoded = jwt_decode(token);
				localStorage.setItem('token', token);
				localStorage.setItem('student', JSON.stringify(decoded));
				window.location.href = '/';
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
			<div className={classes.root}>
				<Box p={5} width={500}>
					<Typography variant="h4">Registro</Typography>
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
					<Box my={2}>
						<FormControl error={!datos.acceptPolicies && validate}>
							<FormControlLabel
								control={
									<Checkbox
										checked={checked}
										name="acceptPolicies"
										color="primary"
										onChange={obtenerCampos}
									/>
								}
								label={
									<Typography>
										<LinkMaterial target="_blank" href="/politicas">
											Acepto politicas y condiciones
										</LinkMaterial>
									</Typography>
								}
							/>
							<FormHelperText id="my-helper-text">Acepta las politicas para registrarte.</FormHelperText>
						</FormControl>
					</Box>
					<Box display="flex" justifyContent="center" my={5}>
						<Button variant="contained" color="primary" onClick={() => enviarDatosBD()}>
							Crear cuenta
						</Button>
					</Box>
					<Divider />
					<Box display="flex" justifyContent="center" mt={2}>
						<Button variant="contained" color="secondary" component={Link} to="/login">
							Iniciar sesión con Google o Facebook
						</Button>
					</Box>
				</Box>
			</div>
		</Fragment>
	);
}
