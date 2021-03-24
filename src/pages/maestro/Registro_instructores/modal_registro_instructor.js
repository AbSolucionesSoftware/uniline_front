import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slide, Grid, Box } from '@material-ui/core';
import { Button, AppBar, Toolbar, IconButton, Typography, Dialog } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import TablaUsuarios from './tabla_usuarios';
import FormRegistroInstructor from './registro_form';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistrarInstructor() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				size="large"
				startIcon={<AddCircleOutlinedIcon />}
				onClick={handleClickOpen}
			>
				Nuevo
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Crear un nuevo instructor
						</Typography>
						<Button size="large" color="inherit" onClick={handleClose} startIcon={<CloseIcon />}>
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				<Grid container>
                    <Grid item lg={6}>
                        <Box p={5}>
							<TablaUsuarios />
						</Box>
                    </Grid>
                    <Grid item lg={6}>
                        <Box p={5}>
							<FormRegistroInstructor />
						</Box>
                    </Grid>
                </Grid>
			</Dialog>
		</div>
	);
}
