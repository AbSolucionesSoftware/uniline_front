import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Button, Grid, Box, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CursosProfesor from './cursos';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Scroll from '../../../components/ScrolltoTop/scroll';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Spin from '../../../components/Spin/spin';

const useStyles = makeStyles((theme) => ({
	flex: {
		width: '100%',
		height: '50vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconflex: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		fontSize: 60,
		marginRight: 10,
		color: '#6666'
	},
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		[theme.breakpoints.down('md')]: {
			marginBottom: 10
		}
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

export default function DashboardMaestro(props) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const [ datos, setDatos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ update, setUpdate ] = useState(false);
	const [ value, setValue ] = useState('');
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCursosBD = useCallback(
		async () => {
			if (!user._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/course/teacher/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setDatos(res.data);
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
		[ token, user._id ]
	);

	const capturarBusqueda = (valor) => setValue(valor);
	const obtenerBusquedas = async (e) => {
		e.preventDefault();
		if(value === '') {
			obtenerCursosBD();
			return;
		}
		setLoading(true);
		await clienteAxios
			.get(`/course/teacher/${user._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setDatos(res.data);
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
			obtenerCursosBD();
		},
		[ obtenerCursosBD, update ]
	);

	const render_cursos = datos.map((curso, index) => (
		<CursosProfesor key={index} datos={curso} update={update} setUpdate={setUpdate} />
	));

	if (!datos) {
		return (
			<div className={classes.flex}>
				<Box>
					<div className={classes.iconflex}>
						<CloudUploadIcon className={classes.icon} />
					</div>
					<Typography style={{ color: '#666666' }} variant="h5">
						Aun no tienes cursos registrados, ¡Comienza ahora!
					</Typography>
				</Box>
			</div>
		);
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
			<Scroll showBelow={250} />
			<Grid container>
				<Grid item xs={12} md={5}>
					<Paper component="form" onSubmit={obtenerBusquedas} className={classes.root}>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
						<Divider className={classes.divider} orientation="vertical" />
						<InputBase
							className={classes.input}
							placeholder="Buscar tus cursos"
							onChange={(e) => capturarBusqueda(e.target.value)}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={7}>
					<Box display="flex" justifyContent="flex-end">
						<Button
							size="large"
							variant="contained"
							color="primary"
							startIcon={<AddCircleIcon />}
							component={Link}
							to="/instructor/nuevo_curso"
						>
							Nuevo curso
						</Button>
					</Box>
				</Grid>
				{render_cursos}
			</Grid>
		</div>
	);
}
