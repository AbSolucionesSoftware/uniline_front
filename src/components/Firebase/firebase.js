import React, { useState, useEffect } from 'react';
import firebaseConfig from '../../config/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import clienteAxios from '../../config/axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './firebase.scss';
import MessageSnackbar from '../Snackbar/snackbar';
/* import * as firebaseui from 'firebaseui'; */

/* var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn(); */

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

function Firebase(props) {
	const [ user, setUser ] = useState(false);
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

	useEffect(() => {
		function onAuthStateChange() {
			return firebase.auth().onAuthStateChanged(async (user) => {
				if (user) {
					await clienteAxios
						.post('/user/firebase', {
							email: user.email,
							name: user.displayName
						})
						.then((res) => {
							//Usuario creado correctamente
							setUser(true);
							setSnackbar({
								open: true,
								mensaje: 'bienvenido ' + user.displayName,
								status: 'success'
							});
							const token = res.data.token;
							localStorage.setItem('token', token);
							setTimeout(() => {
								window.location.href = '/';
							}, 1500);
						})
						.catch((err) => {
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
		}
		onAuthStateChange();
	}, []);

	return (
		<div className="App">
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

export default Firebase;
