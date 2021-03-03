import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Hidden, IconButton, Divider, Typography, Toolbar, Button } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { AppBar, Box, MenuItem, Popover, Avatar, CircularProgress, Drawer, List } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SchoolIcon from '@material-ui/icons/School';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import ListaContenido from './lista';
import ContenidoDashboard from './contenido_dashboard';
import ImagenLogo from '../../../images/uniline2.png';
import { useStyles } from './styles';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';
import Error500 from '../../error500';
import SpinNormal from '../../../components/Spin/spinNormal';
import { DashboardContext } from '../../../context/dashboar_context';

function DashboarUsuario(props) {
	const classes = useStyles();
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ darkTheme, setDarkTheme ] = props.tema;
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ open, setOpen ] = useState(false);
	const [ openSecondary, setOpenSecondary ] = useState(false);
	const { curso, setCurso, setProgreso, setEndTopic, updateCurso, setCalificado } = useContext(
		DashboardContext
	);
	const slugCourse = props.match.params.url;
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const isMenuOpen = Boolean(anchorEl);

	/* if (!token) props.history.push('/'); */
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const darkModeAction = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('tema', !darkTheme);
	};

	const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);
	const handleDrawer = () => setOpen(!open);
	const handleDrawerSecondary = () => setOpenSecondary(!openSecondary);

	const obtenerCursoBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/course/view/${slugCourse}/user-progress/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setCurso(res.data);
					setProgreso(res.data.inscriptionStudent.studentAdvance);
					setEndTopic(res.data.endTopicView);
					if (res.data.commentStudentQualification !== null) {
						setCalificado(true);
					}else{
						setCalificado(false);
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
		[ slugCourse, token, setCurso, user._id, setProgreso, setEndTopic, setCalificado ]
	);

	useEffect(
		() => {
			obtenerCursoBD();
		},
		[ obtenerCursoBD, updateCurso ]
	);

	if (loading) {
		return <Spin loading={loading} />;
	}
	if (curso.length === 0) {
		if (loading) {
			return <SpinNormal />;
		} else {
			return <Error500 />;
		}
	}

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Popover
			id={menuId}
			open={isMenuOpen}
			anchorEl={anchorEl}
			onClose={handleMenuClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center'
			}}
		>
			<MenuItem onClick={handleMenuClose} component={Link} to="/perfil">
				<ListItemIcon>
					<AccountCircleIcon />
				</ListItemIcon>
				<ListItemText primary="Mi perfil" />
			</MenuItem>
			<ListItem button onClick={darkModeAction}>
				<ListItemIcon>{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}</ListItemIcon>
				<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Por defecto'}`} />
			</ListItem>
			<MenuItem
				onClick={() => {
					firebase.auth().signOut();
					localStorage.removeItem('token');
					localStorage.removeItem('student');
					setTimeout(() => {
						window.location.reload();
					}, 500);
				}}
			>
				<ListItemIcon>
					<ExitToAppIcon />
				</ListItemIcon>
				<ListItemText primary="Cerrar sesión" />
			</MenuItem>
		</Popover>
	);

	return (
		<div className={classes.root}>
			<Hidden mdUp>
				<Button
					size="large"
					variant="contained"
					color="primary"
					onClick={handleDrawer}
					className={classes.iconSave}
				>
					Contenido
				</Button>
			</Hidden>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Hidden mdUp>
						<IconButton edge="end" aria-haspopup="true" onClick={handleDrawerSecondary} color="inherit">
							<MenuIcon />
						</IconButton>
					</Hidden>
					<Hidden smDown>
						<Button color="inherit" component={Link} to="/">
							<Box className={classes.logo}>
								<img alt="logo navbar" src={ImagenLogo} className={classes.imagen} />
							</Box>
						</Button>
						{/* <Divider orientation="vertical" className={classes.divider} /> */}
					</Hidden>
					<Box ml={2}>
						<Typography className={classes.title} variant="h6" noWrap>
							{curso.course.title ? curso.course.title : ''}
						</Typography>
					</Box>
					<div className={classes.grow} />
					<Hidden smDown>
						<Button
							color="inherit"
							variant="outlined"
							component={Link}
							to="/mis_cursos"
							className={classes.marginButton}
						>
							Mis cursos
						</Button>
					</Hidden>

					<Hidden smDown>
						<IconButton
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							{!user ? (
								<Avatar alt="foto de perfil" />
							) : !user.imagen ? (
								<Avatar className={classes.orange}>
									{user.name ? (
										user.name.charAt(0)
									) : (
										<CircularProgress style={{ color: '#FFFFFF' }} />
									)}
								</Avatar>
							) : (
								<Avatar alt="foto de perfil" src={user.imagen} />
							)}
						</IconButton>
					</Hidden>
				</Toolbar>
			</AppBar>
			{renderMenu}

			<Hidden smDown>
				<Drawer
					anchor="right"
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<Toolbar />
					<div className={classes.drawerContainer}>
						<ListaContenido curso={curso} />
					</div>
				</Drawer>
			</Hidden>

			<Hidden mdUp>
				<Drawer
					anchor="bottom"
					variant="persistent"
					classes={{
						paper: classes.drawerPaperResponsive
					}}
					open={open}
				>
					<div className={classes.drawerHeader}>
						<IconButton onClick={handleDrawer}>
							<KeyboardArrowDownIcon />
						</IconButton>
					</div>
					<Divider />
					<div className={classes.drawerContainer}>
						<ListaContenido curso={curso} />
					</div>
				</Drawer>
			</Hidden>

			<Hidden mdUp>
				<Drawer
					anchor="left"
					classes={{
						paper: classes.drawerPaperSecondary
					}}
					open={openSecondary}
					onClose={handleDrawerSecondary}
				>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Button color="inherit" component={Link} to="/">
							<Box className={classes.logoResponsive}>
								<img alt="logo navbar" src={ImagenLogo} className={classes.imagen} />
							</Box>
						</Button>
						<IconButton onClick={handleDrawerSecondary}>
							<ArrowBackIosIcon />
						</IconButton>
					</Box>
					<Divider />
					<List>
						<ListItem button component={Link} to="/perfil" onClick={handleDrawer}>
							<ListItemIcon>
								{!user ? (
									<Avatar alt="foto de perfil" />
								) : !user.imagen ? (
									<Avatar className={classes.orange}>
										{user.name ? (
											user.name.charAt(0)
										) : (
											<CircularProgress style={{ color: '#FFFFFF' }} />
										)}
									</Avatar>
								) : (
									<Avatar alt="foto de perfil" src={user.imagen} />
								)}
							</ListItemIcon>
							<ListItemText primary="Mi perfil" />
						</ListItem>
						<ListItem button onClick={handleDrawer} component={Link} to="/">
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary="Inicio" />
						</ListItem>
						<ListItem button onClick={handleDrawer} component={Link} to="/mis_cursos">
							<ListItemIcon>
								<SchoolIcon />
							</ListItemIcon>
							<ListItemText primary="Mis cursos" />
						</ListItem>
						<ListItem button onClick={darkModeAction}>
							<ListItemIcon>{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}</ListItemIcon>
							<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Por defecto'}`} />
						</ListItem>
						<ListItem
							button
							onClick={() => {
								firebase.auth().signOut();
								localStorage.removeItem('token');
								localStorage.removeItem('student');
								setTimeout(() => {
									window.location.reload();
								}, 500);
							}}
						>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Cerrar sesión" />
						</ListItem>
					</List>
				</Drawer>
			</Hidden>

			<main className={classes.content}>
				<Toolbar />
				<ContenidoDashboard user={user} />
				<Spin loading={loading} />
				<MessageSnackbar
					open={snackbar.open}
					mensaje={snackbar.mensaje}
					status={snackbar.status}
					setSnackbar={setSnackbar}
				/>
			</main>
		</div>
	);
}

export default withRouter(DashboarUsuario);
