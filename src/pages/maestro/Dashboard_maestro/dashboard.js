import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Button, Grid, Box, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CursosProfesor from './cursos';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Scroll from '../../../components/ScrolltoTop/scroll';

const useStyles = makeStyles((theme) => ({
	flex: {
		width: '100%',
		height: '50vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
    },
    iconflex: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		fontSize: 60,
        marginRight: 10,
        color: '#6666'
	},
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		[theme.breakpoints.down('md')]: {
			marginBottom: 10
		}
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
}));

export default function DashboardMaestro(props) {
	const classes = useStyles();

	return (
		<div>
			<Scroll showBelow={250} />
			<Grid container>
				<Grid item xs={12} md={5}>
					<Paper component="form" className={classes.root}>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
						<Divider className={classes.divider} orientation="vertical" />
						<InputBase className={classes.input} placeholder="Buscar tus cursos" />
					</Paper>
				</Grid>
				<Grid item xs={12} md={7}>
					<Box display="flex" justifyContent="flex-end">
						<Button
							size="large"
							variant="contained"
							color="primary"
							startIcon={<AddCircleIcon />}
							component={Link}
							to="/instructor/nuevo_curso"
						>
							Nuevo curso
						</Button>
					</Box>
				</Grid>
				<div className={classes.flex}>
					<Box>
						<div className={classes.iconflex}>
							<CloudUploadIcon className={classes.icon} />
						</div>
						<Typography style={{color: '#666666'}} variant="h5">Aun no tienes cursos registrados, ¡Comienza ahora!</Typography>
					</Box>
				</div>
				<CursosProfesor />
			</Grid>
		</div>
	);
}
