import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Avatar, Box, Collapse, IconButton, Link, makeStyles, Paper, Table, Typography } from '@material-ui/core';
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { CursoContext } from '../../../../context/curso_context';
import clienteAxios from '../../../../config/axios';
import Spin from '../../../../components/Spin/spin';
import RevisarTarea from './revisar_tarea';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';

const useStyles = makeStyles({
	table: {
		width: '100%'
	},
	download: {
		display: 'flex',
		alignItems: 'center'
	}
});

export default function TareasEstudiantes() {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { datos } = useContext(CursoContext);
	const [ tareas, setTareas ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ updateTareas, setUpdateTareas ] = useState(false);
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

	const obtenerTareas = useCallback(
		async () => {
			if (!datos._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/homework/${datos._id}/`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setTareas(res.data);
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
			obtenerTareas();
		},
		[ obtenerTareas, updateTareas ]
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
			<TableContainer component={Paper}>
				<Table stickyHeader className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Usuario</TableCell>
							<TableCell>Tarea</TableCell>
							<TableCell align="right">Calificación</TableCell>
							<TableCell align="right">Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tareas
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((tarea, index) => (
								<TableInfoBody
									key={index}
									tarea={tarea}
									updateTareas={updateTareas}
									setUpdateTareas={setUpdateTareas}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={tareas.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				labelDisplayedRows={({ from, to, count }) => `${from} de ${count !== -1 ? count : to}`}
			/>
		</Box>
	);
}

const TableInfoBody = ({ tarea, updateTareas, setUpdateTareas }) => {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);

	return (
		<Fragment>
			<TableRow>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>
					<Typography>{tarea.idUser.name}</Typography>
				</TableCell>
				<TableCell>
					<Link href={tarea.homeworkFileUrl} download={tarea.homeworkFileKey} className={classes.download}>
						<GetAppIcon /> {tarea.homeworkFileKey}
					</Link>
				</TableCell>
				<TableCell align="right">{tarea.qualificationHomework ? tarea.qualificationHomework : '-'}</TableCell>
				<TableCell align="right">
					<RevisarTarea tarea={tarea} updateTareas={updateTareas} setUpdateTareas={setUpdateTareas} />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Datos del estudiante
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell align="left">Imagen</TableCell>
										<TableCell>Nombre</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Telefono</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell align="left">
											<Avatar alt="imagen usuario" src={tarea.idUser.urlImage} />
										</TableCell>
										<TableCell>{tarea.idUser.name}</TableCell>
										<TableCell>{tarea.idUser.email}</TableCell>
										<TableCell>{tarea.idUser.phone ? tarea.idUser.phone : '-'}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</Fragment>
	);
};
