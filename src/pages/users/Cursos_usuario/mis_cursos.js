import React, { useCallback, useEffect, useState } from 'react';
import { Breadcrumbs, Card, Grid, LinearProgress, withStyles } from '@material-ui/core';
import { Box, Container, makeStyles, Typography, Button } from '@material-ui/core';
import clienteAxios from '../../../config/axios';
import SpinNormal from '../../../components/Spin/spinNormal';
import Error500 from '../../error500';
import ImagenEmpty from '../../../images/Empty.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	margin: {
		marginTop: theme.spacing(5)
	},
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
	root: {
		display: 'flex',
		minHeight: 200
	},
	button: {
		[theme.breakpoints.down('xs')]: {
			display: 'flex',
			justifyContent: 'center'
		}
	}
}));

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 8,
		width: '100%'
	},
	colorPrimary: {
		backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
	},
	bar: {
		borderRadius: 2,
		backgroundColor: theme.palette.primary.main
	}
}))(LinearProgress);

export default function MisCursos() {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const [ cursos, setCursos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({ error: false, message: '' });
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCursosBD = useCallback(
		async () => {
			if (!user._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/course/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					console.log(res);
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
		},
		[ token, user._id ]
	);

	const render_cursos = cursos.map((curso, index) => <CardMisCursos key={index} curso={curso} />);

	useEffect(
		() => {
			obtenerCursosBD();
			window.scrollTo(0, 0);
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
		return (
			<Container maxWidth="sm">
				<Box height="90vh" display="flex" justifyContent="center" alignItems="center">
					<div>
						<Typography align="center" variant="h4">
							No tienes cursos{' '}
						</Typography>
						<Box height="60vh" width="100%">
							<img alt="not found" src={ImagenEmpty} className={classes.imagen} />
						</Box>
					</div>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" className={classes.margin}>
			<Typography variant="h4">¡Estos son los cursos que has adquirido!</Typography>
			<Box py={3}>
				<Grid container spacing={4}>
					<Grid item lg={12}>
						{render_cursos}
					</Grid>
				</Grid>{' '}
			</Box>
		</Container>
	);
}

const CardMisCursos = ({ curso }) => {
	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<Grid container>
				<Grid item lg={4} sm={4} xs={12}>
					<Box className={classes.imagenContainer}>
						<img alt="imagen curso" src={curso.idCourse.urlPromotionalImage} className={classes.imagen} />
					</Box>
				</Grid>
				<Grid item lg={8} sm={8} xs={12}>
					<Box m={4}>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Typography variant="subtitle1" color="textSecondary">
								{curso.idCourse.category}
							</Typography>
							<Typography variant="subtitle1" color="textSecondary">
								{curso.idCourse.subCategory}
							</Typography>
						</Breadcrumbs>
						<Typography variant="h5">{curso.idCourse.title}</Typography>
						<Grid container>
							<Grid item md={3} xs={12}>
								<Typography>Avance del curso:</Typography>
							</Grid>
							<Grid item md={9} xs={12}>
								<Box mt={1}>
									<BorderLinearProgress
										variant="determinate"
										value={parseInt(curso.studentAdvance)}
									/>
								</Box>
							</Grid>
						</Grid>
						<Box mt={2} className={classes.button}>
							<Button
								size="large"
								variant="contained"
								color="primary"
								component={Link}
								to={`/dashboard/${curso.idCourse.slug}`}
							>
								Ir al curso
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Card>
	);
};
