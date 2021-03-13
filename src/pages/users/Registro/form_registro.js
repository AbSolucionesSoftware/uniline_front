import React, { Fragment, useContext, useState } from 'react';
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
import { Link, withRouter } from 'react-router-dom';
import LinkMaterial from '@material-ui/core/Link';
import jwt_decode from 'jwt-decode';
import { NavContext } from '../../../context/context_nav';
import { AdquirirCursoGratis, AgregarCarritoBD, CanjearCupon } from '../PeticionesCompras/peticiones_compras';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '91vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

function FormRegistroUsuario(props) {
	const classes = useStyles();
	const [ datos, setDatos ] = useState([]);
	const [ checked, setChecked ] = useState(false);
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const { setError } = useContext(NavContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const url = props.match.path.split('/');

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

	const obtenerMisCursos = async (user, token) => {
		return await clienteAxios
			.get(`/course/user/${user._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
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

				/* redireccion en caso de ser comprado un curso o aplicar cupon */
				let cuponItem = JSON.parse(localStorage.getItem('coupon'));
				let cartItem = JSON.parse(localStorage.getItem('cart'));
				let buyItem = JSON.parse(localStorage.getItem('buy'));
				let freeItem = JSON.parse(localStorage.getItem('free'));
				if (cuponItem) {
					canjearCupon(cuponItem);
				} else if (cartItem) {
					agregarCarrito(cartItem);
				} else if (buyItem) {
					comprarCurso(buyItem);
				} else if (freeItem) {
					adquirirCursoGratis(freeItem);
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

	const agregarCarrito = async ({ curso, urlActual }) => {
		setLoading(true);
		let token = localStorage.getItem('token');
		let user = JSON.parse(localStorage.getItem('student'));

		const result = await AgregarCarritoBD(token, user, curso);
		if (!result.status || result.status !== 200) {
			setLoading(false);
			localStorage.removeItem('cart');
			setError({ error: true, message: result });
			props.history.push(urlActual);
			return;
		}
		setLoading(false);
		localStorage.removeItem('cart');
		props.history.push('/carrito');
	};

	const comprarCurso = async ({ curso, urlActual }) => {
		setLoading(true);
		let user = JSON.parse(localStorage.getItem('student'));

		localStorage.removeItem('buy');
		localStorage.setItem(
			'payment',
			JSON.stringify({
				user: user,
				courses: curso
			})
		);
		/* setTimeout(() => {
			props.history.push(`/compra/${curso[0].course.slug}`);
		}, 500); */
		setTimeout(() => {
			props.history.push(`/compra`);
		}, 500);
	};

	const adquirirCursoGratis = async ({ curso, urlActual }) => {
		setLoading(true);
		let token = localStorage.getItem('token');
		let user = JSON.parse(localStorage.getItem('student'));
		let course = false;

		const misCursos = await obtenerMisCursos(user, token);

		/* verificar si ya tienes el curso */
		misCursos.forEach((res) => {
			if (res.idCourse._id === curso._id) {
				course = true;
			}
			return;
		});
		if (course) {
			setLoading(false);
			localStorage.removeItem('free');
			setTimeout(() => {
				props.history.push(`/dashboard/${curso.slug}`);
			}, 500);
			return;
		}
		const result = await AdquirirCursoGratis(curso, user, token);
		if (result.status && result.status === 200) {
			setLoading(false);
			localStorage.removeItem('free');
			props.history.push('/mis_cursos');
		} else {
			localStorage.removeItem('free');
			setLoading(false);
			setError({ error: true, message: result });
			props.history.push(urlActual);
			return;
		}
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
					<Typography variant="h4">Ingresa tus datos</Typography>
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
											Acepto políticas y condiciones
										</LinkMaterial>
									</Typography>
								}
							/>
							<FormHelperText id="my-helper-text">Acepta las políticas para registrarte.</FormHelperText>
						</FormControl>
					</Box>
					<Box display="flex" justifyContent="center" my={5}>
						<Button variant="contained" color="primary" onClick={() => enviarDatosBD()}>
							Crear cuenta
						</Button>
					</Box>

					{url[1] === 'registro' ? (
						<Fragment>
							<Divider />
							<Box display="flex" justifyContent="center" mt={2}>
								<Button variant="contained" color="secondary" component={Link} to="/login">
									Iniciar sesión con Google o Facebook
								</Button>
							</Box>
						</Fragment>
					) : null}
				</Box>
			</div>
		</Fragment>
	);
}
export default withRouter(FormRegistroUsuario);
