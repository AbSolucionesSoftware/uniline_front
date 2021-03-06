import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import CardsCursos from '../../CardCurso/card_curso';
/* import Carousel from 'react-multi-carousel'; */
import 'react-multi-carousel/lib/styles.css';
import clienteAxios from '../../../../config/axios';
import SpinNormal from '../../../../components/Spin/spinNormal';
import Error500 from '../../../error500';

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(5),
		[theme.breakpoints.down('xs')]: {
			margin: '32px 0px'
		}
	}
}));

export default function CursosDisponibles() {
	const classes = useStyles();
	const [ cursos, setCursos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({ error: false, message: '' });

	/* const responsive = {
		superLargeDesktop: {
			// the naming can be any, depends on you.
			breakpoint: { max: 3000, min: 1365 },
			items: 4
		},
		desktop: {
			breakpoint: { max: 1365, min: 998 },
			items: 3
		},
		tablet: {
			breakpoint: { max: 998, min: 532 },
			items: 3
		},
		mobile: {
			breakpoint: { max: 532, min: 0 },
			items: 2
		}
	}; */

	const obtenerCursosBD = useCallback(async () => {
		setLoading(true);
		await clienteAxios
			.get(`/course/`)
			.then((res) => {
				setLoading(false);
				setCursos(res.data);
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					setError({ error: true, message: err.response.data.message });
				} else {
					setError({ error: true, message: 'Al parecer no se a podido conectar al servidor.' });
				}
			});
	}, []);

	/* const render_cursos = cursos.map((curso, index) => <CardsCursos key={index} curso={curso} />); */
	const render_cursos_lg = cursos.map((curso, index) => (
		<Grid key={index} item xs={6} lg={3} md={4}>
			<CardsCursos curso={curso} />
		</Grid>
	));

	useEffect(
		() => {
			obtenerCursosBD();
		},
		[ obtenerCursosBD ]
	);

	if (loading) {
		return <SpinNormal />;
	}
	if (error.error) {
		return <Error500 error={error.message} />;
	}

	return (
		<Box className={classes.margin}>
			<Typography variant="h4">¡Nuestros cursos!</Typography>
			{/* <Hidden smUp>
				<Box py={2} width="auto">
					<Carousel swipeable responsive={responsive}>
						{render_cursos}
					</Carousel>
				</Box>
			</Hidden>
			<Hidden xsDown>
				<Box py={2} width="auto">
					<Grid container spacing={3} >
						{render_cursos_lg}
					</Grid>
				</Box>
			</Hidden> */}
			<Box py={2} width="auto">
					<Grid container spacing={3} >
						{render_cursos_lg}
					</Grid>
				</Box>
		</Box>
	);
}
