import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, Typography, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import Scroll from '../../../../../../components/ScrolltoTop/scroll';
import { CursoContext } from '../../../../../../context/curso_context';

import AddIcon from '@material-ui/icons/Add';
import Spin from '../../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../../components/Snackbar/snackbar';
import Learnings from './learningns';
import Requirements from './requirements';
import WhoStudents from './whoStudents';
import clienteAxios from '../../../../../../config/axios';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper
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

export default function QueAprenderaEstudiante() {
	const classes = useStyles();
	const { datos, update, setUpdate } = useContext(CursoContext);
	const token = localStorage.getItem('token');
	const [ respuestaLearnings, setRespuestaLearnings ] = useState('');
	const [ respuestaRequirements, setRespuestaRequirements ] = useState('');
	const [ respuestaWhoStudents, setRespuestaWhoStudents ] = useState('');

	const [ datosLearnings, setDatosLearnings ] = useState([]);
	const [ datosRequirements, setDatosRequirements ] = useState([]);
	const [ datosWhoStudents, setDatosWhoStudents ] = useState([]);

	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const obtenerRespuesta = (e) => {
		switch (e.target.name) {
			case 'learnings':
				setRespuestaLearnings(e.target.value);
				break;
			case 'requirements':
				setRespuestaRequirements(e.target.value);
				break;
			case 'whoStudents':
				setRespuestaWhoStudents(e.target.value);
				break;
			default:
				break;
		}
	};

	const agregarRespuesta = (seccion) => {
		switch (seccion) {
			case 'learnings':
				if (!respuestaLearnings) {
					return;
				}
				setDatosLearnings([ ...datosLearnings, { learning: respuestaLearnings } ]);
				setRespuestaLearnings('');
				break;
			case 'requirements':
				if (!respuestaRequirements) {
					return;
				}
				setDatosRequirements([ ...datosRequirements, { requirement: respuestaRequirements } ]);
				setRespuestaRequirements('');
				break;
			case 'whoStudents':
				if (!respuestaWhoStudents) {
					return;
				}
				setDatosWhoStudents([ ...datosWhoStudents, { whoStudent: respuestaWhoStudents } ]);
				setRespuestaWhoStudents('');
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if(datos.learnings){
			setDatosLearnings(datos.learnings);
		}
		if(datos.requirements){
			setDatosRequirements(datos.requirements);
		}
		if(datos.whoStudents){
			setDatosWhoStudents(datos.whoStudents);
		}
	}, [ datos ])

	const eliminarRespuesta = (index, seccion) => {
		switch (seccion) {
			case 'learnings':
				datosLearnings.splice(index, 1);
				setDatosLearnings([ ...datosLearnings ]);
				break;
			case 'requirements':
				datosRequirements.splice(index, 1);
				setDatosRequirements([ ...datosRequirements ]);
				break;
			case 'whoStudents':
				datosWhoStudents.splice(index, 1);
				setDatosWhoStudents([ ...datosWhoStudents ]);
				break;
			default:
				break;
		}
	};

	const guardarDatosBD = async () => {
		if (datosLearnings.length === 0 && datosRequirements.length === 0 && datosWhoStudents.length === 0) {
			return;
		}
		const nuevoArrayDatos = {
			learnings: datosLearnings,
			requirements: datosRequirements,
			whoStudents: datosWhoStudents
		};
		setLoading(true);
		await clienteAxios
			.put(`/course/learnings/${datos._id}`, nuevoArrayDatos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setUpdate(!update);
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
					onClick={() => guardarDatosBD()}
				>
					<SaveIcon className={classes.margin} />
					Guardar
				</Button>
				<Scroll showBelow={250} />
			</div>

			<Box mb={2}>
				<Alert severity="info">
					Estas descripciones son importantes para que los estudiantes decidan si tu curso es para ellos
				</Alert>
			</Box>
			<Box>
				<Typography variant="h6">¿Qué aprenderan los estudiantes en tu curso?</Typography>
				<Learnings
					datos={datos}
					datosLearnings={datosLearnings}
					eliminarRespuesta={eliminarRespuesta}
					setDatosLearnings={setDatosLearnings}
				/>
				<TextField
					name="learnings"
					fullWidth
					placeholder="Ejemplo: Programacion web completa"
					variant="outlined"
					value={respuestaLearnings}
					onChange={obtenerRespuesta}
				/>
				<Box mt={2}>
					<Button startIcon={<AddIcon />} color="primary" onClick={() => agregarRespuesta('learnings')}>
						Agregar respuesta
					</Button>
				</Box>
			</Box>
			<Box>
				<Typography variant="h6">¿Se deben tener conocimientos previos para realizar tu curso?</Typography>
				<Box my={2}>
					<Requirements
						datosRequirements={datosRequirements}
						eliminarRespuesta={eliminarRespuesta}
						setDatosRequirements={setDatosRequirements}
					/>
					<TextField
						name="requirements"
						fullWidth
						placeholder="Ejemplo: HTML básico"
						variant="outlined"
						value={respuestaRequirements}
						onChange={obtenerRespuesta}
					/>
				</Box>
				<Box mt={2}>
					<Button startIcon={<AddIcon />} color="primary" onClick={() => agregarRespuesta('requirements')}>
						Agregar respuesta
					</Button>
				</Box>
			</Box>
			<Box>
				<Typography variant="h6">¿Quienes son tus estudiantes objetivo?</Typography>
				<Box my={2}>
					<WhoStudents
						datosWhoStudents={datosWhoStudents}
						eliminarRespuesta={eliminarRespuesta}
						setDatosWhoStudents={setDatosWhoStudents}
					/>
					<TextField
						name="whoStudents"
						fullWidth
						placeholder="Ejemplo: Desarrolladores de php"
						variant="outlined"
						value={respuestaWhoStudents}
						onChange={obtenerRespuesta}
					/>
					<Box mt={2}>
						<Button startIcon={<AddIcon />} color="primary" onClick={() => agregarRespuesta('whoStudents')}>
							Agregar respuesta
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
