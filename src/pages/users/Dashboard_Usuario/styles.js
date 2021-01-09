import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

/* estilos del dashboard de usuario */

const drawerWidth = 400;

export const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: theme.palette.navbar
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
    },
	drawerPaperSecondary: {
		width: 300
	},
	drawerPaperResponsive: {
		width: '100vw'
	},
	drawerContainer: {
		overflow: 'auto'
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	content: {
		flexGrow: 1,
		marginRight: drawerWidth,
		[theme.breakpoints.down('sm')]: {
			marginRight: 0
		}
	},
	divider: {
		backgroundColor: theme.palette.background.paper,
		height: 28,
		margin: 4
	},
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	},
	marginButton: {
		marginRight: theme.spacing(1),
		marginLeft: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(1),
		right: theme.spacing(2)
	}
}));