import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
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
	colorOK: {
		color: '#2196F3'
	},
	colorERR: {
		color: '#FFC548'
	}
}));

export default useStyles