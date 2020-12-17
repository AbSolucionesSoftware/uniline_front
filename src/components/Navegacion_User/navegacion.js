import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Hidden, AppBar, Toolbar, InputBase, Badge, MenuItem, Popover, Drawer } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import HomeIcon from '@material-ui/icons/Home';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	marginButton: {
		marginRight: theme.spacing(1),
		marginLeft: theme.spacing(1)
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto'
		}
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch'
		}
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end'
	},
	offset: theme.mixins.toolbar,
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	}
}));

export default function NavegacionUsuario(props) {
	const [ darkTheme, setDarkTheme ] = props.tema;
	const classes = useStyles();
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ open, setOpen ] = useState(false);

	const isMenuOpen = Boolean(anchorEl);

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
					<AccountCircleIcon fontSize="middle" />
				</ListItemIcon>
				<ListItemText primary="Mi perfil" />
			</MenuItem>
			<MenuItem onClick={handleMenuClose}>
				<ListItemIcon>
					<ExitToAppIcon fontSize="middle" />
				</ListItemIcon>
				<ListItemText primary="Cerrar sesión" />
			</MenuItem>
		</Popover>
	);

	return (
		<div className={classes.root}>
			<div className={classes.grow}>
				<AppBar position="fixed">
					<Toolbar>
						<Hidden mdUp>
							<IconButton
								edge="start"
								aria-label="show more"
								aria-haspopup="true"
								onClick={handleDrawerOpen}
								color="inherit"
								className={classes.menuButton}
							>
								<MenuIcon />
							</IconButton>
						</Hidden>
						<Typography className={classes.title} variant="h6" noWrap>
							UNILINE
						</Typography>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								placeholder="Buscar..."
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
								inputProps={{ 'aria-label': 'search' }}
							/>
						</div>
						<div className={classes.grow} />
						<Hidden smDown>
							<Button color="inherit" component={Link} to="/" className={classes.marginButton}>
								Inicio
							</Button>
							<Button color="inherit" component={Link} to="/mis_cursos" className={classes.marginButton}>
								Mis cursos
							</Button>
							<Button
								color="inherit"
								component={Link}
								to="/instructor/dashboard"
								className={classes.marginButton}
							>
								Mi dashboard
							</Button>
							<Button color="inherit" component={Link} to="/login" className={classes.marginButton}>
								Iniciar sesión
							</Button>
							<IconButton
								aria-label="show 17 new notifications"
								color="inherit"
								component={Link}
								to="/carrito"
							>
								<Badge badgeContent={17} color="secondary">
									<ShoppingCartIcon />
								</Badge>
							</IconButton>
							<IconButton
								edge="end"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								onClick={handleProfileMenuOpen}
								color="inherit"
							>
								<Avatar className={classes.orange}>N</Avatar>
							</IconButton>
							<IconButton aria-label="show 17 theme config" color="inherit" onClick={darkModeAction}>
								{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}
							</IconButton>
						</Hidden>
						<Hidden mdUp>
							<IconButton
								aria-label="show 17 new notifications"
								color="inherit"
								component={Link}
								to="/carrito"
							>
								<Badge badgeContent={17} color="secondary">
									<ShoppingCartIcon />
								</Badge>
							</IconButton>
						</Hidden>
					</Toolbar>
				</AppBar>
				{renderMenu}
				<Drawer
					className={classes.drawer}
					anchor="left"
					open={open}
					onClose={handleDrawerClose}
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<div className={classes.drawerHeader}>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>
						<ListItem button component={Link} to="/" onClick={handleDrawerClose}>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary="Inicio" />
						</ListItem>
						<ListItem button component={Link} to="/mis_cursos" onClick={handleDrawerClose}>
							<ListItemIcon>
								<VideoLibraryIcon />
							</ListItemIcon>
							<ListItemText primary="Mis cursos" />
						</ListItem>
						<ListItem button component={Link} to="/instructor/dashboard" onClick={handleDrawerClose}>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary="Mi dashboard" />
						</ListItem>
						<ListItem button component={Link} to="/carrito" onClick={handleDrawerClose}>
							<ListItemIcon>
								<Badge badgeContent={17} color="secondary">
									<ShoppingCartIcon />
								</Badge>
							</ListItemIcon>
							<ListItemText primary="Carrito" />
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem button component={Link} to="/login" onClick={handleDrawerClose}>
							<ListItemIcon>
								<MeetingRoomIcon />
							</ListItemIcon>
							<ListItemText primary="Iniciar sesión" />
						</ListItem>
						<ListItem button component={Link} to="/perfil" onClick={handleDrawerClose}>
							<ListItemIcon>
								<Avatar className={classes.orange}>N</Avatar>
							</ListItemIcon>
							<ListItemText primary="Mi perfil" />
						</ListItem>
						<ListItem button onClick={darkModeAction}>
							<ListItemIcon>{darkTheme ? <Brightness5Icon /> : <BrightnessMediumIcon />}</ListItemIcon>
							<ListItemText primary={`tema: ${darkTheme === true ? 'Oscuro' : 'Por defecto'}`} />
						</ListItem>
						<ListItem button>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Cerrar Sesión" />
						</ListItem>
					</List>
				</Drawer>
			</div>
			<div className={classes.offset} />
		</div>
	);
}
