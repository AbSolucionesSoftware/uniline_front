import React, { useState, useEffect, useCallback, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, List, Typography, IconButton, Button, Box, Hidden, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { deepOrange } from '@material-ui/core/colors';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import SchoolIcon from '@material-ui/icons/School';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import clienteAxios from '../../../config/axios';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { CursoContext } from '../../../context/curso_context';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	appBar: {
		backgroundColor: theme.palette.navbar,
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth
		}
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	drawer: {
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	drawerPaper: {
		width: drawerWidth
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	title: {
		flexGrow: 1
	},
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	},
	divider: {
		backgroundColor: theme.palette.background.paper,
		height: 28,
		margin: 10
	},
	drawHeight: {
		marginTop: theme.spacing(5),
		[theme.breakpoints.down('sm')]: {
			marginTop: 0
		}
	},
}));

export default function NavegacionContenidoCurso(props) {
	const classes = useStyles();
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const { window } = props;
	const [ darkTheme, setDarkTheme ] = props.tema;
	const [ mobileOpen, setMobileOpen ] = useState(false);
	const [ title, setTitle ] = useState('Información del curso');
	const { datos, setDatos, update, setPreview } = useContext(CursoContext);
	const idcurso = props.props.match.params.curso;
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

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
					if(res.data.urlPromotionalImage){
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

	useEffect(
		() => {
			obtenerCursoBD();
		},
		[ obtenerCursoBD, update ]
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
					<ListItem button component={Link} to={`/instructor/contenido_curso/${idcurso}/general`} onClick={() => setTitle('Información del curso')}>
						<ListItemIcon>
							<EditIcon />
						</ListItemIcon>
						<ListItemText primary="Información del curso" />
					</ListItem>
					<ListItem button component={Link} to={`/instructor/contenido_curso/${idcurso}/learn`} onClick={() => setTitle('Que enseñarás')}>
						<ListItemIcon>
							<SchoolIcon />
						</ListItemIcon>
						<ListItemText primary="Que enseñarás" />
					</ListItem>
				</List>
			</Box>
			<Box mt={2} ml={3}>
				<Typography variant="button">Contenido del curso</Typography>
				<Divider />
				<List className={classes.root}>
					<ListItem button component={Link} to={`/instructor/contenido_curso/${idcurso}/contenido`} onClick={() => setTitle('Bloques y temas del curso')}>
						<ListItemIcon>
							<ListIcon />
						</ListItemIcon>
						<ListItemText primary="Bloques y temas" />
					</ListItem>
				</List>
			</Box>
			<Box mt={2} ml={3}>
				<Typography variant="button">Publicación del curso</Typography>
				<Divider />
				<List className={classes.root}>
					<List className={classes.root}>
						<ListItem button component={Link} to={`/instructor/contenido_curso/${idcurso}/precio`} onClick={() => setTitle('Precio del curso')}>
							<ListItemIcon>
								<AttachMoneyIcon />
							</ListItemIcon>
							<ListItemText primary="Precio" />
						</ListItem>
					</List>
					<List className={classes.root}>
						<ListItem button component={Link} to={`/instructor/contenido_curso/${idcurso}/promocion`} onClick={() => setTitle('Promociones del curso')}>
							<ListItemIcon>
								<LocalOfferIcon />
							</ListItemIcon>
							<ListItemText primary="Promociones" />
						</ListItem>
					</List>
				</List>
			</Box>
			<Box display="flex" justifyContent="center" mt={4}>
				<Box width={250}>
					<Button size="large" color="primary" variant="contained" fullWidth>
						Publicar
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
					<Button color="inherit" variant="outlined" component={Link} to="/instructor/cursos">
						Regresar a cursos
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
