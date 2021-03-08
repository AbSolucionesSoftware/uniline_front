import { fade, makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

/* estilos del nav de usuario */

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	appbar: {
		backgroundColor: theme.palette.navbar
	},
	marginButton: {
		marginRight: theme.spacing(1),
		marginLeft: theme.spacing(1)
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	search: {
		position: 'relative',
		display: 'flex',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
		
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
		padding: theme.spacing(1, 1, 1, 2),
		// vertical padding + font size from searchIcon
		/* paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, */
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '30ch',
			/* '&:focus': {
				width: '35ch'
			} */
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
		/* justifyContent: 'flex-end' */
	},
	offset: theme.mixins.toolbar,
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	},
	logo: {
		display: 'none',
		height: 40,
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	logoResponsive: {
		height: 40,
	},
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	session: {
		backgroundColor: theme.palette.session.main,
		color: '#ffff'
	}
}));

export default useStyles;
