import React, { useCallback, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
	Box,
	Button,
	Divider,
	FormControlLabel,
	Grid,
	IconButton,
	InputBase,
	Radio,
	RadioGroup,
	TablePagination,
	TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Spin from '../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';
import { CursoContext } from '../../../../../context/curso_context';
import theme from '../../../../../config/themeConfig';

const useStyles = makeStyles({
	table: {
		width: '100%'
	},
	colorCanjeados: {
		color: theme.palette.success.main
	},
	root: {
		padding: '0px 4px',
		display: 'flex',
		alignItems: 'center'
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
});

export default function GenerarCupones() {
	const classes = useStyles();
	const [ cantidadCupones, setCantidadCupones ] = useState(0);
	const [ busqueda, setBusqueda ] = useState('');
	const [ cuponesBD, setCuponesBD ] = useState([]);
	const [ update, setUpdate ] = useState(false);
	const { datos } = useContext(CursoContext);
	const token = localStorage.getItem('token');
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

	const obtenerCantidadCupones = (e) => setCantidadCupones(e.target.value);

	const obtenerBusqueda = (e) => setBusqueda(e.target.value);

	const obtenerCuponesBD = useCallback(
		async (filtro, busqueda) => {
			setLoading(true);
			await clienteAxios
				.get(
					filtro === 'todos'
						? `/course/coupon/${datos._id}`
						: filtro === 'search'
							? `/course/coupon/${datos._id}?code=${busqueda}`
							: `/course/coupon/${datos._id}?exchange=${filtro}`,
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setLoading(false);
					setCuponesBD(res.data);
					setPage(0);
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

	const generarCupones = async () => {
		if (!cantidadCupones) {
			return;
		}
		setLoading(true);
		await clienteAxios
			.post(
				`/course/coupon/${datos._id}`,
				{
					coupon: cantidadCupones
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setCantidadCupones(0);
				setUpdate(!update);
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
			obtenerCuponesBD('todos');
		},
		[ obtenerCuponesBD, update ]
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
			<Box my={2}>
				<form noValidate autoComplete="off">
					<Grid container spacing={2}>
						<Grid item>
							<TextField
								name="cupones"
								type="number"
								label="Cantidad de cupones"
								variant="outlined"
								size="small"
								onChange={obtenerCantidadCupones}
							/>
						</Grid>
						<Grid item>
							<Button variant="contained" color="primary" onClick={generarCupones}>
								Generar cupones
							</Button>
						</Grid>
					</Grid>
				</form>
			</Box>
			<Box>
				<Box my={1}>
					<Grid container spacing={2}>
						<Grid item xs={12} lg={6}>
							<Paper variant="outlined" component="form" className={classes.root}>
								<InputBase
									fullWidth
									placeholder="Busca tu cupon"
									inputProps={{ 'aria-label': 'busqueda por estudiante' }}
									onChange={obtenerBusqueda}
								/>
								<Divider className={classes.divider} orientation="vertical" />
								<IconButton
									className={classes.iconButton}
									aria-label="search"
									onClick={() => obtenerCuponesBD('search', busqueda)}
								>
									<SearchIcon />
								</IconButton>
							</Paper>
						</Grid>
						<Grid item>
							<RadioGroup row aria-label="filtros" name="filtros" defaultValue="todos">
								<FormControlLabel
									value="todos"
									control={<Radio color="primary" />}
									label="Todos"
									labelPlacement="start"
									onChange={(e) => obtenerCuponesBD(e.target.value)}
								/>
								<FormControlLabel
									value="true"
									control={<Radio color="primary" />}
									label="Canjeados"
									labelPlacement="start"
									onChange={(e) => obtenerCuponesBD(e.target.value)}
								/>
								<FormControlLabel
									value="false"
									control={<Radio color="primary" />}
									label="No canjeados"
									labelPlacement="start"
									onChange={(e) => obtenerCuponesBD(e.target.value)}
								/>
							</RadioGroup>
						</Grid>
					</Grid>
				</Box>
				<TableContainer component={Paper}>
					<Table stickyHeader className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Cupones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{cuponesBD.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
								<TableRow key={index}>
									<TableCell className={row.exchange ? classes.colorCanjeados : null}>
										{row.code}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={cuponesBD.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => `${to} de ${count !== -1 ? count : to}`}
				/>
			</Box>
		</Box>
	);
}
