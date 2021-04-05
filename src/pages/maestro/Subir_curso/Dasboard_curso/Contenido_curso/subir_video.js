import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Box,
	Button,
	InputBase,
	Grid,
	LinearProgress,
} from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ImagenVideo from '../../../../../images/Video-tutorial-bro.png';
import VimeoReproductor from '../../../../../components/Vimeo_Reproductor/Vimeo';
import { client, configVimeo, ClientRequestVimeo } from '../../../../../config/config_vimeo';
import clienteAxios from '../../../../../config/axios';
import { CursoContext } from '../../../../../context/curso_context';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import BackDropVideo from '../../../../../components/Spin/backdropVideo';

const useStyles = makeStyles((theme) => ({
	input: {
		display: 'none'
	},
	imagen: {
		height: 250,
		width: 250
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	progressbar: {
		zIndex: theme.zIndex.drawer + 9999
	}
}));

export default function SubirVideoTema({ tema }) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { update, setUpdate } = useContext(CursoContext);
	const [ progress, setProgress ] = useState(0);
	const [ fileVideo, setFileVideo ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ backdrop, setBackdrop ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const getFileVideo = (e) => {
		try {
			setFileVideo(e.target.files[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const enviarVideo = () => {
		if (!fileVideo) {
			return;
		}
		setLoading(true);
		setBackdrop(true);
		client.upload(
			fileVideo,
			configVimeo(tema.topicTitle),
			function(uri) {
				const spleter = uri.split('/');
				ClientRequestVimeo(client, uri)
				clienteAxios
					.put(
						`/course/topic/video/${tema._id}`,
						{
							keyTopicVideo: spleter[2]
						},
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						setSnackbar({
							open: true,
							mensaje: res.data.message,
							status: 'success'
						});
						setUpdate(!update);
						setLoading(false);
						setBackdrop(false);
						setProgress(0);
						setFileVideo(null);
					})
					.catch((err) => {
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
				path: `/videos/${tema.keyTopicVideo}`
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
						`/course/topic/video/${tema._id}`,
						{
							keyTopicVideo: ''
						},
						{
							headers: {
								Authorization: `bearer ${token}`
							}
						}
					)
					.then((res) => {
						setSnackbar({
							open: true,
							mensaje: 'Video eliminado',
							status: 'success'
						});
						setUpdate(!update);
						setLoading(false);
						setProgress(0);
						setFileVideo(null);
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
			}
		);
	};

	return (
		<Box>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<BackDropVideo backdrop={backdrop} loading={loading} progress={progress} />
			<Grid container spacing={1}>
				<Grid item lg={4}>
					<Box height={150} display="flex" justifyContent="center" alignItems="center">
						{tema.keyTopicVideo ? (
							<VimeoReproductor
								idVideo={tema.keyTopicVideo ? tema.keyTopicVideo : ''}
								width="100%"
								height="100%"
							/>
						) : (
							<img alt="video del tema" src={ImagenVideo} className={classes.imagen} />
						)}
					</Box>
				</Grid>
				<Grid item>
					<Box height="100%" display="flex" alignItems="center">
						<Box>
							<input
								name="keyTopicVideo"
								className={classes.input}
								id={`topic-video-${tema._id}`}
								type="file"
								onChange={getFileVideo}
							/>

							<label htmlFor={`topic-video-${tema._id}`}>
								<Button
									startIcon={<VideoCallIcon />}
									color="primary"
									variant="outlined"
									component="span"
									disabled={!tema.keyTopicVideo ? false : true}
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
									{!tema.keyTopicVideo ? (
										<Box mt={1}>
											<Button variant="contained" color="primary" onClick={() => enviarVideo()}>
												Subir
											</Button>
										</Box>
									) : null}
								</Grid>
								<Grid item>
									{tema.keyTopicVideo ? (
										<Box mt={1}>
											<Grid container>
												<Grid item>
													<Button
														variant="contained"
														color="secondary"
														onClick={() => eliminarVideo()}
													>
														Eliminar video
													</Button>
												</Grid>
											</Grid>
										</Box>
									) : null}
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
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


