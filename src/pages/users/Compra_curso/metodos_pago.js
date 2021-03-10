import React, { Fragment, useState } from 'react';
import { Box, Button, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import { FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
/* import ImagenMetodosPago from '../../../images/metodosdepago.png'; */
import ImagenMetodosPagoSinOxxo from '../../../images/metodosdepago_sinoxxo.png';

const useStyles = makeStyles((theme) => ({
	imagen: {
		width: '100%',
		height: '100%'
	},
	imagenContainer: {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

export default function MetodosDePago() {
	const classes = useStyles();
	const [ value, setValue ] = useState('credit');

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<Fragment>
			<Box my={2}>
				<FormControl component="fieldset">
					<FormLabel component="legend">Métodos de pago</FormLabel>
					<Box className={classes.imagenContainer}>
						<img alt="metodos de pago" src={ImagenMetodosPagoSinOxxo} className={classes.imagen} />
					</Box>
					<RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
						<FormControlLabel value="credit" control={<Radio />} label="Tarjeta de credito" />
						<FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
						{/* <FormControlLabel value="oxxo" control={<Radio />} label="Oxxo" /> */}
					</RadioGroup>
				</FormControl>
			</Box>
			{value === 'credit' ? (
				<Button fullWidth color="secondary" size="large" variant="contained">
					Pagar ahora [credito]
				</Button>
			) : value === 'paypal' ? (
				<Button fullWidth color="secondary" size="large" variant="contained">
					Pagar ahora [paypal]
				</Button>
			) : (
				<Button fullWidth color="secondary" size="large" variant="contained">
					Pagar ahora [oxxo]
				</Button>
			)}
		</Fragment>
	);
}
