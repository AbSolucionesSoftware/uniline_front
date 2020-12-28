import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, Divider, Typography, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import Scroll from '../../../../components/ScrolltoTop/scroll';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Spin from '../../../../components/Spin/spin';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';

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
	},
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		marginBottom: 16
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
}));

export default function QueAprenderaEstudiante() {
	const classes = useStyles();
	const [ respuestaLearnings, setRespuestaLearnings ] = useState('');
	const [ respuestaRequeriments, setRespuestaRequeriments ] = useState('');
	const [ respuestaWhoStudents, setRespuestaWhoStudents ] = useState('');

	const [ datosLearnings, setDatosLearnings ] = useState([]);
	const [ datosRequeriments, setDatosRequeriments ] = useState([]);
    const [ datosWhoStudents, setDatosWhoStudents ] = useState([]);
    
    const [ loading, setLoading ] = useState(false);
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        mensaje: '',
        status: ''
    })

	const obtenerRespuesta = (e) => {
		switch (e.target.name) {
			case 'learnings':
				setRespuestaLearnings(e.target.value);
				break;
			case 'requeriments':
				setRespuestaRequeriments(e.target.value);
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
			case 'requeriments':
				if (!respuestaRequeriments) {
					return;
				}
				setDatosRequeriments([ ...datosRequeriments, { requeriment: respuestaRequeriments } ]);
				setRespuestaRequeriments('');
				break;
			case 'whoStudents':
				if (!respuestaWhoStudents) {
					return;
				}
				setDatosWhoStudents([ ...datosWhoStudents, { whoStudents: respuestaWhoStudents } ]);
				setRespuestaWhoStudents('');
				break;
			default:
				break;
		}
	};

	const eliminarRespuesta = (index, seccion) => {
		switch (seccion) {
			case 'learnings':
				datosLearnings.splice(index, 1);
				setDatosLearnings([ ...datosLearnings ]);
				break;
			case 'requeriments':
				datosRequeriments.splice(index, 1);
				setDatosRequeriments([ ...datosRequeriments ]);
				break;
			case 'whoStudents':
				datosWhoStudents.splice(index, 1);
				setDatosWhoStudents([ ...datosWhoStudents ]);
				break;
			default:
				break;
		}
	};

	const guardarDatosBD = () => {
        if(datosLearnings.length === 0 && datosRequeriments.length === 0  && datosWhoStudents.length === 0 ){
            return;
        }
        const datos = { learnigs: datosLearnings, requeriments: datosRequeriments, whoStudents: datosWhoStudents }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSnackbar({
                open: true,
                mensaje: "Guardado correctamente",
                status: 'success'
            })
        }, 3000);
        console.log(datos)
	};

	const respuestas_learnings = datosLearnings.map((res, index) => {
		return (
			<Paper key={index} className={classes.root}>
				<InputBase className={classes.input} value={res.learning} inputProps={{ readOnly: true }} />
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton
					className={classes.iconButton}
					aria-label="directions"
					onClick={() => eliminarRespuesta(index, 'learnings')}
				>
					<DeleteIcon />
				</IconButton>
			</Paper>
		);
	});
	const respuestas_requeriments = datosRequeriments.map((res, index) => {
		return (
			<Paper key={index} className={classes.root}>
				<InputBase className={classes.input} value={res.requeriment} inputProps={{ readOnly: true }} />
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton
					className={classes.iconButton}
					aria-label="directions"
					onClick={() => eliminarRespuesta(index, 'requeriments')}
				>
					<DeleteIcon />
				</IconButton>
			</Paper>
		);
	});
	const respuestas_whoStudents = datosWhoStudents.map((res, index) => {
		return (
			<Paper key={index} className={classes.root}>
				<InputBase className={classes.input} value={res.whoStudents} inputProps={{ readOnly: true }} />
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton
					className={classes.iconButton}
					aria-label="directions"
					onClick={() => eliminarRespuesta(index, 'whoStudents')}
				>
					<DeleteIcon />
				</IconButton>
			</Paper>
		);
	});

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
				<Box my={2}>
					{respuestas_learnings}
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
			</Box>
			<Box>
				<Typography variant="h6">¿Se deben tener conocimientos previos para realizar tu curso?</Typography>
				<Box my={2}>
					{respuestas_requeriments}
					<TextField
						name="requeriments"
						fullWidth
						placeholder="Ejemplo: HTML básico"
						variant="outlined"
						value={respuestaRequeriments}
						onChange={obtenerRespuesta}
					/>
				</Box>
				<Box mt={2}>
					<Button startIcon={<AddIcon />} color="primary" onClick={() => agregarRespuesta('requeriments')}>
						Agregar respuesta
					</Button>
				</Box>
			</Box>
			<Box>
				<Typography variant="h6">¿Quienes son tus estudiantes objetivo?</Typography>
				<Box my={2}>
					{respuestas_whoStudents}
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