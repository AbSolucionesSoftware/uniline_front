import React, { useState, useCallback, useEffect, useContext } from 'react';
import useStyles from './styles';
import { Box, TextField, Button, Typography, Container, ButtonBase, Grid, Hidden } from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';
import { useDropzone } from 'react-dropzone';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import { InputLabel, InputAdornment } from '@material-ui/core/';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import Zoom from '@material-ui/core/Zoom';
import CambiarPassword from './password';
import Notebook from '../../../images/Notebook.png';
import { NavContext } from '../../../context/context_nav';
import jwt_decode from 'jwt-decode';
import './inputs.css';

import FaceIcon from '@material-ui/icons/Face';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SchoolIcon from '@material-ui/icons/School';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

export default function PerfilUsuario(props) {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const [ datos, setDatos ] = useState([]);
	const [ preview, setPreview ] = useState(null);
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ openModal, setOpenModal ] = React.useState(false);
	const [ controlImagen, setControlImagen ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const { update, setUpdate } = useContext(NavContext);
	let user = { _id: '' };

	if (!token) props.history.push('/');
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const onDrop = useCallback(
		(files) => {
			setControlImagen(true);
			setPreview(URL.createObjectURL(files[0]));
			setDatos({
				...datos,
				urlImage: files[0]
			});
		},
		[ datos ]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const obtenerCampos = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const obtenerDatosBD = useCallback(
		async () => {
			if (!user._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setDatos(res.data);
					setPreview(res.data.urlImage);
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
		},
		[ token, user._id ]
	);

	const guardarDatosBD = async () => {
		if (!datos.name) {
			setValidate(true);
			return;
		}
		const formData = new FormData();
		for (const key in datos) {
			if (Object.hasOwnProperty.call(datos, key)) {
				const element = datos[key];
				if (key === 'urlImage') {
					if (controlImagen) {
						formData.append('imagen', element);
					}
				} else if (key !== 'password' && key !== 'keyImage') {
					formData.append(key, element);
				}
			}
		}

		setLoading(true);
		await clienteAxios
			.put(`/user/${user._id}`, formData, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				localStorage.setItem('student', JSON.stringify(jwt_decode(res.data.token)));
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: 'Guardado correctamente',
					status: 'success'
				});
				setUpdate(!update);
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

	useEffect(
		() => {
			obtenerDatosBD();
		},
		[ obtenerDatosBD ]
	);

	return (
		<Container maxWidth="md">
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Zoom in={true} style={{ transitionDelay: '500ms' }}>
				<Button
					variant="contained"
					color="primary"
					aria-label="Guardar"
					className={classes.iconSave}
					onClick={() => guardarDatosBD()}
				>
					<SaveIcon className={classes.margin} />
					Guardar
				</Button>
			</Zoom>
			<CambiarPassword openModal={openModal} setOpenModal={setOpenModal} user={user} token={token} />
			<Box display="flex" alignItems="center" minHeight="91vh" boxShadow={2} px={5}>
				<Hidden xsDown>
					<Box position="absolute" height="90vh" zIndex={0}>
						<img alt="imagen edit perfil" src={Notebook} className={classes.imagen} />
					</Box>
				</Hidden>
				<Grid container direction="column">
					<Box display="flex" justifyContent="center" py={3}>
						<Box
							maxWidth={300}
							display="flex"
							justifyContent="center"
							alignItems="flex-end"
							{...getRootProps()}
						>
							<ButtonBase focusRipple className={classes.image}>
								<input {...getInputProps()} name="urlImage" />
								{datos.urlImage ? (
									<span
										className={classes.imageSrc}
										style={{
											backgroundImage: preview ? `url(${preview})` : ``
										}}
									/>
								) : (
									<Box
										display="flex"
										justifyContent="center"
										alignItems="center"
										className={classes.imageSrc}
									>
										<AccountBoxIcon style={{ fontSize: 150, opacity: 0.5 }} />
									</Box>
								)}

								<span className={classes.imageBackdrop} />
								<span className={classes.imageButton}>
									<Grid container direction="column">
										<Typography
											component="span"
											variant="subtitle1"
											color="inherit"
											className={classes.imageEditButton}
										>
											<CameraAltIcon style={{ fontSize: 90, opacity: 0.7 }} />
										</Typography>
										<Typography
											component="span"
											color="inherit"
											className={classes.imageEditButton}
										>
											{isDragActive ? (
												<Typography>Suelta tu archivo aquí ...</Typography>
											) : (
												<Typography>
													Arrastra y suelta un archivo o selecciona uno haciendo click
												</Typography>
											)}
										</Typography>
									</Grid>
								</span>
							</ButtonBase>
						</Box>
					</Box>
					<Grid container direction="row" spacing={2} className={classes.root}>
						<Grid item xs={12}>
							<TextField
								error={validate && !datos.name}
								id="name"
								name="name"
								label="Nombre"
								placeholder="Nombre"
								fullWidth
								variant="outlined"
								value={datos.name ? datos.name : ''}
								onChange={obtenerCampos}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FaceIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<TextField
								id="age"
								name="age"
								label="Edad"
								placeholder="Edad"
								type="number"
								fullWidth
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<DateRangeIcon />
										</InputAdornment>
									),
									inputProps: { min: 0 }
								}}
								value={datos.age ? datos.age : ''}
								onChange={obtenerCampos}
							/>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<FormControl variant="outlined" fullWidth>
								<InputLabel id="label-escolaridad">Escolaridad</InputLabel>
								<Select
									fullWidth
									labelId="label-escolaridad"
									label="Escolaridad"
									id="scholarship"
									name="scholarship"
									onChange={obtenerCampos}
									value={datos.scholarship ? datos.scholarship : ''}
									renderValue={(value) => value}
									startAdornment={
										<InputAdornment position="start">
											<SchoolIcon />
										</InputAdornment>
									}
								>
									<MenuItem value="">
										<em>Ninguna</em>
									</MenuItem>
									<MenuItem value="Educación Primaria">Educación Primaria</MenuItem>
									<MenuItem value="Educación secundaria">Educación secundaria</MenuItem>
									<MenuItem value="Educación media superior o bachillerato">
										Educación media superior o bachillerato
									</MenuItem>
									<MenuItem value="Educación media superior, técnico superior, licenciatura o postgrado">
										Educación media superior, técnico superior, licenciatura o postgrado
									</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<TextField
								className="no-spin"
								id="phone"
								name="phone"
								label="Telefono"
								placeholder="Telefono"
								type="number"
								fullWidth
								variant="outlined"
								value={datos.phone ? datos.phone : ''}
								onChange={obtenerCampos}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PhoneIphoneIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<TextField
								id="email"
								name="email"
								label="Correo electrónico"
								placeholder="Correo electrónico"
								fullWidth
								variant="outlined"
								value={datos.email ? datos.email : ''}
								onChange={obtenerCampos}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<MailOutlineIcon />
										</InputAdornment>
									)
								}}
								disabled
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="profession"
								name="profession"
								label="Profesión"
								fullWidth
								variant="outlined"
								placeholder="Ejemplo: Ingeniero, maestro en diseño grafico, desarrollador web"
								value={datos.profession ? datos.profession : ''}
								onChange={obtenerCampos}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<WorkOutlineIcon />
										</InputAdornment>
									)
								}}
							/>
						</Grid>
					</Grid>
					{user && user.sessiontype !== 'ApiRest' ? null : (
						<Box my={2}>
							<Button color="primary" variant="text" onClick={() => setOpenModal(true)}>
								Cambiar tu contraseña
							</Button>
						</Box>
					)}
				</Grid>
			</Box>
		</Container>
	);
}
