import React, { useState, Fragment } from 'react';
import {
	Button,
	CircularProgress,
	DialogTitle,
	Menu,
	MenuItem,
	TextField,
	useTheme,
	withStyles
} from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, ListItemText } from '@material-ui/core';
import MessageSnackbar from '../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../config/axios';
import Spin from '../../../../components/Spin/spin';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
		width: 100
	}
})((props) => (
	<Menu
		elevation={3}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'left'
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right'
		}}
		{...props}
	/>
));

export default function EditarEliminarComentario({
	comentario,
	anchorEl,
	handleCloseMenu,
	update,
	setUpdate,
	commentOrAnswer,
	respuesta
}) {
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const [ open, setOpen ] = useState(false);
	const [ openDelete, setOpenDelete ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	/* modal para editar cometnario */
	const handleModal = () => {
		setOpen(!open);
		handleCloseMenu();
	};

	const handleDelete = () => {
		setOpenDelete(!openDelete);
	};

	/* elimina un comentario */
	const eliminarComentario = async () => {
		setLoading(true);
		await clienteAxios
			.delete(
				commentOrAnswer === 'comment'
					? `/comment/${comentario._id}`
					: `/comment/${comentario._id}/user/answer/${respuesta._id}/edit-answer`,
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setUpdate(!update);
				handleCloseMenu();
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
			<ModalRespuesta
				open={open}
				handleModal={handleModal}
				comentario={comentario}
				update={update}
				setUpdate={setUpdate}
				setSnackbar={setSnackbar}
				token={token}
				commentOrAnswer={commentOrAnswer}
				respuesta={respuesta}
			/>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Spin loading={loading} />
			<StyledMenu
				/* disableScrollLock={true} */
				id="customized-menu2"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
			>
				<MenuItem dense>
					<ListItemText primary="Editar" onClick={() => handleModal()} />
				</MenuItem>
				<MenuItem dense>
					<ListItemText
						primary="Eliminar"
						style={{ color: theme.palette.error.main }}
						onClick={() => handleDelete()}
					/>
				</MenuItem>
			</StyledMenu>
			<Dialog
				open={openDelete}
				onClose={handleDelete}
				aria-labelledby="alert-delete-comment"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-delete-comment">{'¿Estás seguro de eliminar tu comentario?'}</DialogTitle>
				<DialogActions>
					<Button onClick={handleDelete} color="primary">
						Cancelar
					</Button>
					<Button onClick={eliminarComentario} color="secondary" autoFocus>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}

const ModalRespuesta = ({
	open,
	handleModal,
	comentario,
	update,
	setUpdate,
	setSnackbar,
	token,
	commentOrAnswer,
	respuesta
}) => {
	const [ loading, setLoading ] = useState(false);
	const [ comment, setComment ] = useState(commentOrAnswer === 'comment' ? comentario.comment : respuesta.comment);

	const obtenerComentario = (value) => setComment(value);

	const guardarComentario = async () => {
		if (!comment) {
			return;
		}
		setLoading(true);
		await clienteAxios
			.put(
				commentOrAnswer === 'comment'
					? `/comment/${comentario._id}`
					: `/comment/${comentario._id}/user/answer/${respuesta._id}/edit-answer`,
				{
					comment: comment
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
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
		<Dialog open={open} onClose={handleModal} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
			<DialogContent>
				<TextField
					id="input-comentario-modal"
					label="Tu comentario"
					autoFocus
					multiline
					fullWidth
					rows={4}
					defaultValue={commentOrAnswer === 'comment' ? comentario.comment : respuesta.comment}
					onChange={(e) => obtenerComentario(e.target.value)}
					variant="outlined"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleModal} color="primary">
					Cancelar
				</Button>
				<Button
					onClick={() => guardarComentario()}
					color="primary"
					variant="contained"
					startIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
				>
					Guardar comentario
				</Button>
			</DialogActions>
		</Dialog>
	);
};
