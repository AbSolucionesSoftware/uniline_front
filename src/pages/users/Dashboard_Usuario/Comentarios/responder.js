import React, { Fragment, useContext, useState } from 'react';
import { Avatar, Button, Card, CardContent, CardHeader, CircularProgress, makeStyles } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { formatoFechaCurso } from '../../../../config/reuserFunction';
import clienteAxios from '../../../../config/axios';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';
import { DashboardContext } from '../../../../context/dashboar_context';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	avatar: {
		backgroundColor: red[500]
	}
}));

export default function ResponderComentario({ open, handleModal, comentario, update, setUpdate }) {
	const classes = useStyles();
    let user = { _id: '' };
	const token = localStorage.getItem('token');
    const { temaActual } = useContext(DashboardContext);
    const [ respuesta, setRespuesta ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

    if (token !== null) user = JSON.parse(localStorage.getItem('student'));

    const obtenerRespuesta = (value) => setRespuesta(value);

    const guardarRespuesta = async () => {
        if (!respuesta) {
			return;
		}
		setLoading(true);
		await clienteAxios
			.post(
				`/comment/${comentario._id}/answer/${user._id}/new-answer`,
				{
					comment: respuesta,
					idTopic: temaActual.id
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setRespuesta('');
				setLoading(false);
				setUpdate(!update);
                handleModal();
				setSnackbar({
					open: true,
					mensaje: res.data.message,
					status: 'success'
				});
			})
			.catch((err) => {
				setLoading(false);
                setRespuesta('');
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
    }
	
	return (
		<Fragment>
            <MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Dialog open={open} onClose={handleModal} aria-labelledby="form-responder-answer" fullWidth maxWidth="sm">
				<DialogContent>
					<DialogContentText>Responder a:</DialogContentText>
					<Card className={classes.root}>
						<CardHeader
							avatar={
								comentario.idUser.urlImage ? (
									<Avatar aria-label="recipe" alt="imagen user" src={comentario.idUser.urlImage} />
								) : (
									<Avatar aria-label="recipe" className={classes.avatar}>
										{comentario.idUser.name.charAt(0)}
									</Avatar>
								)
							}
							title="Shrimp and Chorizo Paella"
							subheader={formatoFechaCurso(comentario.createdAt)}
						/>
						<CardContent>
							<Typography variant="body2" color="textSecondary" component="p">
								{comentario.comment}
							</Typography>
						</CardContent>
					</Card>
					<TextField
						id="outlined-input=resposne"
						label="Tu respuesta"
						margin="dense"
						autoFocus
						multiline
						fullWidth
						rows={4}
                        value={respuesta}
                        onChange={(e) => obtenerRespuesta(e.target.value)}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button onClick={() => guardarRespuesta()} color="primary" variant="contained" startIcon={loading ? (<CircularProgress size={20} color="inherit" />) : null}>
						Enviar respuesta
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
