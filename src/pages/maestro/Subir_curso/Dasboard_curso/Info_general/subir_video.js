import React, { Fragment, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, InputBase, Typography, Button, Grid } from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import { CursoContext } from '../../../../../context/curso_context';
import { configVimeo /*  ClientRequestVimeo */ } from '../../../../../config/config_vimeo';

import VimeoReproductor from '../../../../../components/Vimeo_Reproductor/Vimeo';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';
import BackDropVideo from '../../../../../components/Spin/backdropVideo';

var Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(
	'b2af4468710c93e79707cfdbd36e8090a22ba023',
	'NERzVNSwQkIfxL7T4QvpEpwlOf5u+cjzQq0u71G4jE7BzATZRudjfbAQAPzBZT3kgJFyXtyg7bC9B0XeA6hylQyk7RvbSupNfjv49ZuasGvvv9D40zSEbg5yoc9yJ7q4',
	'b5397e1eef8a02fe5c3e0041e703af59'
);

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper
	},
	select: {
		width: '100%',
		margin: '8px 0'
	},
	input: {
		display: 'none'
	},
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	margin: {
		margin: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	}
}));

export default function SubirVideo() {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { datos, update, setUpdate } = useContext(CursoContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ fileVideo, setFileVideo ] = useState(null);
	const [ progress, setProgress ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ backdrop, setBackdrop ] = useState(false);

	const getFile = (e) => {
		try {
			setFileVideo(e.target.files[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const successAPI = (mensaje) => {
		setSnackbar({
			open: true,
			mensaje: mensaje,
			status: 'success'
		});
		setUpdate(!update);
		setLoading(false);
		setBackdrop(false);
		setProgress(0);
		setFileVideo(null);
	};

	const errorAPI = (err) => {
		setLoading(false);
		setBackdrop(false);
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
	};

	const enviarVideo = () => {
		setLoading(true);
		setBackdrop(true);
		client.upload(
			fileVideo,
			configVimeo(datos.title),
			function(uri) {
				const spleter = uri.split('/');
				/* ClientRequestVimeo(client, uri) */
				clienteAxios
					.put(
						`/course/video/${datos._id}`,
						{
							urlCourseVideo: spleter[2]
						},
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						successAPI(res.data.message);
					})
					.catch((err) => {
						errorAPI(err);
					});
			},
			function(bytesUploaded, bytesTotal) {
				var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
				/* console.log(bytesUploaded, bytesTotal, percentage + '%'); */
				setLoading(false);
				setProgress(parseInt(percentage));
			},
			function(error) {
				setLoading(false);
				setBackdrop(false);
				setSnackbar({
					open: true,
					mensaje: 'Hubo un error: ' + error,
					status: 'error'
				});
			}
		);
	};

	const eliminarVideo = () => {
		setLoading(true);
		client.request(
			{
				method: 'DELETE',
				path: `/videos/${datos.urlCourseVideo}`
			},
			function(error, body, status_code) {
				if (error) {
					setLoading(false);
					setSnackbar({
						open: true,
						mensaje: 'Hubo un error: ' + error,
						status: 'error'
					});
					return;
				}
				clienteAxios
					.put(
						`/course/video/${datos._id}`,
						{
							urlCourseVideo: ''
						},
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						successAPI('video eliminado');
					})
					.catch((err) => {
						errorAPI(err);
					});
			}
		);
	};

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<BackDropVideo backdrop={backdrop} loading={loading} progress={progress} />
			<Grid container direction="row" spacing={1}>
				<Grid item lg={6} sm={12}>
					{datos.urlCourseVideo ? (
						<Box height={250} display="flex" justifyContent="center" alignItems="center">
							<VimeoReproductor
								idVideo={datos.urlCourseVideo ? datos.urlCourseVideo : ''}
								width="100%"
								height="100%"
							/>
						</Box>
					) : (
						<Box height={300} display="flex" justifyContent="center" alignItems="center">
							<Box textAlign="center">
								<VideocamOutlinedIcon style={{ fontSize: 130 }} />
								<Typography>No hay video de presentacion</Typography>
							</Box>
						</Box>
					)}
				</Grid>
				<Grid item lg={6}>
					<Box>
						<Alert severity="info">
							<Typography variant="body1">
								Este video aparecera en la descripción cuando los estudiantes den click en tu curso.
							</Typography>
							<br />
							<Typography variant="body2">
								Al subir un video, la plataforma tardara unos minutos en renderizar el contenido,
								despues de eso recarga la pagina para ver el video.
							</Typography>
						</Alert>
					</Box>
					<Box mt={1}>
						<input
							name="promotionalVideo"
							className={classes.input}
							id="icon-button-video"
							type="file"
							onChange={getFile}
						/>

						<label htmlFor="icon-button-video">
							<Button
								startIcon={<VideoCallIcon style={{ fontSize: 30 }} />}
								color="primary"
								variant="outlined"
								component="span"
								disabled={!datos.urlCourseVideo ? false : true}
							>
								Cargar archivo
							</Button>
						</label>
						<InputBase
							value={fileVideo ? fileVideo.name : ''}
							placeholder=" Selecciona un video"
							inputProps={{ 'aria-label': 'naked', readOnly: true }}
						/>
						{loading ? (
							<Box mt={1}>
								<LinearProgress />
							</Box>
						) : null}
						<Grid container spacing={1}>
							<Grid item>
								{!fileVideo ? null : (
									<Box mt={1}>
										<Button
											variant="contained"
											color="primary"
											size="large"
											onClick={() => enviarVideo()}
										>
											Subir
										</Button>
									</Box>
								)}
							</Grid>
							<Grid item>
								{!datos.urlCourseVideo ? null : (
									<Box mt={1}>
										<Grid container>
											<Grid item>
												<Button
													variant="contained"
													color="secondary"
													size="large"
													onClick={() => eliminarVideo()}
												>
													Eliminar video
												</Button>
											</Grid>
										</Grid>
									</Box>
								)}
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	);
}

/* function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={2}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
			</Box>
		</Box>
	);
} */
