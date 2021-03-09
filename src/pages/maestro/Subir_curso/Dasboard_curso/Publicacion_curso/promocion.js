import React, { useContext, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import { Box, Button, Grid, InputAdornment, TextField } from '@material-ui/core';
import { CursoContext } from '../../../../../context/curso_context';
import Spin from '../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';

const marks = [
	{
		value: 0,
		label: '0%'
	},
	{
		value: 50,
		label: '50%'
	},
	{
		value: 100,
		label: '100%'
	}
];

export default function PromocionCurso() {
	const { datos, setDatos, update, setUpdate } = useContext(CursoContext);
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	function valuetext(value) {
		return `${value}%`;
	}

	function obtenerPorcentaje(e, value) {
		//obtiene el valor de descuento
		var porcentaje = 100 - value;
		var descuento = Math.round(datos.priceCourse.price * porcentaje / 100);
		setDatos({
			...datos,
			priceCourse: {
				free: datos.priceCourse.free,
				price: datos.priceCourse.price,
				promotionPrice: descuento,
				persentagePromotion: value
			}
		});
	}

	const obtenerPrecioPromocion = (e) => {
		//obtiene el porcentaje
		var percent = Math.round(e.target.value / datos.priceCourse.price * 100);
		var porcentaje = 100 - percent;
		setDatos({
			...datos,
			priceCourse: {
				free: datos.priceCourse.free,
				price: datos.priceCourse.price,
				promotionPrice: e.target.value,
				persentagePromotion: porcentaje
			}
		});
	};

	const guardarPromocionBD = async () => {
		setLoading(true);
		await clienteAxios
			.put(
				`/course/price-promotion/${datos._id}`,
				{
					priceCourse: datos.priceCourse
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setUpdate(!update);
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					setSnackbar({
						open: true,
						mensaje: err.response.data.message,
						status: 'error'
					});
				} else {
					setSnackbar({
						open: true,
						mensaje: 'Al parecer no se a podido conectar al servidor.',
						status: 'error'
					});
				}
			});
    };
    
    const quitarPromocionBD = async () => {
		setLoading(true);
		await clienteAxios
			.put(
				`/course/price-promotion/${datos._id}`,
				{
					priceCourse: {
                        free: datos.priceCourse.free,
                        price: datos.priceCourse.price,
                        promotionPrice: 0,
                        persentagePromotion: 0
                    }
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
				setUpdate(!update);
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					setSnackbar({
						open: true,
						mensaje: err.response.data.message,
						status: 'error'
					});
				} else {
					setSnackbar({
						open: true,
						mensaje: 'Al parecer no se a podido conectar al servidor.',
						status: 'error'
					});
				}
			});
	};

	return (
		<Box mt={4}>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<form noValidate autoComplete="off">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={5} lg={4}>
						<Slider
							value={parseInt(datos.priceCourse.persentagePromotion)}
							valueLabelFormat={valuetext}
							aria-labelledby="discrete-slider-always"
							marks={marks}
							valueLabelDisplay="on"
							onChange={(event, value) => obtenerPorcentaje(event, value)}
						/>
					</Grid>
					<Grid item lg={3}>
						<TextField
							id="outlined-promotion"
							name="promotionPrice"
							type="number"
							label="Precio promoción"
							variant="outlined"
							value={datos.priceCourse.promotionPrice}
							size="small"
							onChange={obtenerPrecioPromocion}
							InputProps={{
								startAdornment: <InputAdornment position="start">$</InputAdornment>
							}}
						/>
					</Grid>
					<Grid item lg={5}>
						<Grid container spacing={2}>
							<Grid item >
								<Button variant="contained" color="primary" onClick={guardarPromocionBD}>
									Guardar
								</Button>
							</Grid>
							<Grid item >
								<Button variant="outlined" color="primary" onClick={quitarPromocionBD}>
									eliminar
								</Button>
							</Grid >
						</Grid>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
}
