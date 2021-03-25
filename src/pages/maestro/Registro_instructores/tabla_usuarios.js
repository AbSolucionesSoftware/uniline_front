import React, { Fragment, useState } from 'react';
import { Dialog, DialogActions, DialogTitle, makeStyles } from '@material-ui/core';
import { Avatar, Box, Button, Paper, Table } from '@material-ui/core';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import Spin from '../../../components/Spin/spin';
import clienteAxios from '../../../config/axios';
import MessageSnackbar from '../../../components/Snackbar/snackbar';

const useStyles = makeStyles((theme) => ({
	table: {
		[theme.breakpoints.only('xs')]: {
			display: 'block',
			width: 340,
			overflowX: 'auto'
		}
	}
}));

export default function TablaUsuarios({ usuarios, reload, setReload, handleClickOpenRegistro }) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Box>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box>
				<TableContainer component={Paper} className={classes.table}>
					<Table stickyHeader aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left" />
								<TableCell>Nombre</TableCell>
								<TableCell>Correo electrónico</TableCell>
								<TableCell>Telefono</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{usuarios
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((instructor, index) => (
									<TableInfoBody
										key={index}
										instructor={instructor}
										reload={reload}
										setReload={setReload}
										setSnackbar={setSnackbar}
										setLoading={setLoading}
										handleClickOpenRegistro={handleClickOpenRegistro}
									/>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={usuarios.length}
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

const TableInfoBody = ({ instructor, reload, setReload, setSnackbar, setLoading, handleClickOpenRegistro }) => {
	const token = localStorage.getItem('token');
	const [ open, setOpen ] = useState(false);

	const handleClickModal = (e) => setOpen(!open);

	const cambiarMaestro = async () => {
		setLoading(true);
		setOpen(!open);
		await clienteAxios
			.put(
				`/user/${instructor._id}/teacher`,
				{
					type: 'Maestro'
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
				handleClickOpenRegistro();
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
		<Fragment>
			<TableRow>
				<TableCell align="left">
					<Avatar alt="imagen usuario" src={instructor.urlImage} />
				</TableCell>
				<TableCell>{instructor.name}</TableCell>
				<TableCell>{instructor.email}</TableCell>
				<TableCell>{instructor.phone ? instructor.phone : '-'}</TableCell>
				<TableCell>
					<Button size="small" variant="contained" color="primary" onClick={handleClickModal}>
						Hacer instructor
					</Button>
				</TableCell>
			</TableRow>
			<Dialog
				open={open}
				onClose={handleClickModal}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{`¿Deseas hacer "instructor" a este usuario?`}</DialogTitle>
				<DialogActions>
					<Button onClick={handleClickModal} color="primary">
						No, cancelar
					</Button>
					<Button onClick={() => cambiarMaestro()} color="primary" autoFocus>
						Si, aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
