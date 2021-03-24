import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Button, Paper, Table } from '@material-ui/core';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';

export default function TablaUsuarios() {
	const token = localStorage.getItem('token');
	const [ maestros, setMaestros ] = useState([]);
	const [ loading, setLoading ] = useState(false);
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

	useEffect(
		() => {
			obtenerUsuariosBD();
		},
		[ obtenerUsuariosBD ]
	);

	return (
		<Box>
			<Box>
				<Spin loading={loading} />
				<MessageSnackbar
					open={snackbar.open}
					mensaje={snackbar.mensaje}
					status={snackbar.status}
					setSnackbar={setSnackbar}
				/>
				<TableContainer component={Paper}>
					<Table stickyHeader aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left" />
								<TableCell>Nombre</TableCell>
								<TableCell>Correo electrónico</TableCell>
								<TableCell>Telefono</TableCell>
								<TableCell>Tipo</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{maestros
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((instructor, index) => <TableInfoBody key={index} instructor={instructor} />)}
						</TableBody>
					</Table>
				</TableContainer>
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

const TableInfoBody = ({ instructor }) => {
	return (
		<TableRow>
			<TableCell align="left">
				<Avatar alt="imagen usuario" src={instructor.urlImage} />
			</TableCell>
			<TableCell>{instructor.name}</TableCell>
			<TableCell>{instructor.email}</TableCell>
			<TableCell>{instructor.phone ? instructor.phone : '-'}</TableCell>
			<TableCell>
                <Button>Maestro</Button>
            </TableCell>
		</TableRow>
	);
};
