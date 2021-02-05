import React, { useState, useContext, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Scroll from '../../../../../components/ScrolltoTop/scroll';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Bloques from './bloques';
import clienteAxios from '../../../../../config/axios';
import { CursoContext } from '../../../../../context/curso_context';
import Spin from '../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper,
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1)
		}
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
	contenedor: {
		padding: theme.spacing(5),
		[theme.breakpoints.down('xs')]: {
			padding: theme.spacing(1)
		}
	}
}));

export default function RegistroContenido() {
	const classes = useStyles();
	const { datos, update } = useContext(CursoContext);
	const token = localStorage.getItem('token');
	const [ bloques, setBloques ] = useState([]);
	const [ open, setOpen ] = React.useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleClickOpen = () => {
		setOpen(!open);
	};

	const obtenerBloquesBD = useCallback(
		async () => {
			setLoading(true);
			if (!datos._id) return;
			await clienteAxios
				.get(`/course/data/${datos._id}`)
				.then((res) => {
					setLoading(false);
					setBloques(res.data);
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
		},
		[ datos._id ]
	);

	const guardarOrdenBD = async () => {
		console.log(bloques);
		setLoading(true);
		await clienteAxios
			.put(`/course/content/order/`, bloques, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setLoading(false);
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
			obtenerBloquesBD();
		},
		[ update, obtenerBloquesBD ]
	);

	return (
		<Box boxShadow={5} className={classes.color} minHeight="80vh">
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
					onClick={() => guardarOrdenBD()}
				>
					<SaveIcon className={classes.margin} />
					Guardar Orden
				</Button>
				<Scroll showBelow={250} />
			</div>
			<Box p={1}>
				<Alert severity="info">
					<Typography>
						En este apartado podrás subir el contenido de tu curso, como bloques, temas, tareas y más.
					</Typography>
					<br />
					<Typography variant="subtitle2">
						Recuerda que cada cambio que realizes debes guardarlo en ese momento
					</Typography>
				</Alert>
			</Box>
			<Box className={classes.contenedor}>
				<Box>
					<Button
						startIcon={<AddIcon style={{ fontSize: 30 }} />}
						variant="text"
						color="primary"
						className="addButton"
						onClick={handleClickOpen}
					>
						Nuevo bloque
					</Button>
				</Box>
				<Bloques bloques={bloques} setBloques={setBloques} setOpen={setOpen} open={open} />
			</Box>
		</Box>
	);
}
