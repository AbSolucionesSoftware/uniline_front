import React from 'react';
import { Box, Typography } from '@material-ui/core';
import ImagenError500 from '../images/Error500.png';

export default function Error500({error}) {
	return (
		<Box display="flex" justifyContent="center" alignItems="center">
			<Box>
				<Typography variant="h4" align="center"><b>Ups.. Algo salió mal</b></Typography>
				<Typography align="center"><b>{error.message}</b></Typography>
				<Box height={300}>
					<img alt="error 500" src={ImagenError500} height="100%" />
				</Box>
			</Box>
		</Box>
	);
}
