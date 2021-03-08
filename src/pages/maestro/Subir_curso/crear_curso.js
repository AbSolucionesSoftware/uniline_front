import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
	Box,
	Container,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Fab
} from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import { Link } from 'react-router-dom';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Sesion from '../../../components/Verificacion_sesion/verificacion_sesion';
import clienteAxios from '../../../config/axios';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	button: {
		marginRight: theme.spacing(1)
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	},
	content: {
		height: '60vh',
		[theme.breakpoints.down('xs')]: {
			height: '70vh'
		}
	},
	floatButton: {
		position: 'absolute',
		bottom: theme.spacing(3),
		right: theme.spacing(3)
	}
}));

const FormStyles = makeStyles((theme) => ({
	input: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '50%',
			[theme.breakpoints.down('xs')]: {
				width: '100%'
			}
		}
	},
	formControl: {
		margin: theme.spacing(1),
		width: '50%',
		[theme.breakpoints.down('xs')]: {
			width: '100%'
		}
	}
}));

export default function SubirCursoMaestro(props) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const [ activeStep, setActiveStep ] = React.useState(0);
	const steps = getSteps();
	const [ validate, setValidate ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ datos, setDatos ] = useState({
		title: '',
		slug: '',
		category: '',
		subCategory: '',
		idProfessor: JSON.parse(localStorage.getItem('student'))._id
	});
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ categories, setCategories ] = useState([ { categorie: '', subCategories: [ { subcategorie: '' } ] } ]);

	useEffect(
		() => {
			Sesion(props);
		},
		[ props ]
	);

	const handleNext = () => {
		if (!datos.title) {
			setValidate(true);
			return;
		}
		setValidate(false);
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const obtenerCampos = (e) => {
		setValidate(false);
		if (e.target.name === 'slug') {
			setDatos({
				...datos,
				slug: e.target.value.replace(' ', '-').toLowerCase()
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

	const crearCurso = async () => {
		if (!datos.category || !datos.subCategory) {
			setValidate(true);
			setSnackbar({
				open: true,
				mensaje: 'Hubo un error al crear curso',
				status: 'error'
			});
			return;
		}
		setLoading(true);
		await clienteAxios
			.post('/course/', datos, {
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
				setValidate(false);
				props.history.push(`/instructor/contenido_curso/${res.data.userStored._id}/general`);
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

	function getSteps() {
		return [ 'Titulo', 'Categoria' ];
	}

	function getStepContent(step) {
		const classes = FormStyles();
		switch (step) {
			case 0:
				return (
					<Box py={10}>
						<Typography variant="h4" align="center">
							Escribe un titulo para tu curso
						</Typography>
						<Typography variant="subtitle1" align="center">
							Este titulo no es definitivo, lo puedes editar mas tarde.
						</Typography>
						<Typography variant="overline" align="center">
							<b>*Nota:</b> Los slug son palabras clave que se utilizaran en las URL del sitio para resumir el contenido de una página.
						</Typography>
						<Box my={5}>
							<Container maxWidth="sm">
								<TextField
									error={validate && !datos.title ? true : false}
									defaultValue={datos.title}
									name="title"
									label="Titulo curso"
									helperText="Este campo es obligatorio"
									onChange={obtenerCampos}
									fullWidth
								/>
								<TextField
									error={validate && !datos.slug ? true : false}
									value={datos.slug}
									name="slug"
									label="Slug"
									placeholder="Ejemplo: Excel-basico-avanzado"
									helperText="Este campo es obligatorio"
									onChange={obtenerCampos}
									fullWidth
								/>
							</Container>
						</Box>
					</Box>
				);
			case 1:
				return (
					<Box py={10}>
						<Typography variant="h4" align="center">
							Selecciona una categoria y subcategoria
						</Typography>
						<Typography variant="subtitle1" align="center">
							Al igual que el titulo, esto lo puedes editar mas tarde.
						</Typography>
						<Box my={5}>
							<Box display="flex" justifyContent="center">
								<FormControl
									className={classes.formControl}
									error={validate && !datos.category ? true : false}
								>
									<InputLabel id="categoria-select-label">Categoria</InputLabel>
									<Select
										name="category"
										labelId="categoria-select-label"
										id="categoria-select"
										value={!datos.category ? '' : datos.category}
										onChange={obtenerCampos}
									>
										{categories.map((res) => {
											return (
												<MenuItem key={res.categorie} value={res.categorie}>
													{res.categorie}
												</MenuItem>
											);
										})}
									</Select>
									{validate ? <FormHelperText>Campo obligatorio</FormHelperText> : null}
								</FormControl>
							</Box>
							<Box display="flex" justifyContent="center">
								<FormControl
									className={classes.formControl}
									error={validate && !datos.subCategory ? true : false}
								>
									<InputLabel id="subcategoria-select-label">Subcategoria</InputLabel>
									<Select
										name="subCategory"
										labelId="subcategoria-select-label"
										id="subcategoria-select"
										value={!datos.subCategory ? '' : datos.subCategory}
										onChange={obtenerCampos}
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
												return (
													<MenuItem key="otros" value="Otro">
														<em>Otro</em>
													</MenuItem>
												);
											})
										) : (
											<MenuItem value="">
												<em>Selecciona una categoria</em>
											</MenuItem>
										)}
									</Select>
									{validate ? <FormHelperText>Campo obligatorio</FormHelperText> : null}
								</FormControl>
							</Box>
						</Box>
					</Box>
				);
			default:
				return 'Unknown step';
		}
	}

	return (
		<div>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<div className={classes.floatButton}>
				<Fab variant="extended" color="primary" aria-label="add" component={Link} to="/instructor/cursos">
					<UndoIcon />Dashboard
				</Fab>
			</div>
			<Container maxWidth="md">
				<div className={classes.root}>
					<Container maxWidth="xs">
						<Stepper activeStep={activeStep}>
							{steps.map((label, index) => {
								const stepProps = {};
								const labelProps = {};
								return (
									<Step key={label} {...stepProps}>
										<StepLabel {...labelProps}>{label}</StepLabel>
									</Step>
								);
							})}
						</Stepper>
					</Container>
					<div>
						<div>
							<div className={classes.content}>{getStepContent(activeStep)}</div>
							<Box display="flex" justifyContent="center">
								<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
									Regresar
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={activeStep === steps.length - 1 ? crearCurso : handleNext}
									className={classes.button}
								>
									{activeStep === steps.length - 1 ? 'Crear curso' : 'Siguiente'}
								</Button>
							</Box>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
