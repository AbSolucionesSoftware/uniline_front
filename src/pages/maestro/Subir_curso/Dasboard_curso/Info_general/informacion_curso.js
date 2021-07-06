import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Grid, Select, TextField, Divider, Typography, Button, InputAdornment } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import Scroll from '../../../../../components/ScrolltoTop/scroll';
import Spin from '../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import SubirVideo from './subir_video';
import { CursoContext } from '../../../../../context/curso_context';
import SubirImagen from './subir_imagen';
import clienteAxios from '../../../../../config/axios';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper
	},
	select: {
		width: '100%',
		margin: '8px 0'
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
	editor: {
		width: '100%',
		[theme.breakpoints.down('xs')]: {
			width: 320
		}
	}
}));

export default function RegistroInformacionCurso() {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { datos, setDatos, update, setUpdate } = useContext(CursoContext);
	const [ validacion, setValidacion ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ categories, setCategories ] = useState([ { categorie: '', subCategories: [ { subcategorie: '' } ] } ]);

	const obtenerEditor = (e) => {
		setValidacion(false);
		setDatos({
			...datos,
			description: e
		});
	};
	const obtenerStartMessage = (e) => {
		setValidacion(false);
		setDatos({
			...datos,
			startMessage: e
		});
	};
	const obtenerFinalMessage = (e) => {
		setValidacion(false);
		setDatos({
			...datos,
			finalMessage: e
		});
	};

	const obtenerCampos = (e) => {
		setValidacion(false);
		if (e.target.name === 'category') {
			setDatos({
				...datos,
				category: e.target.value,
				subCategory: ''
			});
			return;
		}
		if (e.target.name === 'slug') {
			setDatos({
				...datos,
				slug: e.target.value.replace(' ', '-')
			});
			return;
		}
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const obtenerCategorias = async () => {
		await clienteAxios
			.get('/categories/')
			.then((res) => {
				setCategories(res.data);
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

	const guardarDatos = async () => {
		if (
			!datos.title ||
			!datos.subtitle ||
			!datos.slug ||
			!datos.description ||
			!datos.language ||
			!datos.category ||
			!datos.subCategory ||
			!datos.level ||
			!datos.hours ||
			!datos.startMessage ||
			!datos.finalMessage
		) {
			setValidacion(true);
			setSnackbar({
				open: true,
				mensaje: 'Complete todos los campos requeridos',
				status: 'error'
			});
			return;
		}

		setLoading(true);
		await clienteAxios
			.put(
				`/course/${datos._id}`,
				{
					title: datos.title,
					subtitle: datos.subtitle,
					slug: datos.slug,
					description: datos.description,
					language: datos.language,
					category: datos.category,
					subCategory: datos.subCategory,
					level: datos.level,
					hours: datos.hours,
					startMessage: datos.startMessage,
					finalMessage: datos.finalMessage
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setValidacion(false);
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

	useEffect(() => {
		obtenerCategorias();
	}, []);

	return (
		<Box p={5} boxShadow={5} className={classes.color}>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
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
						value={datos.title ? datos.title : ''}
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
						value={datos.subtitle ? datos.subtitle : ''}
						variant="outlined"
						error={validacion && !datos.subtitle ? true : false}
						helperText={validacion && !datos.subtitle ? 'Campo requerido' : ''}
						onChange={obtenerCampos}
					/>
				</Box>
				<Box my={2}>
					<Grid container spacing={2}>
						<Grid item lg={3} md={4} xs={12}>
							<TextField
								fullWidth
								required
								type="number"
								name="hours"
								id="horas-curso"
								label="Horas del curso"
								value={datos.hours ? datos.hours : ''}
								variant="outlined"
								error={validacion && !datos.hours ? true : false}
								helperText={validacion && !datos.hours ? 'Campo requerido' : ''}
								onChange={obtenerCampos}
								InputProps={{
									endAdornment: <InputAdornment position="start">Hrs.</InputAdornment>
								}}
							/>
						</Grid>
						<Grid item lg={9} md={8} xs={12}>
							<TextField
								fullWidth
								required
								name="slug"
								id="slug-curso"
								placeholder="Ejemplo: curso-html-javascrip"
								label="Slug"
								value={datos.slug ? datos.slug : ''}
								variant="outlined"
								error={validacion && !datos.slug ? true : false}
								helperText={validacion && !datos.slug ? 'Campo requerido' : ''}
								onChange={obtenerCampos}
							/>
						</Grid>
					</Grid>
				</Box>
				<Box my={2}>
					<Typography variant="subtitle1">Descripción</Typography>
					<FormControl
						variant="outlined"
						className={classes.editor}
						error={validacion && !datos.description ? true : false}
					>
						<Editor
							name="description"
							init={{
								height: 350,
								menubar: true,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount'
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
							}}
							onEditorChange={obtenerEditor}
							value={datos.description ? datos.description : ''}
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
								error={validacion && !datos.language ? true : false}
							>
								<InputLabel id="label-lenguaje">Lenguaje</InputLabel>
								<Select
									labelId="label-lenguaje"
									id="lenguaje"
									name="language"
									value={datos.language ? datos.language : ''}
									onChange={obtenerCampos}
									renderValue={(value) => value}
									label="Lenguaje"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value="Español">Español</MenuItem>
									<MenuItem value="Ingles">Ingles</MenuItem>
								</Select>
								{validacion && !datos.language ? (
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
									renderValue={(value) => value}
									label="Nivel"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value="básico">Básico</MenuItem>
									<MenuItem value="Intermedio">Intermedio</MenuItem>
									<MenuItem value="Avanzado">Avanzado</MenuItem>
									<MenuItem value="Básico-Intermedio-Avanzado">Básico-Intermedio-Avanzado</MenuItem>
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
									label="categoria"
									renderValue={(value) => value}
								>
									{categories.map((res, index) => {
										return (
											<MenuItem key={index} value={res.categorie}>
												{res.categorie}
											</MenuItem>
										);
									})}
									<MenuItem value="Otro">
										<em>Otro</em>
									</MenuItem>
								</Select>
								{validacion && !datos.category ? (
									<FormHelperText>campo requerido</FormHelperText>
								) : null}
							</FormControl>
							<FormControl
								variant="outlined"
								className={classes.select}
								error={validacion && !datos.subCategory ? true : false}
							>
								<InputLabel id="label-subcategoria">Subcategoria</InputLabel>
								<Select
									labelId="label-subcategoria"
									id="subcategoria"
									name="subCategory"
									value={datos.subCategory ? datos.subCategory : ''}
									onChange={obtenerCampos}
									renderValue={(value) => value}
									label="Subcategoria"
								>
									{datos.category ? (
										categories.map((categorias) => {
											if (datos.category === categorias.categorie) {
												return categorias.subCategories.map((subCategorias) => {
													return (
														<MenuItem
															key={subCategorias._id}
															value={subCategorias.subCategorie}
														>
															{subCategorias.subCategorie}
														</MenuItem>
													);
												});
											}
											return null;
										})
									) : (
										<MenuItem value="">
											<em>Selecciona una categoria</em>
										</MenuItem>
									)}
								</Select>
								{validacion && !datos.subCategory ? (
									<FormHelperText>campo requerido</FormHelperText>
								) : null}
							</FormControl>
						</Grid>
					</Grid>
				</Box>
				<Box my={2}>
					<Typography variant="subtitle1">Mensaje inicial del curso</Typography>
					<FormControl
						variant="outlined"
						className={classes.editor}
						error={validacion && !datos.startMessage ? true : false}
					>
						<Editor
							name="startMessage"
							init={{
								height: 300,
								menubar: true,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount'
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
							}}
							onEditorChange={obtenerStartMessage}
							value={datos.startMessage ? datos.startMessage : ''}
						/>
						{validacion && !datos.startMessage ? <FormHelperText>campo requerido</FormHelperText> : null}
					</FormControl>
				</Box>
				<Box my={2}>
					<Typography variant="subtitle1">Mensaje final del curso</Typography>
					<FormControl
						variant="outlined"
						className={classes.editor}
						error={validacion && !datos.finalMessage ? true : false}
					>
						<Editor
							name="finalMessage"
							init={{
								height: 300,
								menubar: true,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount'
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
							}}
							onEditorChange={obtenerFinalMessage}
							value={datos.finalMessage ? datos.finalMessage : ''}
						/>
						{validacion && !datos.finalMessage ? <FormHelperText>campo requerido</FormHelperText> : null}
					</FormControl>
				</Box>
				<Divider />
				<Typography variant="h6">Imagen promocional del curso</Typography>
				<Box my={2}>
					<SubirImagen />
				</Box>
				<Divider />
				<Typography variant="h6">Video promocional del curso</Typography>
				<Box my={2}>
					<SubirVideo />
				</Box>
			</form>
		</Box>
	);
}
