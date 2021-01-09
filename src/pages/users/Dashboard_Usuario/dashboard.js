import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Hidden,
	IconButton,
	Button,
	Divider,
	Typography,
	Toolbar,
	AppBar,
	Box,
	MenuItem,
	Popover,
	Avatar,
	CircularProgress,
	Drawer,
	List
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SchoolIcon from '@material-ui/icons/School';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import ListaContenido from './lista';
import ContenidoDashboard from './contenido_dashboard';
import { useStyles } from './styles';

export default function DashboarUsuario(props) {
	const classes = useStyles();
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ darkTheme, setDarkTheme ] = props.tema;
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ open, setOpen ] = useState(false);
	const [ openSecondary, setOpenSecondary ] = useState(false);

	const isMenuOpen = Boolean(anchorEl);

	/* if (!token) props.history.push('/'); */
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

	const handleDrawer = () => {
		setOpen(!open);
	};

	const handleDrawerSecondary = () => {
		setOpenSecondary(!openSecondary);
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
							<Typography className={classes.title} variant="h6" noWrap>
								UNILINE
							</Typography>
						</Button>
						<Divider orientation="vertical" className={classes.divider} />
					</Hidden>
					<Box ml={2}>
						<Typography className={classes.title} variant="h6" noWrap>
							Curso React desde 0 a experto
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
						<ListaContenido />
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
						<ListaContenido />
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
					<Box display="flex" justifyContent="space-between">
						<Button color="inherit" component={Link} to="/">
							<Typography className={classes.title} variant="h6" noWrap>
								UNILINE
							</Typography>
						</Button>
						<IconButton onClick={handleDrawerSecondary}>
							<ArrowBackIosIcon />
						</IconButton>
					</Box>
					<Divider />
					<List>
						<ListItem button component={Link} to="/perfil" onClick={handleDrawer}>
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
				<ContenidoDashboard />
			</main>
		</div>
	);
}
