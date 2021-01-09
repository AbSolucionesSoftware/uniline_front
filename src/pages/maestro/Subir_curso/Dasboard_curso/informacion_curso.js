import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Grid, Select, TextField, IconButton, InputBase, Divider, Typography, Button } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import Scroll from '../../../../components/ScrolltoTop/scroll';
import VimeoReproductor from '../../../../components/Vimeo_Reproductor/Vimeo';
import Spin from '../../../../components/Spin/spin';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';


var  Vimeo  =  require ( 'vimeo' ) . Vimeo ; 
let client = new Vimeo("b2af4468710c93e79707cfdbd36e8090a22ba023","NERzVNSwQkIfxL7T4QvpEpwlOf5u+cjzQq0u71G4jE7BzATZRudjfbAQAPzBZT3kgJFyXtyg7bC9B0XeA6hylQyk7RvbSupNfjv49ZuasGvvv9D40zSEbg5yoc9yJ7q4","b5397e1eef8a02fe5c3e0041e703af59");

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
    },
}));

export default function RegistroInformacionCurso() {
	const classes = useStyles();
	const [ datos, setDatos ] = useState([]);
    const [ validacion, setValidacion ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [video, setVideo] = useState()
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        mensaje: '',
        status: ''
	})
	const [idVideo, setIdVideo] = useState("498098745");
	const [fileVideo, setFileVideo] = useState([]);
	const [progress, setProgress] = useState(10);
	  
	useEffect(() => {
		const timer = setInterval(() => {
		  setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
		}, 800);
		return () => {
		  clearInterval(timer);
		};
	  }, []);

	const obtenerCampos = (e) => {
		setValidacion(false);
		if (e.target.files) {
			setDatos({
				...datos,
				[e.target.name]: e.target.files
			});
		} else if (!e.bubbles) {
			setDatos({
				...datos,
				description: e
			});
		} else {
			setDatos({
				...datos,
				[e.target.name]: e.target.value
			});
		}
	};

	const getFile = (e) => {
		try {
			setFileVideo(e.target.files);
			console.log(e.target.files);
		} catch (error) {
			console.log(error);
		}
	}
	
	const enviarVideo = (e) => {
		console.log(e.target.files);
		client.upload(
			e.target.files[0],
			{
				name: "pruena de uno",
				embed: {
					buttons: {
						fullscreen: true,
						embed: false,
						hd: true,
						like: true,
						scaling:true,
						share: false,
						watchlater: false
					},
					volume: true,
					logos:{
						custom:{
							active: true,
							sticky: false
						},
						vimeo: false
					},
					playbar: true,
					title:{
						name: "show",
						owner: "show",
						portrait: "show"
					},
					color: "black"
				},
				privacy: {
					view: "anybody",
					download: false,
					comments: "nobody"
				},
				review_page:{
					vimeo_logo: true,
					active: true,
					notes: false
				}

			},
			function (uri) {
			  console.log('File upload completed. Your Vimeo URI is:', uri)
			  const spleter = uri.split('/');
			  console.log(spleter)
			  setIdVideo(spleter[2]);

			  /* client.request({
				method: 'PUT',
				path: uri + '/privacy/domains/http://localhost:3000'
			  }, function (error, body, status_code, headers) {
				console.log(uri + ' will only be embeddable on "http://localhost:3000".')
				client.request({
				  method: 'PATCH',
				  path: uri,
				  query: {
					'privacy': {
					  'embed': 'whitelist'
					}
				  }
				}, function (error, body, status_code, headers) {
				  console.log(uri + ' will only be embeddable on "http://localhost:3000".')
				})
			  }) */


			},
			function (bytesUploaded, bytesTotal) {
			  var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
			  console.log(bytesUploaded, bytesTotal, percentage + '%')
			},
			function (error) {
			  console.log('Failed because: ' + error)
			}
		  )
	};

	const guardarDatos = () => {
		if (
			!datos.title ||
			!datos.subtitle ||
			!datos.description ||
			!datos.languaje ||
			!datos.category ||
			!datos.subMategory ||
			!datos.level
		) {
            setValidacion(true);
            setSnackbar({
                open: true,
                mensaje: "Hubo un error",
                status: 'error'
            })
			return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSnackbar({
                open: true,
                mensaje: "Guardado correctamente",
                status: 'success'
            })
        }, 3000);
		setValidacion(false);
		console.log(datos);
	};

	return (
		<Box p={5} boxShadow={5} className={classes.color}>
            <Spin loading={loading} />
            <MessageSnackbar open={snackbar.open} mensaje={snackbar.mensaje} status={snackbar.status} setSnackbar={setSnackbar} />
			<div>
				<Button
					variant="contained"
					color="primary"
					aria-label="Guardar"
					className={classes.iconSave}
					onClick={() => guardarDatos()}
				>
					<SaveIcon className={classes.margin} />
					Guardar
				</Button>
				<Scroll showBelow={250} />
			</div>
			<form>
				<Typography variant="h6">Información básica</Typography>
				<Box my={2}>
					<TextField 
						fullWidth
						required
						name="title"
						id="titulo-curso"
						label="Titulo"
						/* defaultValue={datos.title ? datos.title : ''} */
						variant="outlined"
						error={validacion && !datos.title ? true : false}
						helperText={validacion && !datos.title ? 'Campo requerido' : ''}
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<TextField
						fullWidth
						required
						name="subtitle"
						id="subtitulo-curso"
						label="Subtitulo"
						/* defaultValue="Default Value" */
						variant="outlined"
						error={validacion && !datos.subtitle ? true : false}
						helperText={validacion && !datos.subtitle ? 'Campo requerido' : ''}
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<Typography variant="subtitle1">Descripción</Typography>
					<FormControl
						variant="outlined"
						className={classes.select}
						error={validacion && !datos.description ? true : false}
					>
						<Editor
							name="description"
							init={{
								height: 250,
								menubar: true,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount'
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
							}}
							onChange={obtenerCampos}
						/>
						{validacion && !datos.description ? <FormHelperText>campo requerido</FormHelperText> : null}
					</FormControl>
				</Box>
				<Box mt={2} mb={5}>
					<Grid container direction="row" justify="space-evenly">
						<Grid item lg={5} md={5} xs={12}>
							<FormControl
								variant="outlined"
								className={classes.select}
								error={validacion && !datos.languaje ? true : false}
							>
								<InputLabel id="label-lenguaje">Lenguaje</InputLabel>
								<Select
									labelId="label-lenguaje"
									id="lenguaje"
									name="languaje"
									value={datos.languaje ? datos.languaje : ''}
									onChange={obtenerCampos}
									label="Age"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
								{validacion && !datos.languaje ? (
									<FormHelperText>campo requerido</FormHelperText>
								) : null}
							</FormControl>
							<FormControl
								variant="outlined"
								className={classes.select}
								error={validacion && !datos.level ? true : false}
							>
								<InputLabel id="label-nivel">Nivel</InputLabel>
								<Select
									labelId="label-nivel"
									id="nivel"
									name="level"
									value={datos.level ? datos.level : ''}
									onChange={obtenerCampos}
									label="Age"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
								{validacion && !datos.level ? <FormHelperText>campo requerido</FormHelperText> : null}
							</FormControl>
						</Grid>
						<Grid item lg={5} md={5} xs={12}>
							<FormControl
								variant="outlined"
								className={classes.select}
								error={validacion && !datos.category ? true : false}
							>
								<InputLabel id="label-categoria">Categoria</InputLabel>
								<Select
									labelId="label-categoria"
									id="categoria"
									name="category"
									value={datos.category ? datos.category : ''}
									onChange={obtenerCampos}
									label="Age"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
								{validacion && !datos.category ? (
									<FormHelperText>campo requerido</FormHelperText>
								) : null}
							</FormControl>
							<FormControl
								variant="outlined"
								className={classes.select}
								error={validacion && !datos.subMategory ? true : false}
							>
								<InputLabel id="label-subcategoria">Subcategoria</InputLabel>
								<Select
									labelId="label-subcategoria"
									id="subcategoria"
									name="subMategory"
									value={datos.subMategory ? datos.subMategory : ''}
									onChange={obtenerCampos}
									label="Age"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
								{validacion && !datos.subMategory ? (
									<FormHelperText>campo requerido</FormHelperText>
								) : null}
							</FormControl>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Typography variant="h6">Imagen promocional del curso</Typography>
				<Box my={2}>
					<Grid container direction="row">
						<Grid item lg={6}>
							{/* <Box height={300} >
                                <img alt="imagen del curso" src="" className={classes.imagen} />
                            </Box> */}
							<Box height={300} display="flex" justifyContent="center" alignItems="center">
								<CropOriginalIcon style={{ fontSize: 200, color: '#696969' }} />
							</Box>
						</Grid>
						<Grid item lg={6}>
							<Box my={2}>
								<Alert severity="info">
									Carga la imagen de tu curso aquí. Para ser aceptada, debe cumplir nuestros
									estándares de calidad para las imágenes de los cursos. Directrices importantes: 750
									x 422 píxeles; formato .jpg, .jpeg, .gif, o .png.; y sin texto en la imagen.
								</Alert>
							</Box>
							<Box boxShadow={1}>
								<input
									name="urlPromotionalImage"
									accept="image/*"
									className={classes.input}
									id="icon-button-file"
									type="file"
									onChange={obtenerCampos}
								/>
								<label htmlFor="icon-button-file">
									<IconButton color="primary" aria-label="upload picture" component="span">
										<PhotoCamera style={{ fontSize: 40 }} />
									</IconButton>
								</label>
								<InputBase
									value={
										datos.urlPromotionalImage ? (
											datos.urlPromotionalImage[0].name
										) : (
											'Selecciona una imagen'
										)
									}
									inputProps={{ 'aria-label': 'naked', readOnly: true }}
								/>
							</Box>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Typography variant="h6">Video promocional del curso</Typography>
				<Box my={2}>
					<Grid container direction="row">
						<Grid item lg={6}>
							{/* <Box height={300} >
                                <img alt="imagen del curso" src="" className={classes.imagen} />
                            </Box> */}
							<Box height={300} display="flex" justifyContent="center" alignItems="center">
								<VimeoReproductor idVideo={idVideo} width={"600"} height={"300"} />
								{/* style={{ fontSize: 200, color: '#696969' }} */} 
							</Box>
						</Grid>
						<Grid item lg={6}>
							<Box my={2}>
								<Alert severity="info">
									Los estudiantes que ven un vídeo promocional bien hecho tienen 5 veces más
									probabilidades de matricularse en tu curso. Esa estadística se multiplica por 10 si
									los vídeos son excepcionalmente buenos. Aprende a hacer los tuyos impresionantes
								</Alert>
							</Box>
							<Box boxShadow={1}>
								<input
									name="promotionalVideo"
									className={classes.input}
									id="icon-button-video"
									type="file"
									onChange={getFile}
								/>

								<label htmlFor="icon-button-video">
									<IconButton color="primary" aria-label="upload picture" component="span">
										<VideoCallIcon style={{ fontSize: 40 }} />
									</IconButton>
								</label>
								<InputBase
									value={
										datos.promotionalVideo ? datos.promotionalVideo[0].name : 'Selecciona un video'
									}
									inputProps={{ 'aria-label': 'naked', readOnly: true }}
								/>
								<div className={classes.root}>
									<LinearProgressWithLabel value={progress} />
								</div>
								<Box boxShadow={1}>
									<Button variant="contained" color="primary" >
										Subir
									</Button>	
									<Button variant="contained" color="secondary" >
										Cancelar
									</Button>
								</Box>
								
								<Box boxShadow={1}></Box>
								
							</Box>
						</Grid>
					</Grid>
				</Box>
			</form>
		</Box>
	);
}


function LinearProgressWithLabel(props) {
	return (
	  <Box display="flex" alignItems="center">
		<Box width="100%" mr={2}>
		  <LinearProgress variant="determinate" {...props} />
		</Box>
		<Box minWidth={35}>
		  <Typography variant="body2" color="textSecondary">{`${Math.round(
			props.value,
		  )}%`}</Typography>
		</Box>
	  </Box>
	);
  }
