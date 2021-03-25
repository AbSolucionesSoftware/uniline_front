import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, List, Typography, IconButton, Button, Box, Hidden, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import clienteAxios from '../../../config/axios';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { CursoContext } from '../../../context/curso_context';
import {
	verificarInformacionCurso,
	verificarLearningsCurso,
	verificarBloquesCurso,
	verificarPrecioCurso
} from './verificar_contenido';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ErrorIcon from '@material-ui/icons/Error';
import useStyles from './styleContenidoCurso';

export default function NavegacionContenidoCurso(props) {
	const classes = useStyles();
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const { window } = props;
	const [ darkTheme, setDarkTheme ] = props.tema;
	const [ mobileOpen, setMobileOpen ] = useState(false);
	const { datos, setDatos, update, setUpdate, setPreview } = useContext(CursoContext);
	const idcurso = props.props.match.params.curso;
	const ruta_actual = props.props.location.pathname.split('/');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ blocks, setBlocks ] = useState([]);
	const [ title, setTitle ] = useState(
		ruta_actual[4] === 'general'
			? 'Información del curso'
			: ruta_actual[4] === 'learn'
				? 'Que enseñarás'
				: ruta_actual[4] === 'contenido'
					? 'Bloques y temas del curso'
					: ruta_actual[4] === 'precio'
						? 'Precio del curso'
						: ruta_actual[4] === 'tareas'
							? 'Tareas de tus estuidantes'
							: ruta_actual[4] === 'estudiantes' ? 'Tus alumnos' : ''
	);

	const darkModeAction = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('tema', !darkTheme);
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const obtenerCursoBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/course/${idcurso}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setDatos(res.data);
					if (res.data.urlPromotionalImage) {
						setPreview(res.data.urlPromotionalImage);
					}
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
		[ idcurso, token, setDatos, setPreview ]
	);

	const obtenerBloquesBD = useCallback(
		async () => {
			if (datos._id && token) {
				await clienteAxios
					.get(`/course/data/${datos._id}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setBlocks(res.data);
					})
					.catch((err) => {
						return;
					});
			}
		},
		[ datos._id, token ]
	);

	const publicarCurso = async () => {
		if (
			verificarInformacionCurso(datos) &&
			verificarLearningsCurso(datos) &&
			verificarBloquesCurso(blocks) &&
			verificarPrecioCurso(datos)
		) {
			await clienteAxios
				.put(
					`/course/public/${datos._id}`,
					{
						publication: !datos.publication
					},
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setSnackbar({
						open: true,
						mensaje: res.data.message,
						status: 'success'
					});
					setLoading(false);
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
		} else {
			setSnackbar({
				open: true,
				mensaje: 'Tu curso aun esta incompleto.',
				status: 'error'
			});
		}
	};

	useEffect(
		() => {
			obtenerCursoBD();
			obtenerBloquesBD();
		},
		[ obtenerCursoBD, obtenerBloquesBD, update ]
	);

	const drawer = (
		<div>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Hidden mdUp>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerToggle}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
			</Hidden>
			<Box ml={3} className={classes.drawHeight}>
				<Typography variant="button">Información general</Typography>
				<Divider />
				<List className={classes.root}>
					<ListItem
						button
						component={Link}
						to={`/instructor/contenido_curso/${idcurso}/general`}
						onClick={() => {
							setTitle('Información del curso');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							{verificarInformacionCurso(datos) ? (
								<CheckCircleIcon className={classes.colorOK} />
							) : (
								<ErrorIcon className={classes.colorERR} />
							)}
						</ListItemIcon>
						<ListItemText primary="Información del curso" />
					</ListItem>
					<ListItem
						button
						component={Link}
						to={`/instructor/contenido_curso/${idcurso}/learn`}
						onClick={() => {
							setTitle('Que enseñarás');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							{verificarLearningsCurso(datos) ? (
								<CheckCircleIcon className={classes.colorOK} />
							) : (
								<ErrorIcon className={classes.colorERR} />
							)}
						</ListItemIcon>
						<ListItemText primary="Que enseñarás" />
					</ListItem>
				</List>
			</Box>
			<Box mt={1} ml={3}>
				<Typography variant="button">Contenido del curso</Typography>
				<Divider />
				<List className={classes.root}>
					<ListItem
						button
						component={Link}
						to={`/instructor/contenido_curso/${idcurso}/contenido`}
						onClick={() => {
							setTitle('Bloques y temas del curso');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							{verificarBloquesCurso(blocks) ? (
								<CheckCircleIcon className={classes.colorOK} />
							) : (
								<ErrorIcon className={classes.colorERR} />
							)}
						</ListItemIcon>
						<ListItemText primary="Bloques y temas" />
					</ListItem>
				</List>
			</Box>
			<Box mt={1} ml={3}>
				<Typography variant="button">Publicación del curso</Typography>
				<Divider />
				<List className={classes.root}>
					<List className={classes.root}>
						<ListItem
							button
							component={Link}
							to={`/instructor/contenido_curso/${idcurso}/precio`}
							onClick={() => {
								setTitle('Precio del curso');
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								{verificarPrecioCurso(datos) ? (
									<CheckCircleIcon className={classes.colorOK} />
								) : (
									<ErrorIcon className={classes.colorERR} />
								)}
							</ListItemIcon>
							<ListItemText primary="Precio y promociones" />
						</ListItem>
					</List>
				</List>
			</Box>
			<Box mt={1} ml={3}>
				<Typography variant="button">Estudiantes</Typography>
				<Divider />
				<List className={classes.root}>
					<ListItem
						button
						component={Link}
						to={`/instructor/contenido_curso/${idcurso}/tareas`}
						onClick={() => {
							setTitle('Tareas de tus estudiantes');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							<AssignmentOutlinedIcon />
						</ListItemIcon>
						<ListItemText primary="Tareas finales" />
					</ListItem>
					<ListItem
						button
						component={Link}
						to={`/instructor/contenido_curso/${idcurso}/estudiantes`}
						onClick={() => {
							setTitle('Tus alumnos');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							<AssignmentIndIcon />
						</ListItemIcon>
						<ListItemText primary="Alumnos inscritos" />
					</ListItem>
				</List>
			</Box>
			<Box display="flex" justifyContent="center" mt={2}>
				<Box width={250}>
					<Button
						size="large"
						color="primary"
						variant="outlined"
						fullWidth
						component={Link}
						to="/instructor/cursos"
					>
						Volver a tus cursos
					</Button>
				</Box>
			</Box>
			<Box display="flex" justifyContent="center" mt={2}>
				<Box width={250}>
					<Button size="large" color="primary" variant="contained" fullWidth onClick={publicarCurso}>
						{datos.publication ? 'Publicado' : 'Publicar'}
					</Button>
				</Box>
			</Box>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<div>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						className={classes.menuButton}
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						{title}
					</Typography>
					<Divider orientation="vertical" className={classes.divider} />
					<Typography variant="h6" noWrap className={classes.title}>
						{datos.title ? datos.title : ''}
					</Typography>
					<Button
						color="inherit"
						variant="outlined"
						target="_blank"
						href={ruta_actual[4] !== 'contenido' ? `/curso/${datos.slug}` : `/dashboard/${datos.slug}`}
					>
						Vista previa
					</Button>
					<IconButton aria-label="show 17 theme config" color="inherit" onClick={darkModeAction}>
						{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
					</IconButton>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper
						}}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden smDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
		</div>
	);
}
