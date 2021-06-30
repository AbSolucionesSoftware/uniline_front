import React, { useContext, useState } from 'react';
import { Box, Button, CircularProgress, TextField, useTheme } from '@material-ui/core';
import clienteAxios from '../../../../config/axios';
import { DashboardContext } from '../../../../context/dashboar_context';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';

export default function Comentar({ curso, update, setUpdate }) {
	const theme = useTheme();
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ comentario, setComentario ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const { temaActual } = useContext(DashboardContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerComentario = (value) => {
		setComentario(value);
	};

	const enviarComentarioBD = async () => {
		if (!comentario) {
			return;
		}
		setLoading(true);
		await clienteAxios
			.post(
				`/comment/${curso.course._id}/user/${user._id}`,
				{
					comment: comentario,
					idTopic: temaActual.id
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setComentario('');
				setLoading(false);
				setUpdate(!update);
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
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
		<Box mb={2} style={{padding: '0%'}}>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<TextField
				style={{ backgroundColor: theme.palette.background.paper }}
				fullWidth
				placeholder="Tu respuesta..."
				id="outlined-multiline-static"
				multiline
				rows={3}
				value={comentario}
				variant="outlined"
				onChange={(e) => obtenerComentario(e.target.value)}
			/>
			<Box display="flex" justifyContent="flex-end" mt={2}>
				{loading ? (
					<Box mr={2}>
						<CircularProgress size={35} />
					</Box>
				) : null}
				<Button variant="contained" color="primary" onClick={() => enviarComentarioBD()} disabled={!temaActual.id ? true : false}>
					Comentar
				</Button>
			</Box>
		</Box>
	);
}
