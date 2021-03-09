import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { DashboardContext } from '../../../context/dashboar_context';

const useStyles = makeStyles((theme) => ({
	input: {
		display: 'none'
	}
}));

export default function ProyectoFinal({ curso, user }) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { progreso } = useContext(DashboardContext);
	const [ file, setFile ] = useState(null);
	const [ homework, setHomework ] = useState(null);
	const [ loadingHomework, setLoadingHomework ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ update, setUpdate ] = useState(false);
	const [ validacionFile, setValidacionFile ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const getFile = (e) => {
		try {
			setFile(e.target.files[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerHomework = useCallback(
		async () => {
			setLoadingHomework(true);
			await clienteAxios
				.get(`/homework/${curso.course._id}/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoadingHomework(false);
					setHomework(res.data);
				})
				.catch((err) => {
					setLoadingHomework(false);
					console.log(err);
				});
		},
		[ curso.course._id, token, user._id ]
	);

	const subirArchivo = async () => {
		if (!file) {
			setValidacionFile(true);
			return;
		}
		const formData = new FormData();
		formData.append('file', file);
		setLoading(true);
		await clienteAxios
			.post(`/homework/${curso.course._id}/user/${user._id}`, formData, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setUpdate(!update);
				setFile(null);
				setLoading(false);
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

	const eliminarArchivo = async () => {
		setLoading(true);
		await clienteAxios
			.delete(`/homework/delete/${homework._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setUpdate(!update);
				setLoading(false);
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

	useEffect(
		() => {
			obtenerHomework();
		},
		[ obtenerHomework, update ]
	);

	if (loadingHomework) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box mt={1}>
				{homework && homework.qualificationHomework ? (
					<Typography align="center">Calificacion: {homework.qualificationHomework}</Typography>
				) : (
					<Typography align="center">Calificacion: En revisión</Typography>
				)}
				<Box className={classes.root} my={1}>
					<input
						name="urlTopicVideo"
						className={classes.input}
						id="proyecto-final"
						type="file"
						onChange={getFile}
					/>
					<label htmlFor="proyecto-final" className={classes.root}>
						<Button
							startIcon={<DescriptionOutlinedIcon />}
							color={validacionFile && !file ? 'secondary' : 'default'}
							variant="outlined"
							component="span"
							fullWidth
							disabled={parseInt(progreso) !== 100 || homework !== null}
						>
							{file ? file.name : homework !== null ? homework.homeworkFileKey : 'Cargar Archivo'}
						</Button>
					</label>
				</Box>
				{loading ? (
					<Box mt={1}>
						<LinearProgress />
					</Box>
				) : null}
				{file ? (
					<Box my={1} display="flex" justifyContent="flex-end">
						<Button fullWidth variant="contained" color="primary" onClick={subirArchivo}>
							Enviar a revisión
						</Button>
					</Box>
				) : null}
				{homework !== null && !homework.qualificationHomework ? (
					<Box my={1} display="flex" justifyContent="flex-end">
						<Button fullWidth variant="outlined" color="secondary" onClick={eliminarArchivo}>
							Eliminar archivo
						</Button>
					</Box>
				) : null}
			</Box>
			<Button
				fullWidth
				variant="outlined"
				color="primary"
				disabled={!homework || !homework.qualificationHomework ? true : false}
				target="_blank"
				href={`/certificado/${curso.course.slug}`}
			>
				Certificado
			</Button>
			{/* <GenerarCertificado curso={curso} homework={homework} /> */}
		</Fragment>
	);
}
