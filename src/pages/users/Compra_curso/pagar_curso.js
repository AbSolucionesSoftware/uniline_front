import React from 'react';
import { Box, Button, Container, Divider, Grid, Typography } from '@material-ui/core';
import ListaCompra from './lista_items';
import { formatoMexico } from '../../../config/reuserFunction';

export default function PagarCurso(props) {
	let user = { _id: '' };
	let token = localStorage.getItem('token');
	let compra = JSON.parse(localStorage.getItem('payment'));

	if (!token || !user) props.history.push('/');
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const render_lista = compra.courses.map((curso, index) => <ListaCompra key={index} curso={curso.idCourse} />);

	console.log(compra);
	/* total de carrito */
	let total = 0;
	let totalAnterior = 0;
	let descuento = 0;
	let promocion = false;
	compra.courses.forEach((articulo) => {
		if (articulo.idCourse.priceCourse.free) {
			total += 0;
		} else {
			if (articulo.idCourse.priceCourse.promotionPrice) {
				total += articulo.idCourse.priceCourse.promotionPrice;
				promocion = true;
			} else {
				total += articulo.idCourse.priceCourse.price;
			}
		}
		totalAnterior += articulo.idCourse.priceCourse.price;
		descuento = ((total * 100 / totalAnterior - 100) * -1).toFixed(2);
	});

	return (
		<Container maxWidth="lg">
			<Grid container spacing={2}>
				<Grid item lg={8}>
					<Box minHeight="70vh" my={7}>
						{render_lista}
					</Box>
				</Grid>
				<Grid item lg={4}>
					<Box boxShadow={3} minHeight="80vh" my={7} p={4}>
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
						<Button
							fullWidth
							color="secondary"
							size="large"
							variant="contained"
						>
							Pagar ahora
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
