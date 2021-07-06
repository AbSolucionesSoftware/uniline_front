import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slide, Grid, Box } from '@material-ui/core';
import { Button, AppBar, Toolbar, Typography, Dialog } from '@material-ui/core';
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

export default function RegistrarInstructor({ usuarios, reload, setReload }) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpenRegistro = () => setOpen(!open);

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				size="large"
				startIcon={<AddCircleOutlinedIcon />}
				onClick={handleClickOpenRegistro}
			>
				Nuevo
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpenRegistro} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Crear un nuevo instructor
						</Typography>
						<Button
							size="large"
							color="inherit"
							onClick={handleClickOpenRegistro}
							startIcon={<CloseIcon />}
						>
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				<Grid container>
					<Grid item md={8} lg={7}>
						<Box p={5}>
							<TablaUsuarios
								usuarios={usuarios}
								reload={reload}
								setReload={setReload}
								handleClickOpenRegistro={handleClickOpenRegistro}
							/>
						</Box>
					</Grid>
					<Grid item md={4} lg={5}>
						<Box p={5}>
							<FormRegistroInstructor
								reload={reload}
								setReload={setReload}
								handleClickOpenRegistro={handleClickOpenRegistro}
							/>
						</Box>
					</Grid>
				</Grid>
			</Dialog>
		</div>
	);
}
