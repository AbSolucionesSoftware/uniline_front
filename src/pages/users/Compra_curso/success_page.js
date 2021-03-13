import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Container, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import clienteAxios from '../../../config/axios';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	imagen: {
		maxHeight: '100%',
		maxWidth: '100%'
	},
	buttons: {
		display: 'block'
	}
}));

export default function PagoSuccess(props) {
	const idPago = props.match.params.idPago;
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const [ cursos, setCursos ] = useState([]);

	const obtenerCursos = useCallback(
		async () => {
			await clienteAxios
				.get(`/pay/${idPago}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setCursos(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ token, idPago ]
	);

	const renderLista = cursos.map((curso, index) => <ListaCursos key={index} curso={curso} />);

	useEffect(
		() => {
			obtenerCursos();
		},
		[ obtenerCursos ]
	);

    if(cursos.length === 0 ) return null
    if(!token || token === null) props.history.push("/")

	return (
		<Container maxWidth="md">
			<Box
				minHeight="90vh"
				display="flex"
				justifyContent="center"
				alignItems="center"
				boxShadow={1}
				style={{ backgroundColor: theme.palette.background.paper }}
			>
				<div>
					<Box display="flex" justifyContent="center" alignItems="center">
						<CheckCircleTwoToneIcon style={{ fontSize: 150, color: theme.palette.success.light }} />
					</Box>
					<Box mt={4} textAlign="center">
						<Typography variant="h5">
							<b>¡Su pago ha sido realizado!</b>
						</Typography>
						<Typography variant="h5">Has comprado los siguientes cursos</Typography>
					</Box>
					<Box mt={6}>
                        {renderLista}
                    </Box>
					<Box my={5} display="flex" justifyContent="center">
						<Button
							color="primary"
							size="large"
							variant="contained"
							startIcon={<PlayCircleFilledWhiteIcon />}
                            component={Link}
                            to="/mis_cursos"
						>
							Ir a mis cursos
						</Button>
					</Box>
				</div>
			</Box>
		</Container>
	);
}

const ListaCursos = ({ curso }) => {
	const classes = useStyles();

	return (
		<Box my={2} height={100} >
			<Grid container spacing={2}>
				<Grid item>
					<Box display="flex" justifyContent="center" alignItems="center" height={100}>
						<img
							alt="imagen carrito"
							src={curso.idCourse.urlPromotionalImage}
							className={classes.imagen}
						/>
					</Box>
				</Grid>
				<Grid item>
					<Box>
						<Typography variant="h5">{curso.idCourse.title}</Typography>
						<Typography variant="subtitle1" color="textSecondary">
							{`Por ${curso.idCourse.idProfessor.name}`}
										{curso.idCourse.idProfessor.profession ? `, ${curso.idCourse.idProfessor.profession}` : ''}
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};
