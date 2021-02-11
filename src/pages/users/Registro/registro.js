import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Hidden } from '@material-ui/core';
import Imagen from '../../../images/register.jpg';
import FormRegistroUsuario from './form_registro';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.palette.background.paper
	},
	imagen: {
		maxHeight: '91vh'
	}
}));

export default function RegistroUsuario(props) {
	const token = localStorage.getItem('token');
	const classes = useStyles();

	if (token) {
		props.history.push('/');
	}

	return (
		<Grid container direction="row" className={classes.color}>
			<Hidden xsDown>
				<Grid item sm={6} md={6} lg={8}>
					<img alt="registrate" src={Imagen} className={classes.imagen} />
				</Grid>
			</Hidden>
			<Grid item xs={12} sm={6} md={6} lg={4} className={classes.color}>
				<FormRegistroUsuario />
			</Grid>
		</Grid>
	);
}
