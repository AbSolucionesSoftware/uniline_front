import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { MenuItem, Popover, Drawer, Box, IconButton } from '@material-ui/core';
import { Button, Hidden, AppBar, Toolbar, InputBase, CircularProgress } from '@material-ui/core';
import { Avatar, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import HomeIcon from '@material-ui/icons/Home';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import useStyles from './styles';
import ImagenLogo from '../../images/uniline2.png';
import ImagenLogoDark from '../../images/unilineDark.png';
import CarritoNavbar from './carrito';

function NavegacionUsuario(props) {
	const [ darkTheme, setDarkTheme ] = props.tema;
	let token = localStorage.getItem('token');
	const classes = useStyles();
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ open, setOpen ] = useState(false);
	const [ busqueda, setBusqueda ] = useState('');
	const isMenuOpen = Boolean(anchorEl);
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const darkModeAction = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('tema', !darkTheme);
	};

	const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);
	const handleDrawerAction = () => setOpen(!open);

	const obtenerBusqueda = (e) => setBusqueda(e.target.value);
	const buscarBD = () => {
		if (!busqueda) {
			return;
		}
		/* setBusqueda(''); */
		props.history.push(`/busqueda/${busqueda}`);
	};

	useEffect(() => {
		localStorage.removeItem('urlActual');
	}, []);

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
				<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Claro'}`} />
			</ListItem>
			<MenuItem
				onClick={() => {
					firebase.auth().signOut();
					localStorage.removeItem('token');
					localStorage.removeItem('student');
					localStorage.removeItem('urlActual');
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
			<div className={classes.grow}>
				<AppBar position="fixed" className={classes.appbar}>
					<Toolbar>
						<Hidden mdUp>
							<IconButton
								edge="start"
								aria-label="show more"
								aria-haspopup="true"
								onClick={handleDrawerAction}
								color="inherit"
								className={classes.menuButton}
							>
								<MenuIcon />
							</IconButton>
						</Hidden>
						<Hidden smDown>
							<Button color="inherit" component={Link} to="/">
								<Box className={classes.logo}>
									<img alt="logo navbar" src={darkTheme ? ImagenLogoDark : ImagenLogo} className={classes.imagen} />
								</Box>
							</Button>
						</Hidden>
						<div className={classes.search}>
							{/* <div className={classes.searchIcon}>
								<SearchIcon />
							</div> */}
							<InputBase
								placeholder="¿Qué quieres aprender hoy?"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
								inputProps={{ 'aria-label': 'search' }}
								value={busqueda}
								onChange={obtenerBusqueda}
							/>
							<div className={classes.grow} />
							<IconButton size="small" color="inherit" onClick={() => buscarBD()}>
								<SearchIcon />
							</IconButton>
						</div>
						<div className={classes.grow} />
						<Hidden smDown>
							{/* <Button color="inherit" component={Link} to="/" className={classes.marginButton}>
								Inicio
							</Button> */}
							{token ? (
								<Button
									color="inherit"
									component={Link}
									to="/mis_cursos"
									className={classes.marginButton}
								>
									Mis cursos
								</Button>
							) : (
								<div />
							)}
							{token && user.rol === 'Maestro' ? (
								<Button
									color="inherit"
									component={Link}
									to="/instructor/cursos"
									className={classes.marginButton}
								>
									Mi dashboard
								</Button>
							) : (
								<div />
							)}
							{!token ? (
								<Button color="secondary" variant="contained" component={Link} to="/login" className={`${classes.marginButton} ${classes.session}`}>
									Iniciar sesión
								</Button>
							) : (
								<div />
							)}
							{!token ? (
								<Button
									color="inherit"
									component={Link}
									to="/registro"
									className={classes.marginButton}
								>
									Regístrate
								</Button>
							) : (
								<div />
							)}
							{token ? (
								<IconButton
									aria-label="show 17 new notifications"
									color="inherit"
									component={Link}
									to="/carrito"
								>
									<CarritoNavbar />
								</IconButton>
							) : (
								<div />
							)}
							{token ? (
								<IconButton
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit"
								>
									{!user.imagen ? (
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
							) : (
								<div />
							)}
							{!token ? (
								<IconButton aria-label="show 17 theme config" color="inherit" onClick={darkModeAction}>
									{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
								</IconButton>
							) : (
								<div />
							)}
						</Hidden>
						<Hidden mdUp>
							<IconButton
								aria-label="show 17 new notifications"
								color="inherit"
								component={Link}
								to="/carrito"
							>
								<CarritoNavbar />
							</IconButton>
						</Hidden>
					</Toolbar>
				</AppBar>
				{renderMenu}
				<Drawer
					className={classes.drawer}
					anchor="left"
					open={open}
					onClose={handleDrawerAction}
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<div className={classes.drawerHeader}>
						<Button color="inherit" component={Link} to="/">
							<Box className={classes.logoResponsive}>
								<img alt="logo navbar" src={darkTheme ? ImagenLogoDark : ImagenLogo} className={classes.imagen} />
							</Box>
						</Button>
						<div className={classes.grow} />
						<IconButton onClick={handleDrawerAction}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>
						<ListItem button component={Link} to="/" onClick={handleDrawerAction}>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary="Inicio" />
						</ListItem>
						{token ? (
							<ListItem button component={Link} to="/mis_cursos" onClick={handleDrawerAction}>
								<ListItemIcon>
									<VideoLibraryIcon />
								</ListItemIcon>
								<ListItemText primary="Mis cursos" />
							</ListItem>
						) : (
							<div />
						)}
						{token && user.rol === 'Maestro' ? (
							<ListItem button component={Link} to="/instructor/cursos" onClick={handleDrawerAction}>
								<ListItemIcon>
									<DashboardIcon />
								</ListItemIcon>
								<ListItemText primary="Mi dashboard" />
							</ListItem>
						) : (
							<div />
						)}
						{token ? (
							<ListItem button component={Link} to="/carrito" onClick={handleDrawerAction}>
								<ListItemIcon>
									<CarritoNavbar />
								</ListItemIcon>
								<ListItemText primary="Carrito" />
							</ListItem>
						) : (
							<div />
						)}
					</List>
					<Divider />
					<List>
						{!token ? (
							<ListItem button component={Link} to="/login" onClick={handleDrawerAction}>
								<ListItemIcon>
									<MeetingRoomIcon />
								</ListItemIcon>
								<ListItemText primary="Iniciar sesión" />
							</ListItem>
						) : (
							<div />
						)}
						{!token ? (
							<ListItem button component={Link} to="/registro" onClick={handleDrawerAction}>
								<ListItemIcon>
									<HowToRegIcon />
								</ListItemIcon>
								<ListItemText primary="Registrate" />
							</ListItem>
						) : (
							<div />
						)}
						{token ? (
							<ListItem button component={Link} to="/perfil" onClick={handleDrawerAction}>
								<ListItemIcon>
									{!user.imagen ? (
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
						) : (
							<div />
						)}
						<ListItem button onClick={darkModeAction}>
							<ListItemIcon>{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}</ListItemIcon>
							<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Claro'}`} />
						</ListItem>
						{token ? (
							<ListItem
								button
								onClick={() => {
									firebase.auth().signOut();
									localStorage.removeItem('token');
									localStorage.removeItem('student');
									localStorage.removeItem('urlActual');
									setTimeout(() => {
										window.location.reload();
									}, 500);
								}}
							>
								<ListItemIcon>
									<ExitToAppIcon />
								</ListItemIcon>
								<ListItemText primary="Cerrar Sesión" />
							</ListItem>
						) : (
							<div />
						)}
					</List>
				</Drawer>
			</div>
			<div className={classes.offset} />
		</div>
	);
}
export default withRouter(NavegacionUsuario);
