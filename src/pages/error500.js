import React from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import ImagenError500 from '../images/Error500.png';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	}
}));

export default function Error500({ error }) {
	const classes = useStyles();

	return (
		<Container maxWidth="md">
			<Box height="80vh" mt={5}>
				<Box display="flex" justifyContent="center">
					<Box height="60vh">
						<img alt="error 404" src={ImagenError500} className={classes.imagen} />
					</Box>
				</Box>
				<Typography variant="h4" align="center">
					<b>Ups.. Algo salió mal</b>
				</Typography>
				<Typography align="center">
					<b>{error}</b>
				</Typography>
			</Box>
		</Container>
	);
}
