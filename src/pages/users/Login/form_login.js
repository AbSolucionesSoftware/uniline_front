import React, { Fragment, useContext, useState } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';
import Firebase from '../../../components/Firebase/firebase';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import { NavContext } from '../../../context/context_nav';
import { CanjearCupon } from '../PeticionesCompras/peticiones_compras';

function FormLoginUsuario(props) {
	const [ datos, setDatos ] = useState([]);
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const { setError } = useContext(NavContext);
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

	const enviarDatosBD = async () => {
		if (!datos.email || !datos.password) {
			setValidate(true);
			return;
		}
		setLoading(true);
		await clienteAxios
			.post('/user/signIn', datos)
			.then((res) => {
				const decoded = jwt_decode(res.data.token);
				setLoading(false);
				const token = res.data.token;
				localStorage.setItem('token', token);
				localStorage.setItem('student', JSON.stringify(decoded));
				/* window.location.href = '/'; */

				/* redireccion en caso de ser comprado un curso o aplicar cupon */
				let cuponItem = JSON.parse(localStorage.getItem('coupon'));
				if (cuponItem) {
					canjearCupon(cuponItem);
				} else {
					props.history.push('/');
				}
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

	const canjearCupon = async ({ curso, cupon, urlActual }) => {
		setLoading(true);
		let token = localStorage.getItem('token');
		let user = JSON.parse(localStorage.getItem('student'));

		const result = await CanjearCupon(token, user, curso, cupon);
		if (!result.status || result.status !== 200) {
			setLoading(false);
			localStorage.removeItem('coupon');
			setError({ error: true, message: result });
			props.history.push(urlActual);
			return;
		}
		setLoading(false);
		localStorage.removeItem('coupon');
		props.history.push('/mis_cursos');
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
			<Box p={5}>
				<Typography variant="h4">Inicia sesión</Typography>
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
				<Box display="flex" justifyContent="center" mt={5}>
					<Button variant="contained" color="primary" onClick={() => enviarDatosBD()}>
						Iniciar sesión
					</Button>
				</Box>
			</Box>
			<Divider />
			<Box p={5} textAlign="center">
				<Typography variant="h6">Inicia sesión con Google o Facebook</Typography>
				<Firebase />
			</Box>
		</Fragment>
	);
}
export default withRouter(FormLoginUsuario);
