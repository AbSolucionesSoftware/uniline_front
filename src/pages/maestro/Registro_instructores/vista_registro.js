import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	Grid,
	IconButton,
	makeStyles,
	Paper,
	Table
} from '@material-ui/core';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';
import ExportarExcelMaestros from './exportar_excel';
import RegistrarInstructor from './modal_registro_instructor';

const useStyles = makeStyles((theme) => ({
	table: {
		[theme.breakpoints.only('xs')]: {
			display: 'block',
			width: 320,
			overflowX: 'auto'
		}
	}
}));

export default function VistaRegistroInstructores(props) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const [ maestros, setMaestros ] = useState([]);
	const [ usuarios, setUsuarios ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ reload, setReload ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	let user = { _id: '', name: '', imagen: '' };
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	if(!token || !user || user.admin !== true) props.history.push('/instructor/cursos');

	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const obtenerInstructoresBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/user/action/teacher/`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setMaestros(res.data);
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
		[ token ]
	);

	const obtenerUsuariosBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/user`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setUsuarios(res.data);
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
		[ token ]
	);

	useEffect(
		() => {
			obtenerInstructoresBD();
			obtenerUsuariosBD();
		},
		[ obtenerInstructoresBD, obtenerUsuariosBD, reload ]
	);

	return (
		<Box>
			<Box display="flex" justifyContent="flex-end" my={2}>
				<Grid container spacing={1} justify="flex-end">
					<Grid item>
						<ExportarExcelMaestros maestros={maestros} />
					</Grid>
					<Grid item>
						<RegistrarInstructor usuarios={usuarios} reload={reload} setReload={setReload} />
					</Grid>
				</Grid>
			</Box>
			<Box>
				<Spin loading={loading} />
				<MessageSnackbar
					open={snackbar.open}
					mensaje={snackbar.mensaje}
					status={snackbar.status}
					setSnackbar={setSnackbar}
				/>
				<Box className={classes.table}>
					<TableContainer component={Paper}>
						<Table stickyHeader aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="left" />
									<TableCell>Nombre</TableCell>
									<TableCell>Correo electrónico</TableCell>
									<TableCell>Telefono</TableCell>
									<TableCell align="right">Cursos impartidos</TableCell>
									<TableCell align="right">Eliminar</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{maestros
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((instructor, index) => (
										<TableInfoBody
											key={index}
											instructor={instructor}
											reload={reload}
											setReload={setReload}
											setLoading={setLoading}
											setSnackbar={setSnackbar}
										/>
									))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={maestros.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => `${from} de ${count !== -1 ? count : to}`}
				/>
			</Box>
		</Box>
	);
}

const TableInfoBody = ({ instructor, reload, setReload, setLoading, setSnackbar }) => {
	const teacher = instructor.teacher;
	const token = localStorage.getItem('token');
	const [ open, setOpen ] = useState(false);

	const handleClickModal = () => setOpen(!open);

	const eliminarMaestro = async (instructor) => {
		setLoading(true);
		await clienteAxios
			.put(
				`/user/${instructor}/teacher`,
				{
					type: 'Estudiante'
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setReload(!reload);
				setSnackbar({
					open: true,
					mensaje: 'Cambio realizado',
					status: 'success'
				});
				handleClickModal();
			})
			.catch((err) => {
				setLoading(false);
				handleClickModal();
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
			<TableRow>
				<TableCell align="left">
					<Avatar alt="imagen usuario" src={teacher.urlImage} />
				</TableCell>
				<TableCell>{teacher.name}</TableCell>
				<TableCell>{teacher.email}</TableCell>
				<TableCell>{teacher.phone ? teacher.phone : '-'}</TableCell>
				<TableCell align="center">{instructor.courses}</TableCell>
				<TableCell align="right">
					<IconButton aria-label="delete" onClick={() => handleClickModal()}>
						<DeleteIcon color="error" />
					</IconButton>
				</TableCell>
			</TableRow>
			<Dialog
				open={open}
				onClose={handleClickModal}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{`¿Deseas quitar este instructor?`}</DialogTitle>
				<DialogActions>
					<Button onClick={handleClickModal} color="primary">
						No, cancelar
					</Button>
					<Button onClick={() => eliminarMaestro(teacher._id)} color="primary" autoFocus>
						Si, aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
