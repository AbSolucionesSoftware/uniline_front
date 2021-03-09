import React, { useCallback, useEffect, useState } from 'react';
import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import ImagenEmpty from '../../../images/Empty.png';
import clienteAxios from '../../../config/axios';
import SpinNormal from '../../../components/Spin/spinNormal';
import CardsCursos from '../CardCurso/card_curso';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	}
}));

export default function ResultadoBusqueda(props) {
	const classes = useStyles();
	const busqueda = props.match.params.url;
	const [ loading, setLoading ] = useState(false);
	const [ resultados, setResultados ] = useState([]);

	const obtenerResultados = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/course/search/${busqueda}`)
				.then((res) => {
					setLoading(false);
					setResultados(res.data.posts);
				})
				.catch((err) => {
					setLoading(false);
				});
		},
		[ busqueda ]
	);

	const render_cursos = resultados.map((curso, index) => (
		<Grid key={index} item lg={3} md={4} sm={6} xs={12}>
			<CardsCursos  curso={curso} />
		</Grid>
	));

	useEffect(
		() => {
			obtenerResultados();
		},
		[ obtenerResultados ]
	);

	if (loading) {
		return (
			<Box height="80vh" display="flex" justifyContent="center" alignItems="center">
				<SpinNormal />
			</Box>
		);
	}

	if (resultados.length === 0) {
		return (
			<Container maxWidth="lg">
				<Box height="80vh" mt={5}>
					<Typography variant="h4">{`No hubo resultados de "${busqueda}"`}</Typography>
					<Box display="flex" justifyContent="center">
						<Box height="60vh">
							<img alt="resultados busqueda" src={ImagenEmpty} className={classes.imagen} />
						</Box>
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg">
			<Box mt={5}>
				<Typography variant="h4">{`Hay ${resultados.length} ${resultados.length > 1
					? 'resultados'
					: 'resultado'} de "${busqueda}"`}</Typography>
				<Grid container spacing={2}>
					{render_cursos}
				</Grid>
			</Box>
		</Container>
	);
}
