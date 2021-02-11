import React, { useCallback, useEffect, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import clienteAxios from '../../../../config/axios';
import SpinNormal from '../../../../components/Spin/spinNormal';
import Error500 from '../../../error500';
import CardsCursosEstudiantes from '../../CardCurso/card_curso_estudiante';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(5),
		[theme.breakpoints.down('xs')]: {
			margin: '32px 8px'
		}
	}
}));

export default function CursosComprados() {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const [ cursos, setCursos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({ error: false, message: '' });
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const responsive = {
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
			breakpoint: { max: 998, min: 449 },
			items: 2
		},
		mobile: {
			breakpoint: { max: 480, min: 0 },
			items: 1
		}
	};

	const obtenerCursosBD = useCallback(async () => {
		setLoading(true);
		if (!user._id) return;
		await clienteAxios
			.get(`/course/user/${user._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
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
	}, [ token, user._id]);

	/* console.log("infinite");
	console.log(cursos); */

	const render_cursos = cursos.map((curso, index) => <CardsCursosEstudiantes key={index} curso={curso} />);

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
		return <Error500 error={error} />;
	}
	if (cursos.length === 0) {
		return null;
	}

	return (
		<Box className={classes.margin}>
			<Typography variant="h4">¡Continua viendo tus cursos!</Typography>
			<Box py={2} width="auto">
				<Carousel swipeable responsive={responsive}>
					{render_cursos}
				</Carousel>
			</Box>
		</Box>
	);
}
