import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, makeStyles } from '@material-ui/core';
import { Box, Paper, Avatar, Table } from '@material-ui/core';
import clienteAxios from '../../../../config/axios';
import { CursoContext } from '../../../../context/curso_context';
import Spin from '../../../../components/Spin/spin';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';
import ExportarExcel from './exportar_excel';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
	table: {
		[theme.breakpoints.only('xs')]: {
			display: 'block',
			width: 370,
			overflowX: 'auto'
		}
	}
}));

export default function EstudiantesCurso() {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const [ estudiantes, setEstudiantes ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const { datos } = useContext(CursoContext);
	const [ reload, setReload ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const obtenerEstudiantesInscritos = useCallback(
		async () => {
			if (!datos._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/course/dashboard/teacher/${datos._id}/users`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setEstudiantes(res.data);
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
		[ datos._id, token ]
	);

	useEffect(
		() => {
			obtenerEstudiantesInscritos();
		},
		[ obtenerEstudiantesInscritos, reload ]
	);

	return (
		<Box>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box display="flex" justifyContent="flex-end" my={2}>
				<ExportarExcel estudiantes={estudiantes} />
			</Box>
			<TableContainer component={Paper} className={classes.table}>
				<Table stickyHeader aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" />
							<TableCell>Nombre</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Telefono</TableCell>
							<TableCell>Tipo de acceso</TableCell>
							<TableCell>Nivel de estudios</TableCell>
							<TableCell align="right">Eliminar</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{estudiantes
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((alumno, index) => (
								<TableInfoBody
									key={index}
									alumno={alumno}
									setLoading={setLoading}
									setSnackbar={setSnackbar}
									reload={reload}
									setReload={setReload}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={estudiantes.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				labelDisplayedRows={({ from, to, count }) => `${to} de ${count !== -1 ? count : to}`}
			/>
		</Box>
	);
}

const TableInfoBody = ({ alumno, setLoading, setSnackbar, reload, setReload }) => {
	const token = localStorage.getItem('token');
	const user = alumno.idUser;
	const [ open, setOpen ] = useState(false);

	const handleClickModal = () => setOpen(!open);

	const eliminarEstudiante = async (user) => {
		setLoading(true);
		await clienteAxios
			.delete(`/user/inscription/remove/${user}`, {
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
				setReload(!reload);
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
					<Avatar alt="imagen usuario" src={user.urlImage} />
				</TableCell>
				<TableCell>{user.name}</TableCell>
				<TableCell>{user.email}</TableCell>
				<TableCell>{user.phone ? user.phone : '-'}</TableCell>
				<TableCell>
					{alumno.code ? `Cupon - ${alumno.codeKey}` : alumno.freeCourse ? 'Gratis' : 'Comprado'}
				</TableCell>
				<TableCell>{user.scholarship ? user.scholarship : '-'}</TableCell>
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
				<DialogTitle id="alert-dialog-title">{`¿Deseas dar de baja a este estudiante?`}</DialogTitle>
				<DialogActions>
					<Button onClick={handleClickModal} color="primary">
						No, cancelar
					</Button>
					<Button onClick={() => eliminarEstudiante(alumno._id)} color="primary" autoFocus>
						Si, aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
