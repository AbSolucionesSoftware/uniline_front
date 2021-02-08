import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import CardsCursos from '../../CardCurso/card_curso';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import clienteAxios from '../../../../config/axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import SpinNormal from '../../../../components/Spin/spinNormal';

export default function CursosComprados() {
	const token = localStorage.getItem('token');
	const [ cursos, setCursos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({error: false, message: ''});

	let settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 800,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 550,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	const obtenerCursosBD = useCallback(
		async () => {
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
					setError({error: true, message: err.response.data.message});
				} else {
					setError({error: true, message: 'Al parecer no se a podido conectar al servidor.'});
				}
			});
		},
		[ ],
	)

	useEffect(() => {
		obtenerCursosBD();
	}, [ obtenerCursosBD ]);

	console.log("infinite");

	if(loading){
		return (
			<SpinNormal />
		)
	}

	return (
		<Box>
			<Typography variant="h4">¡Continua viendo tus cursos!</Typography>
			<Box my={5} py={2}>
				<Slider {...settings}>
					<CardsCursos cursos={cursos} />
					<CardsCursos cursos={cursos} />
					<CardsCursos cursos={cursos} />
					<CardsCursos cursos={cursos} />
					<CardsCursos cursos={cursos} />
				</Slider>
			</Box>
		</Box>
	);
}
