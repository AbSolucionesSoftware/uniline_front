import React, { Fragment, useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import { CursoContext } from '../../../../../context/curso_context';
import { useDropzone } from 'react-dropzone';
import clienteAxios from '../../../../../config/axios';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	dropZone: {
		border: 'dashed 2px',
		borderColor: '#aaaaaa'
	}
}));

export default function SubirImagen() {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { datos, setDatos, update, setUpdate, preview, setPreview } = useContext(CursoContext);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const onDrop = useCallback(
		(files) => {
			setPreview(URL.createObjectURL(files[0]));
			setDatos({
				...datos,
				urlPromotionalImage: files[0]
			});
		},
		[ datos, setDatos, setPreview ]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const subirImagen = async () => {
		if (!datos.urlPromotionalImage || !preview) {
			return;
		} else if (preview && preview.includes('https')) {
			return;
		}
		const formData = new FormData();
		formData.append('imagen', datos.urlPromotionalImage);
		setLoading(true);
		await clienteAxios
			.put(`/course/imagen/${datos._id}`, formData, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setLoading(false);
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

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Grid container direction="row" spacing={1}>
				<Grid item lg={6} sm={12}>
					<Box
						className={classes.dropZone}
						{...getRootProps()}
						height={300}
						display="flex"
						justifyContent="center"
						alignItems="center"
						textAlign="center"
					>
						<input {...getInputProps()} />
						{datos.urlPromotionalImage || preview ? (
							<Box height={300} display="flex" justifyContent="center" alignItems="center">
								<img alt="imagen del curso" src={preview} className={classes.imagen} />
							</Box>
						) : isDragActive ? (
							<Typography>Suelta tu imagen aquí...</Typography>
						) : (
							<Typography>
								Arrastra y suelta tu imagen aquí, o selecciona una imagen haciendo click aquí
							</Typography>
						)}
					</Box>
				</Grid>
				<Grid item lg={6}>
					<Box my={2}>
						<Alert severity="info">
							<Typography variant="body1">
								Carga la imagen de tu curso aquí. Para ser aceptada, debe cumplir nuestros estándares de
								calidad para las imágenes de los cursos. Directrices importantes: 750 x 422 píxeles;
								formato .jpg, .jpeg, .gif, o .png.; y sin texto en la imagen.
							</Typography>
						</Alert>
					</Box>
					<Box my={2}>{loading ? <LinearProgress /> : null}</Box>
					<Button color="primary" variant="contained" size="large" onClick={() => subirImagen()}>
						Subir imagen
					</Button>
				</Grid>
			</Grid>
		</Fragment>
	);
}
