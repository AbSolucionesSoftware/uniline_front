import React, { useState } from 'react';
import { Box, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, Typography } from '@material-ui/core';
import ListaCompra from './lista_items';
import { formatoMexico } from '../../../config/reuserFunction';
import ImagenMetodosPagoSinOxxo from '../../../images/metodosdepago_sinoxxo.png';
import PagoCredito from './pago_credito';
import PagoPaypal from './pago_paypal';

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
	},
	container: {
		backgroundColor: theme.palette.background.default
	},
	grid: {
		backgroundColor: theme.palette.background.paper
	}
}));

export default function PagarCurso(props) {
	const classes = useStyles();
	const [ value, setValue ] = useState('credit');
	let user = { _id: '' };
	let token = localStorage.getItem('token');
	let compra = JSON.parse(localStorage.getItem('payment'));

	if (!token || !user) props.history.push('/');
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const render_lista = compra.courses.map((curso, index) => <ListaCompra key={index} curso={curso.course} />);

	/* total de carrito */
	let total = 0;
	let totalAnterior = 0;
	let descuento = 0;
	let promocion = false;
	compra.courses.forEach((articulo) => {
		if (articulo.course.priceCourse.free) {
			total += 0;
		} else {
			if (articulo.course.priceCourse.promotionPrice) {
				total += articulo.course.priceCourse.promotionPrice;
				promocion = true;
			} else {
				total += articulo.course.priceCourse.price;
			}
		}
		totalAnterior += articulo.course.priceCourse.price;
		descuento = ((total * 100 / totalAnterior - 100) * -1);
	});

	return (
		<Container maxWidth="lg" className={classes.container}>
			<Grid container spacing={2}>
				<Grid item lg={8}>
					<Box minHeight="70vh" my={7}>
						{render_lista}
					</Box>
				</Grid>
				<Grid item lg={4}>
					<Box boxShadow={3} minHeight="80vh" my={7} p={4} className={classes.grid}>
						<Typography variant="h5">Total:</Typography>
						<Typography variant="h4">
							<b>{formatoMexico(total)} $MXN</b>
						</Typography>
						{promocion ? (
							<Grid container spacing={3}>
								<Grid item>
									<Typography variant="h6" color="textSecondary">
										<s>{formatoMexico(totalAnterior)} $MXN</s>
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="h6" color="textSecondary">
										{descuento}% de descuento
									</Typography>
								</Grid>
							</Grid>
						) : null}
						<Box my={2}>
							<Divider />
						</Box>
						<Box my={2}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Métodos de pago</FormLabel>
								<Box className={classes.imagenContainer}>
									<img
										alt="metodos de pago"
										src={ImagenMetodosPagoSinOxxo}
										className={classes.imagen}
									/>
								</Box>
								<RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
									<FormControlLabel value="credit" control={<Radio />} label="Tarjeta de credito" />
									<FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
									{/* <FormControlLabel value="oxxo" control={<Radio />} label="Oxxo" /> */}
								</RadioGroup>
							</FormControl>
						</Box>
						{/* {value === 'credit' ? (
							<PagoCredito compra={compra} total={total} />
						) : (
							<PagoPaypal />
						)} */}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
