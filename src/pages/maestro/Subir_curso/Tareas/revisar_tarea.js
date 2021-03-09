import React, { Fragment, useState } from 'react';
import { Box, Button, CircularProgress, TextField } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import clienteAxios from '../../../../config/axios';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';

export default function RevisarTarea({ tarea, updateTareas, setUpdateTareas }) {
	const token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ open, setOpen ] = useState(false);
	const [ calificacion, setCalificacion ] = useState(0);
	const [ validate, setValidate ] = useState(false);
    const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleModal = () => {
        setOpen(!open);
        setCalificacion(0);
    }

	const obtenerCalificacion = (value) => setCalificacion(value);

	const calificarTarea = async () => {
		if (!calificacion || calificacion < 1 || calificacion > 100) {
			setValidate(true);
			return;
		}
		setLoading(true);
		await clienteAxios
			.put(`/homework/qualification/${tarea._id}`,{
                qualificationHomework: calificacion
            }, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setCalificacion(0);
				handleModal();
                setUpdateTareas(!updateTareas);
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
		<Fragment>
            <MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Button
				variant="outlined"
				onClick={handleModal}
				color={tarea.qualificationHomework ? 'primary' : 'inherit'}
			>
				{tarea.qualificationHomework ? 'Revisado' : 'Revisar'}
			</Button>
			<Dialog onClose={handleModal} aria-labelledby="simple-dialog-tareas" open={open}>
				<DialogTitle id="simple-dialog-title">Tarea de: {tarea.idUser.name}</DialogTitle>
				<DialogContent>
					<DialogContentText>Puedes calificar esta tarea del 1 al 100</DialogContentText>
					<Box display="flex" justifyContent="center">
						<TextField
							fullWidth
							error={validate}
							name="qualificationHomework"
							label="Calificación"
							placeholder="Calificación"
							type="number"
							variant="outlined"
							InputProps={{
								inputProps: { min: 1, max: 100 }
							}}
							value={calificacion}
							onChange={(e) => obtenerCalificacion(e.target.value)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button
						onClick={calificarTarea}
						variant="contained"
						color="primary"
						autoFocus
						startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
					>
						Calificar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
