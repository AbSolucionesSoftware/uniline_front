import React, { useState /* , useCallback */ /* , useEffect */ } from 'react';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	FormHelperText,
	IconButton,
	InputAdornment
} from '@material-ui/core/';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
	margin: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	}
}));

export default function CambiarPassword({ openModal, setOpenModal, user, token }) {
	const classes = useStyles();
	const [ validate1, setValidate1 ] = useState({ state: false, message: '' });
	const [ validate2, setValidate2 ] = useState({ state: false, message: '' });
	const [ validate3, setValidate3 ] = useState({ state: false, message: '' });
	const [ loading, setLoading ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);
	const [ datosPassword, setDatosPassword ] = useState([]);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleClose = () => {
		setOpenModal(false);
	};

	const obtenerCampos = (e) => {
		if (e.target.name === 'currentPassword') {
			setValidate1({ state: false, message: '' });
		} else if (e.target.name === 'password') {
			setValidate2({ state: false, message: '' });
		} else if (e.target.name === 'repeatPassword') {
			setValidate3({ state: false, message: '' });
		}
		setDatosPassword({
			...datosPassword,
			[e.target.name]: e.target.value
		});
	};

	const validacion = () => {
		if (!datosPassword.currentPassword && !datosPassword.password && !datosPassword.repeatPassword) {
			setValidate1({ state: true, message: 'Este campo es obligatorio' });
			setValidate2({ state: true, message: 'Este campo es obligatorio' });
			setValidate3({ state: true, message: 'Este campo es obligatorio' });
			return true;
		} else if (!datosPassword.currentPassword) {
			setValidate1({ state: true, message: 'Este campo es obligatorio' });
			return true;
		} else if (!datosPassword.password) {
			setValidate2({ state: true, message: 'Este campo es obligatorio' });
			return true;
		} else if (!datosPassword.repeatPassword) {
			setValidate3({ state: true, message: 'Este campo es obligatorio' });
			return true;
		} else if (datosPassword.password.length < 8) {
			setValidate2({ state: true, message: 'La contraseña debe tener al menos 8 caracteres' });
			return true;
		} else if (datosPassword.repeatPassword !== datosPassword.password) {
			setValidate3({ state: true, message: 'Las contraseñas no son iguales' });
			return true;
		}
	};

	const guardarDatosBD = async () => {
		if (validacion()) {
			return;
		}
		setLoading(true);
		await clienteAxios
			.put(`/user/reset/password/${user._id}`, datosPassword, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setOpenModal(false);
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: 'Guardado correctamente',
					status: 'success'
				});
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					if (err.response.data.message === 'Contraseña incorrecta') {
						setValidate1({ state: true, message: 'Escribe tu contraseña actual' });
					}
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
		<div>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Dialog open={openModal} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Cambiar tu contraseña</DialogTitle>
				<DialogContent>
					<DialogContentText>Tu contraseña debe tener como mínimo 8 caracteres</DialogContentText>
					<form autoComplete="off">
						<FormControl
							className={classes.margin}
							variant="outlined"
							fullWidth
							error={validate1.state ? true : false}
						>
							<InputLabel htmlFor="password-actual">Contraseña actual</InputLabel>
							<OutlinedInput
								name="currentPassword"
								autoFocus
								id="password-actual"
								label="Contraseña actual"
								type={showPassword ? 'text' : 'password'}
								onChange={obtenerCampos}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											edge="end"
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							<FormHelperText>{validate1.message}</FormHelperText>
						</FormControl>
						<FormControl
							className={classes.margin}
							variant="outlined"
							fullWidth
							error={validate2.state ? true : false}
						>
							<InputLabel htmlFor="password-nueva">Nueva contraseña</InputLabel>
							<OutlinedInput
								name="password"
								id="password-nueva"
								label="Nueva contraseña"
								type={showPassword ? 'text' : 'password'}
								onChange={obtenerCampos}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											edge="end"
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							<FormHelperText>{validate2.message}</FormHelperText>
						</FormControl>
						<FormControl
							className={classes.margin}
							variant="outlined"
							fullWidth
							error={validate3.state ? true : false}
						>
							<InputLabel htmlFor="repeat-password-nueva">Repite tu nueva contraseña</InputLabel>
							<OutlinedInput
								name="repeatPassword"
								id="repeat-password-nueva"
								label="Repite tu nueva contraseña"
								type={showPassword ? 'text' : 'password'}
								onChange={obtenerCampos}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											edge="end"
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							<FormHelperText>{validate3.message}</FormHelperText>
						</FormControl>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
					<Button variant="contained" onClick={() => guardarDatosBD()} color="primary">
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
