import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	MenuItem,
	Popover,
	Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
/* import EqualizerIcon from '@material-ui/icons/Equalizer'; */
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		backgroundColor: theme.palette.navbar,
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
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
		height: 38,
		width: 0.5,
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1)
	}
}));

export default function NavbarMaestro(props) {
	const [ darkTheme, setDarkTheme ] = props.tema;
	const token = localStorage.getItem('token');
	const classes = useStyles();
	const theme = useTheme();
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ open, setOpen ] = useState(false);
	const isMenuOpen = Boolean(anchorEl);
	let user = { _id: '', name: '', imagen: '' };
	const ruta_actual = props.props.location.pathname.split('/');
	const [ title, setTitle ] = useState(
		ruta_actual[2] === 'registro_instructores'
			? 'Instructores de UNILINE'
			: ruta_actual[2] === 'cursos' ? 'Tus cursos' : ruta_actual[2] === 'estadisticas' ? 'Estadisticas' : ''
	);

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const darkModeAction = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('tema', !darkTheme);
	};

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

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
			<MenuItem
				onClick={() => {
					handleMenuClose();
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
		<div>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon />
					</IconButton>
					<Hidden xsDown>
						<Typography variant="h6" noWrap>
							Dashboard instructor
						</Typography>
						<Divider orientation="vertical" className={classes.divider} />
					</Hidden>
					<Typography variant="h6" noWrap className={classes.title}>
						{title}
					</Typography>
					<IconButton
						style={{ marginRight: theme.spacing(1) }}
						edge="end"
						aria-label="account of current user"
						aria-controls={menuId}
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						{!token ? (
							<Avatar alt="foto de perfil" />
						) : !user.imagen ? (
							<Avatar className={classes.orange}>
								{user.name ? user.name.charAt(0) : <CircularProgress style={{ color: '#FFFFFF' }} />}
							</Avatar>
						) : (
							<Avatar alt="foto de perfil" src={user.imagen} />
						)}
					</IconButton>
				</Toolbar>
			</AppBar>
			{renderMenu}
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem
						button
						component={Link}
						to="/instructor/cursos"
						onClick={() => {
							setTitle('Tus cursos');
							handleDrawerClose();
						}}
					>
						<ListItemIcon>
							<OndemandVideoIcon />
						</ListItemIcon>
						<ListItemText primary="Cursos" />
					</ListItem>
					{/* <ListItem
						button
						component={Link}
						to="/instructor/estadisticas"
						onClick={() => {
							setTitle('Estadisticas');
							handleDrawerClose();
						}}
					>
						<ListItemIcon>
							<EqualizerIcon />
						</ListItemIcon>
						<ListItemText primary="Estadisticas" />
					</ListItem> */}
					{user && user.admin === true ? (
						<ListItem
							button
							component={Link}
							to="/instructor/registro_instructores"
							onClick={() => {
								setTitle('Instructores de UNILINE');
								handleDrawerClose();
							}}
						>
							<ListItemIcon>
								<AssignmentIndIcon />
							</ListItemIcon>
							<ListItemText primary="Instructores" />
						</ListItem>
					) : null}
					<ListItem button onClick={darkModeAction}>
						<ListItemIcon>{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}</ListItemIcon>
						<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Claro'}`} />
					</ListItem>
					<ListItem button component={Link} to="/">
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Pagina principal" />
					</ListItem>
				</List>
			</Drawer>
		</div>
	);
}
