import React from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import ImagenError404 from '../images/Error404.png'

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	}
}));

export default function Error404() {
    const classes = useStyles();
	return (
		<Container maxWidth="md">
			<Box height="80vh" mt={5}>
				<Box display="flex" justifyContent="center">
					<Box height="60vh">
						<img alt="error 404" src={ImagenError404} className={classes.imagen} />
					</Box>
				</Box>
                <Typography variant="h4" align="center">Lo sentimos, Esta pagina no existe</Typography>
			</Box>
		</Container>
	);
}
