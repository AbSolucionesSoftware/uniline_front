import React, { useState, useEffect, useContext, useCallback } from 'react';
import firebaseConfig from '../../config/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import clienteAxios from '../../config/axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './firebase.scss';
import MessageSnackbar from '../Snackbar/snackbar';
import Spin from '../Spin/spin';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import { NavContext } from '../../context/context_nav';
import {
	AdquirirCursoGratis,
	AgregarCarritoBD,
	CanjearCupon
} from '../../pages/users/PeticionesCompras/peticiones_compras';
/* import * as firebaseui from 'firebaseui'; */

/* var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn(); */

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

function Firebase(props) {
	const [ user, setUser ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const { setError, carrito, misCursos } = useContext(NavContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID ],
		callbacks: {
			// Avoid redirects after sign-in.
			signInSuccessWithAuthResult: () => false
		}
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

	const canjearCupon = useCallback(
		async ({ curso, cupon, urlActual }) => {
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
		},
		[ props.history, setError ]
	);

	const agregarCarrito = useCallback(
		async ({ curso, urlActual }) => {
			setLoading(true);
			let token = localStorage.getItem('token');
			let user = JSON.parse(localStorage.getItem('student'));

			let course = false;
			let cart = false;

			/* verificar si ya tienes el curso */
			misCursos.forEach((res) => {
				if (res.idCourse._id === curso) {
					course = true;
				}
				return;
			});

			/* verificar si esta en carrito */
			if (carrito && carrito.courses) {
				carrito.courses.forEach((res) => {
					cart = true;
					return;
				});
			}
			if (course) {
				setLoading(false);
				localStorage.removeItem('cart');
				props.history.push(`/dashboard/${curso}`);
				return;
			}
			if (cart) {
				setLoading(false);
				localStorage.removeItem('cart');
				props.history.push('/carrito');
				return;
			}

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
		},
		[ props.history, setError, carrito, misCursos ]
	);

	const comprarCurso = useCallback(
		async ({ curso, urlActual }) => {
			setLoading(true);
			let token = localStorage.getItem('token');
			let user = JSON.parse(localStorage.getItem('student'));
			let course = false;

			const misCursos = await obtenerMisCursos(user, token);

			/* verificar si ya tienes el curso */
			misCursos.forEach((res) => {
				if (res.idCourse._id === curso[0].idCourse) {
					course = true;
				}
				return;
			});
			setLoading(false);
			if (course) {
				localStorage.removeItem('buy');
				localStorage.setItem(
					'payment',
					JSON.stringify({
						user: user,
						courses: curso
					})
				);
				setTimeout(() => {
					props.history.push(`/dashboard/${curso[0].course.slug}`);
				}, 500);
				return;
			}
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
		},
		[ props.history ]
	);

	const adquirirCursoGratis = useCallback(
		async ({ curso, urlActual }) => {
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
		},
		[ props.history, setError ]
	);

	const onAuthStateChange = useCallback(
		() => {
			return firebase.auth().onAuthStateChanged(async (user) => {
				if (user) {
					setLoading(true);
					await clienteAxios
						.post('/user/firebase', {
							email: user.email,
							name: user.displayName
						})
						.then((res) => {
							//Usuario creado correctamente
							setLoading(false);
							setUser(true);
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
				} else {
					setUser(false);
				}
			});
		},
		[ props.history, canjearCupon, agregarCarrito, adquirirCursoGratis, comprarCurso ]
	);

	useEffect(
		() => {
			onAuthStateChange();
		},
		[ onAuthStateChange ]
	);

	return (
		<div className="App">
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			{user ? (
				<span>
					<div>Sesión activa</div>
					<h1>¡Hola!, {firebase.auth().currentUser.displayName}</h1>
				</span>
			) : (
				<StyledFirebaseAuth
					className="custom-button"
					uiCallback={(ui) => ui.disableAutoSignIn()}
					uiConfig={uiConfig}
					firebaseAuth={firebase.auth()}
				/>
			)}
		</div>
	);
}

export default withRouter(Firebase);
