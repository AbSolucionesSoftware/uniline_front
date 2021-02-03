import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Button, TextField, Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { Grid, Hidden, Card, CardActions, Collapse, CardContent } from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DragIndicatorOutlinedIcon from '@material-ui/icons/DragIndicatorOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import SubirVideoTema from './subir_video';
import SubirArchivoTema from './subir_archivo';
import Spin from '../../../../../components/Spin/spin';
import MessageSnackbar from '../../../../../components/Snackbar/snackbar';
import clienteAxios from '../../../../../config/axios';
import { CursoContext } from '../../../../../context/curso_context';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { client } from '../../../../../config/config_vimeo';

const useStyles = makeStyles((theme) => ({
	background: {
		backgroundColor: theme.palette.background.default
	},
	backgroundPaper: {
		backgroundColor: theme.palette.background.paper
	},
	container: {
		marginRight: theme.spacing(3),
		marginLeft: theme.spacing(3),
		[theme.breakpoints.down('xs')]: {
			marginRight: theme.spacing(1),
			marginLeft: theme.spacing(1)
		}
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	}
}));

const reorder = (list, startIndex, endIndex) => {
	const newList = Array.from(list);
	const [ removed ] = newList.splice(startIndex, 1);
	newList.splice(endIndex, 0, removed);
	return newList;
};

export default function Temas({ openNewTheme, setOpenNewTheme, bloque, bloques, setBloques, temas, setTemas }) {
	const token = localStorage.getItem('token');
	const { update, setUpdate } = useContext(CursoContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const [ loading, setLoading ] = useState(false);
	const [ action, setAction ] = useState(false);

	const [ datosTemas, setDatosTemas ] = useState([]);

	const handleClickOpen = (action, topic) => {
		if (action === 'edit') {
			setAction(true);
			setDatosTemas({
				...datosTemas,
				_id: topic._id,
				topicTitle: topic.topicTitle
			});
			setOpenNewTheme(!openNewTheme);
			return;
		}
		setAction(false);
		setOpenNewTheme(!openNewTheme);
	};

	const obtenerCampos = (e) => {
		if (action) {
			setDatosTemas({
				...datosTemas,
				[e.target.name]: e.target.value
			});
			return;
		}
		if (bloque.topics && bloque.topics.length === 0) {
			setDatosTemas({ ...datosTemas, [e.target.name]: e.target.value, preference: 1 });
		} else {
			const preference = bloque.topics[bloque.topics.length - 1].preference + 1;
			setDatosTemas({
				...datosTemas,
				[e.target.name]: e.target.value,
				preference: preference
			});
		}
	};

	const messages = (estado, mensaje) => {
		if (estado === 'success') {
			setSnackbar({
				open: true,
				mensaje: mensaje,
				status: 'success'
			});
		} else {
			if (mensaje.response) {
				setSnackbar({
					open: true,
					mensaje: mensaje.response.data.message,
					status: 'error'
				});
			} else {
				setSnackbar({
					open: true,
					mensaje: 'Al parecer no se a podido conectar al servidor.',
					status: 'error'
				});
			}
		}
	};

	const guardarTemaBD = async () => {
		if (!datosTemas.topicTitle) {
			return;
		}
		handleClickOpen();
		setLoading(true);
		if (action) {
			await clienteAxios
				.put(`/course/topic/edit/${datosTemas._id}`, datosTemas, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					messages('success', res.data.message);
					setUpdate(!update);
				})
				.catch((err) => {
					setLoading(false);
					messages('error', err);
				});
		} else {
			await clienteAxios
				.post(`/course/topic/${bloque.block._id}`, datosTemas, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					messages('success', res.data.message);
					setUpdate(!update);
				})
				.catch((err) => {
					setLoading(false);
					messages('error', err);
				});
		}
	};

	const eliminarTemaBD = (idTema, video) => {
		setLoading(true);
		client.request(
			{
				method: 'DELETE',
				path: `/videos/${video}`
			},
			function(error, body, status_code) {
				if (error) {
					setLoading(false);
					setSnackbar({
						open: true,
						mensaje: 'Hubo un error: ' + error,
						status: 'error'
					});
					return;
				}
				clienteAxios
					.delete(`/course/topic/delete/${idTema}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setLoading(false);
						messages('success', res.data.message);
						setUpdate(!update);
					})
					.catch((err) => {
						setLoading(false);
						messages('error', err);
					});
			}
		);
	};

	const onDragEnd = (result) => {
		const { destination, source } = result;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const new_topics = reorder(bloque.topics, source.index, destination.index);
		const nuevo_bloque = { block: bloque.block, topics: new_topics }
		let nuevos_bloques = [];

		bloques.forEach((res) => {
			if(res.block._id === bloque.block._id){
				nuevos_bloques.push({block: nuevo_bloque.block, topics: nuevo_bloque.topics})
			}else{
				nuevos_bloques.push({block: res.block, topics: res.topics})
			}
		})
		setBloques(nuevos_bloques);
	};

	const render_temas = bloque.topics.map((tema, index) => {
		return (
			<RenderTemas
				key={index}
				index={index}
				tema={tema}
				handleClickOpen={handleClickOpen}
				eliminarTemaBD={eliminarTemaBD}
			/>
		);
	});

	return (
		<Box>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable-topics">
					{(provided) => (
						<Box my={2} ref={provided.innerRef}>
							{render_temas}
							{provided.placeholder}
						</Box>
					)}
				</Droppable>
			</DragDropContext>
			<Spin loading={loading} />
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Dialog open={openNewTheme} onClose={handleClickOpen} aria-labelledby="form-dialog-title" fullWidth>
				<DialogTitle id="form-dialog-title">Nuevo Tema</DialogTitle>
				<DialogContent>
					<Box mb={5}>
						<DialogContentText>¿Cual es el nombre de tu nuevo tema?</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							name="topicTitle"
							defaultValue={action === true ? datosTemas.topicTitle : ''}
							placeholder="Nombre del tema"
							fullWidth
							onChange={obtenerCampos}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClickOpen} color="primary">
						Cancelar
					</Button>
					<Button onClick={() => guardarTemaBD()} color="primary" variant="contained">
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

const RenderTemas = ({ index, tema, handleClickOpen, eliminarTemaBD }) => {
	const classes = useStyles();
	const [ value, setValue ] = React.useState(0);
	const [ expanded, setExpanded ] = React.useState(false);
	const [ deleteConfimation, setDeleteConfimation ] = useState({ open: false, id: '', video: '' });

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleDeleteConfimation = (idBlock, video) => {
		setDeleteConfimation({ open: !deleteConfimation.open, id: idBlock, video: video });
	};

	return (
		<Draggable draggableId={`topic-${tema._id}`} index={index}>
			{(provided) => (
				<Box
					className={classes.container}
					my={2}
					ref={provided.innerRef}
					{...provided.draggableProps} /* {...provided.dragHandleProps} */
				>
					<AlertConfimationDelete
						deleteConfimation={deleteConfimation}
						handleDeleteConfimation={handleDeleteConfimation}
						eliminarTemaBD={eliminarTemaBD}
					/>
					<Card className={classes.background}>
						<CardActions disableSpacing>
							<Grid container spacing={2}>
								<Hidden lgUp>
									<Grid item xs={12}>
										<Box display="flex" justifyContent="flex-end">
											<IconButton onClick={() => handleClickOpen('edit', tema)}>
												<EditOutlinedIcon />
											</IconButton>
											<IconButton
												onClick={() => handleDeleteConfimation(tema._id, tema.keyTopicVideo)}
											>
												<DeleteOutlinedIcon />
											</IconButton>
											<IconButton {...provided.dragHandleProps}>
												<DragIndicatorOutlinedIcon />
											</IconButton>
											<IconButton
												className={clsx(classes.expand, {
													[classes.expandOpen]: expanded
												})}
												onClick={handleExpandClick}
												aria-expanded={expanded}
												aria-label="show more"
											>
												<ExpandMoreIcon />
											</IconButton>
										</Box>
									</Grid>
								</Hidden>
								<Grid item xs={10} sm={8}>
									<Typography variant="h6">{`Tema ${index + 1}: ${tema.topicTitle}`}</Typography>
								</Grid>
								<Grid item xs={2} sm={4}>
									<Hidden mdDown>
										<Box display="flex" justifyContent="flex-end">
											<IconButton onClick={() => handleClickOpen('edit', tema)}>
												<EditOutlinedIcon />
											</IconButton>
											<IconButton
												onClick={() => handleDeleteConfimation(tema._id, tema.keyTopicVideo)}
											>
												<DeleteOutlinedIcon />
											</IconButton>
											<IconButton {...provided.dragHandleProps}>
												<DragIndicatorOutlinedIcon />
											</IconButton>
											<IconButton
												className={clsx(classes.expand, {
													[classes.expandOpen]: expanded
												})}
												onClick={handleExpandClick}
												aria-expanded={expanded}
												aria-label="show more"
											>
												<ExpandMoreIcon />
											</IconButton>
										</Box>
									</Hidden>
								</Grid>
							</Grid>
						</CardActions>
						<Collapse in={expanded} timeout="auto" unmountOnExit>
							<CardContent>
								<Grid container>
									<Grid item xs={12}>
										<Tabs
											value={value}
											onChange={handleChange}
											aria-label="simple tabs example"
											className={classes.background}
											indicatorColor="primary"
											textColor="primary"
										>
											<Tab
												icon={<VideoCallIcon style={{ fontSize: 40 }} />}
												label="Video del tema"
												{...a11yProps(0)}
											/>
											<Tab
												icon={<InsertDriveFileOutlinedIcon style={{ fontSize: 30 }} />}
												label="Recursos"
												{...a11yProps(1)}
											/>
										</Tabs>
									</Grid>
									<Grid item xs={12} className={classes.backgroundPaper}>
										<TabPanel value={value} index={0}>
											<SubirVideoTema tema={tema} />
										</TabPanel>
										<TabPanel value={value} index={1}>
											<SubirArchivoTema tema={tema} />
										</TabPanel>
									</Grid>
								</Grid>
							</CardContent>
						</Collapse>
					</Card>
				</Box>
			)}
		</Draggable>
	);
};

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

function AlertConfimationDelete({ deleteConfimation, handleDeleteConfimation, eliminarTemaBD }) {
	return (
		<div>
			<Dialog
				open={deleteConfimation.open}
				onClose={handleDeleteConfimation}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'¿Estás seguro de eliminar este tema?'}</DialogTitle>
				<DialogActions>
					<Button onClick={handleDeleteConfimation} color="primary">
						Cancelar
					</Button>
					<Button
						onClick={() => {
							handleDeleteConfimation();
							eliminarTemaBD(deleteConfimation.id, deleteConfimation.video);
						}}
						color="secondary"
						autoFocus
					>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
