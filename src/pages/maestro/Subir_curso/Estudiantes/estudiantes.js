import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Box, Paper, Avatar, Table } from '@material-ui/core';
import clienteAxios from '../../../../config/axios';
import { CursoContext } from '../../../../context/curso_context';
import Spin from '../../../../components/Spin/spin';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';
import ExportarExcel from './exportar_excel';

export default function EstudiantesCurso() {
	const token = localStorage.getItem('token');
	const [ estudiantes, setEstudiantes ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const { datos } = useContext(CursoContext);
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
		[ obtenerEstudiantesInscritos ]
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
			<TableContainer component={Paper}>
				<Table stickyHeader aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" />
							<TableCell>Nombre</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Telefono</TableCell>
                            <TableCell>Nivel de estudios</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{estudiantes
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((alumno, index) => <TableInfoBody key={index} alumno={alumno} />)}
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
				labelDisplayedRows={({ from, to, count }) => `${from} de ${count !== -1 ? count : to}`}
			/>
		</Box>
	);
}

const TableInfoBody = ({ alumno }) => {
	const user = alumno.idUser;

	return (
		<TableRow>
			<TableCell align="left">
				<Avatar alt="imagen usuario" src={user.urlImage} />
			</TableCell>
			<TableCell>{user.name}</TableCell>
			<TableCell>{user.email}</TableCell>
			<TableCell>{user.phone ? user.phone : '-'}</TableCell>
            <TableCell>{user.scholarship ? user.scholarship : '-'}</TableCell>
		</TableRow>
	);
};
