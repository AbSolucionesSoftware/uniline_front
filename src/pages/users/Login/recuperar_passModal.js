import React, { Fragment, useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';

export default function RecuperarPassModal() {
	const [ open, setOpen ] = useState(false);
	const [ email, setEmail ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleModal = () => {
		setOpen(!open);
	};

	const obtenerCampos = (value) => setEmail(value);

	const enviarDatosBD = async () => {
		setLoading(true);
		await clienteAxios
			.post(`/user/generate/reset/pass`, {
				email: email
			})
			.then((res) => {
				setLoading(false);
				handleModal();
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
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
			<Button onClick={handleModal} color="primary">
				¿Olvidaste tu contraseña?
			</Button>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Dialog
				open={open}
				onClose={handleModal}
				aria-labelledby="alert-dialog-title-recovery"
				aria-describedby="alert-dialog-description-recovery"
			>
				<DialogTitle id="alert-dialog-title-recovery">{'Recupera tu contraseña'}</DialogTitle>
				<DialogContent>
					<Typography color="textSecondary">
						Mandaremos un email a la seguiente dirección de correo electrónico donde recibirás un enlace
						para restablecer tu contraseña
					</Typography>
					<br />
					<Typography color="textSecondary">
						<b>Nota: </b> Si no ves el correo electronico en tu bandeja de entrada, tal vez este en{' '}
						<b>"Correo no deseado"</b>
					</Typography>
					<TextField
						autoFocus
						margin="dense"
						id="email"
						label="Correo electronico"
						type="email"
						fullWidth
						onChange={(e) => obtenerCampos(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button
						color="primary"
						autoFocus
						variant="contained"
						onClick={enviarDatosBD}
						startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
					>
						Enviar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
