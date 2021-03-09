import React, { Fragment, useContext, useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import clienteAxios from '../../../config/axios';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { DashboardContext } from '../../../context/dashboar_context';

export default function Calificacion({ curso, update, setUpdate }) {
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ open, setOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ calificacion, setCalificacion ] = useState({ calificacion: 0, comentario: '' });
	const { setCalificado } = useContext(DashboardContext);
    const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const handleModal = () => setOpen(!open);
	const obtenerComentario = (comentario) => setCalificacion({ ...calificacion, comentario: comentario });
	const obtenerCalificacion = (calificacion) => setCalificacion({ ...calificacion, calificacion: calificacion });

	const guardarCalificacionBD = async () => {
		if (!calificacion.calificacion || !calificacion.comentario) {
			return null;
		}
		setLoading(true);
		await clienteAxios
			.post(
				`/course/comment/${user._id}/course/${curso.course._id}`,
				{
					comment: calificacion.comentario,
					qualification: calificacion.calificacion
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setCalificado(true);
                setSnackbar({
                    open: true,
                    mensaje: res.data.message,
                    status: 'success'
                });
                handleModal();
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
		<Fragment>
            <Spin loading={loading} />
            <MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Button variant="outlined" onClick={handleModal}>
				¡Califica el curso!
			</Button>
			<Dialog
				open={open}
				onClose={handleModal}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle id="alert-dialog-title">¡Califica nuestro curso!</DialogTitle>
				<DialogContent>
					<Box display="flex" justifyContent="center" alignItems="center" mb={2}>
						<Rating
							name="simple-controlled"
							value={calificacion.calificacion}
							onChange={(event, newValue) => {
								obtenerCalificacion(newValue);
							}}
							precision={0.5}
							size="large"
						/>
						<Box ml={2} width={50}>
							<Typography variant="h5">{calificacion.calificacion}</Typography>
						</Box>
					</Box>
					<TextField
						id="outlined-calification"
						label="Opinion del curso"
						margin="dense"
						autoFocus
						multiline
						fullWidth
						rows={4}
						value={calificacion.comentario}
						onChange={(e) => obtenerComentario(e.target.value)}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button onClick={guardarCalificacionBD} color="primary" autoFocus variant="outlined">
						Calificar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
