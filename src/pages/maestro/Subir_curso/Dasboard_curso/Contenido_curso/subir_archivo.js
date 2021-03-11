import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	Grid,
	LinearProgress
} from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { Link, Typography, ListItemIcon, TextField, Divider, IconButton } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import LinkIcon from '@material-ui/icons/Link';
import Alert from '@material-ui/lab/Alert';
import { CursoContext } from '../../../../../context/curso_context';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	input: {
		display: 'none'
	},
	imagen: {
		height: 250,
		width: 250
	},
	divider: {
		height: 28,
		margin: 4
	}
}));

export default function SubirArchivoTema({ tema }) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { update, setUpdate } = useContext(CursoContext);
	const [ loading, setLoading ] = useState(false);
	const [ loadingFile, setLoadingFile ] = useState(false);
	const [ validacion, setValidacion ] = useState(false);
	const [ validacionFile, setValidacionFile ] = useState(false);
	const [ url, setUrl ] = useState({
		title: '',
		urlExtern: ''
	});
	const [ file, setFile ] = useState({
		title: '',
		urlDownloadResource: ''
	});
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const [ resourceDel, setResourceDel ] = useState({ open: false, resource: '' });
	const handleClick = (resource) => {
		setResourceDel({ open: !resourceDel.open, resource });
	};

	const getFile = (e) => {
		setFile({ ...file, urlDownloadResource: e.target.files[0] })
	};
	const getFileTitle = (e) => setFile({ ...file, title: e.target.value });

	const getUrl = (e) => setUrl({ ...url, [e.target.name]: e.target.value });

	const subirArchivo = async () => {
		if (!file.title || !file.urlDownloadResource) {
			setValidacionFile(true);
			return;
		}
		const formData = new FormData();
		formData.append('title', file.title);
		formData.append('file', file.urlDownloadResource);
		setLoadingFile(true);
		await clienteAxios
			.post(`/course/topic/resource/${tema._id}`, formData, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setValidacion(false);
				setUpdate(!update);
				setLoadingFile(false);
				setFile({title: '', urlDownloadResource: ''})
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
			})
			.catch((err) => {
				setLoadingFile(false);
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

	const subirEnlace = async () => {
		if (!url.title || !url.urlExtern) {
			setValidacion(true);
			return;
		}
		setLoading(true);
		await clienteAxios
			.post(`/course/topic/resource/${tema._id}`, url, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setValidacion(false);
				setUpdate(!update);
				setLoading(false);
				setUrl({title: '', urlExtern: ''})
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

	const eliminarRecurso = async (resource) => {
		setLoadingFile(true);
		await clienteAxios
			.delete(`/course/topic/${tema._id}/delete/resource/${resource}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setUpdate(!update);
				setLoadingFile(false);
				setResourceDel({open: false, resource: ''});
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
			})
			.catch((err) => {
				setLoadingFile(false);
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

	const render_archivos = tema.resources.map((recurso, index) => (
		<List key={index}>
			<Recursos recurso={recurso} handleClick={handleClick} />
			<Divider />
		</List>
	));

	return (
		<Box>
			<ConfirmacionDelete
				resourceDel={resourceDel}
				eliminarRecurso={eliminarRecurso}
				handleClick={handleClick}
			/>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Alert icon={false} severity="info">
				Aquí puedes subir archivos o enlaces de DropBox, Google Drive, etc.
			</Alert>
			<Grid container spacing={2}>
				<Grid item lg={6}>
					{render_archivos}
				</Grid>
				<Grid item lg={6}>
					<Box className={classes.root} my={1}>
						<form noValidate autoComplete="off">
							<Box my={1}>
								<TextField
									name="urlExtern"
									label="Nombre del archivo"
									variant="outlined"
									size="small"
									fullWidth
									value={file.title}
									onChange={getFileTitle}
									error={validacionFile && !file.title}
								/>
							</Box>
						</form>
						<input
							name="urlDownloadResource"
							className={classes.input}
							id={`topic-file-${tema._id}`}
							type="file"
							onChange={getFile}
						/>
						<label htmlFor={`topic-file-${tema._id}`} className={classes.root}>
							<Button
								startIcon={<DescriptionOutlinedIcon />}
								color={validacionFile && !file.urlDownloadResource ? 'secondary' : 'default'}
								variant="outlined"
								component="span"
								fullWidth
								/* disabled={!datos.urlCourseVideo ? false : true} */
							>
								{file.urlDownloadResource ? file.urlDownloadResource.name : 'Cargar Archivo'}
							</Button>
						</label>
					</Box>
					{loadingFile ? (
						<Box mt={1}>
							<LinearProgress />
						</Box>
					) : null}
					<Box my={1} display="flex" justifyContent="flex-end">
						<Button variant="contained" color="primary" onClick={subirArchivo}>
							Guardar archivo
						</Button>
					</Box>
					<Divider />
					<Box my={2}>
						<form noValidate autoComplete="off">
							<Box>
								<TextField
									name="title"
									label="Titulo del enlace"
									variant="outlined"
									size="small"
									fullWidth
									value={url.title}
									onChange={getUrl}
									error={validacion && !url.title}
								/>
							</Box>
							<Box mt={1}>
								<TextField
									name="urlExtern"
									label="Enlace externo"
									variant="outlined"
									size="small"
									fullWidth
									value={url.urlExtern}
									onChange={getUrl}
									error={validacion && !url.urlExtern}
								/>
							</Box>
						</form>
						{loading ? (
							<Box mt={1}>
								<LinearProgress />
							</Box>
						) : null}
						<Box mt={1} display="flex" justifyContent="flex-end">
							<Button color="primary" variant="contained" onClick={subirEnlace}>
								Guardar Enlace
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

function Recursos({ recurso, handleClick }) {
	let title = `${recurso.keyDownloadResource}`;
	let type = title.split('.');
	const nombre_archivo = `${recurso.title}.${type[1]}`;

	return (
		<ListItem dense>
			<ListItemIcon>{recurso.urlExtern ? <LinkIcon /> : <DescriptionOutlinedIcon />}</ListItemIcon>
			<ListItemText
				id="switch-list-label-wifi"
				primary={
					<Typography>
						{recurso.urlExtern ? (
							<Link target="_blank" rel="noopener" href={recurso.urlExtern}>
								{recurso.title}
							</Link>
						) : (
							<Link href={recurso.urlDownloadResource} download={recurso.title}>
								{nombre_archivo}
							</Link>
						)}
					</Typography>
				}
			/>
			<ListItemSecondaryAction>
				<IconButton color="secondary" onClick={() => handleClick(recurso._id)}>
					<DeleteOutlineOutlinedIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
}

const ConfirmacionDelete = ({ resourceDel, eliminarRecurso, handleClick }) => {

	return (
		<Dialog
			open={resourceDel.open}
			onClose={handleClick}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"¿Estás seguro de eliminar este recurso?"}</DialogTitle>
			<DialogActions>
				<Button onClick={handleClick} color="primary">
					Cancelar
				</Button>
				<Button onClick={() => eliminarRecurso(resourceDel.resource)} color="secondary" autoFocus>
					Eliminar
				</Button>
			</DialogActions>
		</Dialog>
	);
};
