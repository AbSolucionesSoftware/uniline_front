import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme) => ({
    root:{
       /*  backgroundColor: 'rgba(255, 255, 255, 0.8)', */
        backgroundColor: fade(theme.palette.background.paper, 0.8),
        zIndex: 2
    },
	image: {
		position: 'relative',
		height: 300,
		width: 300,
		[theme.breakpoints.down('xs')]: {
			width: 200, // Overrides inline-style
			height: 200
		},
		'&:hover': {
			zIndex: 1,
			'& $imageBackdrop': {
				opacity: 0.6
			},
			'& $imageEditButton': {
				display: 'block'
			}
		}
	},
	imageButton: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.palette.common.white,
		cursor: 'pointer'
	},
	imageSrc: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        borderRadius: '50%'
	},
	imageBackdrop: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0,
        transition: theme.transitions.create('opacity'),
        borderRadius: '50%'
	},
	imageEditButton: {
		display: 'none'
	},
	imageTitle: {
		zIndex: 2,
		textAlign: 'center',
		width: 300,
		height: 50,
		position: 'absolute',
		backgroundColor: theme.palette.common.black,
		opacity: 0.5,
		'& .inputTitle': {
			color: theme.palette.common.white,
			fontSize: 20
		}
	},
	margin: {
		margin: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		top: theme.spacing(10),
		right: theme.spacing(2)
    },
    imagen: {
        maxHeight: "100%",
        maxWidth: "100%"
    }
}));

export default useStyles;