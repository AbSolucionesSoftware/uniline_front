import React, { useCallback, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import { CardHeader, CardContent, CardActions, Collapse, Chip } from '@material-ui/core';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Box, Button, Hidden, useTheme } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import DoneIcon from '@material-ui/icons/Done';

import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Comentar from './comentar';
import { DashboardContext } from '../../../../context/dashboar_context';
import clienteAxios from '../../../../config/axios';
import RespuestasComentarios from './respuestas';
import { formatoFechaCurso } from '../../../../config/reuserFunction';
import EditarEliminarComentario from './editar_eliminar';
import ResponderComentario from './responder';
import LikesAndDislikes from './likesAndDislikes';
const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	root: {
		width: '100%'
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	},
	container: {
		// paddingTop: theme.spacing(2),
		// paddingLeft: theme.spacing(5),
		// paddingRight: theme.spacing(5),
		// paddingBottom: theme.spacing(6),
		// [theme.breakpoints.down('sm')]: {
		// 	paddingLeft: 0,
		// 	paddingRight: 0
		// }
	}
}));

export default function ComentariosCurso({ curso }) {
	// const classes = useStyles();
	const theme = useTheme();
	const token = localStorage.getItem('token');
	const [ filtro, setFiltro ] = useState('todos');
	const [ update, setUpdate ] = useState(false);
	const [ comentarios, setComentarios ] = useState([]);
	/* const [ loading, setLoading ] = useState(false); */
	const { temaActual } = useContext(DashboardContext);

	const handleFiltro = (event, value) => {
		setFiltro(value);
		obtenerComentarios(value);
	};

	const obtenerComentarios = useCallback(
		async (filtro) => {
			/* setLoading(true); */
			await clienteAxios
				.get(
					filtro === 'todos'
						? `/comment/course/${curso.course._id}/`
						: `/comment/course/${curso.course._id}?idTopic=${temaActual.id}`,
					{
						headers: {
							Authorization: `bearer ${token}`
						}
					}
				)
				.then((res) => {
					setComentarios(res.data);
					/* setLoading(false); */
				})
				.catch((err) => {
					/* setLoading(false); */
					console.log(err);
				});
		},
		[ curso.course._id, temaActual.id, token ]
	);

	const render_comentarios = comentarios.map((comentario, index) => (
		<Comentarios key={index} comentario={comentario} update={update} setUpdate={setUpdate} />
	));

	useEffect(
		() => {
			obtenerComentarios(filtro);
		},
		[ obtenerComentarios, update, filtro ]
	);

	return (
		<div style={{padding: '0%'}}>
			<Box minHeight={200} style={{padding: '0%'}}>
				<Box mb={2}>
					<Typography variant="h5">Comentarios</Typography>
				</Box>
				<Comentar curso={curso} update={update} setUpdate={setUpdate} />

				<Box  style={{ backgroundColor: theme.palette.background.paper,padding: '0%' }}>
					<Box mb={2}>
						<ToggleButtonGroup
							value={filtro}
							exclusive
							onChange={handleFiltro}
							aria-label="comentarios de curso"
						>
							<ToggleButton value="todos" aria-label="todos los comentarios">
								<Typography>Todos los comentarios</Typography>
							</ToggleButton>
							<ToggleButton value="tema" aria-label="cometarios del tema actual">
								<Typography>Comentarios del tema actual</Typography>
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>
					{/* {loading ? (
						<Box height={100} display="flex" justifyContent="center" alignItems="center">
							<CircularProgress />
						</Box>
					) : null} */}
					{render_comentarios}
				</Box>
			</Box>
		</div>
	);
}

const Comentarios = ({ comentario, update, setUpdate }) => {
	const classes = useStyles();
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ expanded, setExpanded ] = useState(false);
	const [ open, setOpen ] = useState(false);
	const [ anchorEl, setAnchorEl ] = useState(null);
	const { curso } = useContext(DashboardContext);

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	/* respuestas */
	const handleExpandClick = () => setExpanded(!expanded);

	/* menu de comentario */
	const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
	const handleCloseMenu = () => setAnchorEl(null);

	/* modal de respuesta */
	const handleModal = () => setOpen(!open);

	return (
		<Box my={3} style={{padding: '0%'}}>
			<ResponderComentario
				open={open}
				handleModal={handleModal}
				comentario={comentario}
				update={update}
				setUpdate={setUpdate}
			/>
			<EditarEliminarComentario
				comentario={comentario}
				anchorEl={anchorEl}
				handleCloseMenu={handleCloseMenu}
				update={update}
				setUpdate={setUpdate}
				commentOrAnswer="comment"
			/>
			<Card className={classes.root} variant="outlined" style={{padding: '0%'}}>
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
					action={
						comentario.idUser._id === user._id ? (
							<IconButton aria-label="settings" onClick={(e) => handleClickMenu(e)}>
								<MoreVertIcon />
							</IconButton>
						) : null
					}
					/* title={`${comentario.idUser.name} ${comentario.idUser._id === curso.course.idProfessor._id
						? ('[Instructor]')
						: ''}`} */
					title={
						<Box display="flex">
							<Box mr={1}>
								<Typography>{comentario.idUser.name}</Typography>
							</Box>
							{comentario.idUser._id === curso.course.idProfessor._id ? (
								<Chip size="small" icon={<DoneIcon />} label="INSTRUCTOR" color="primary" />
							) : null}
						</Box>
					}
					subheader={formatoFechaCurso(comentario.createdAt)}
				/>
				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						{comentario.comment}
					</Typography>
				</CardContent>
				<CardActions>
					<LikesAndDislikes update={update} setUpdate={setUpdate} comentario={comentario} />
					<Hidden xsDown>
						<Button
							startIcon={<SmsOutlinedIcon />}
							color="primary"
							size="large"
							onClick={() => handleModal()}
						>
							Responder
						</Button>
						<div className={classes.grow} />
						{comentario.answers.length === 0 ? (
							<Typography>0 respuestas</Typography>
						) : comentario.answers.length === 1 ? (
							<Typography>1 respuesta</Typography>
						) : (
							<Typography>{comentario.answers.length} respuestas</Typography>
						)}
						{comentario.answers.length !== 0 ? (
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
						) : null}
					</Hidden>
					<Hidden smUp>
						<Button
							startIcon={<SmsOutlinedIcon />}
							size="large"
							onClick={() => (comentario.answers.length !== 0 ? handleExpandClick() : null)}
							aria-expanded={expanded}
							aria-label="show more"
						>
							{comentario.answers.length}
						</Button>
						<Button color="primary">Responder</Button>
					</Hidden>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					{comentario.answers.map((respuesta, index) => (
						<RespuestasComentarios
							key={index}
							comentario={comentario}
							respuesta={respuesta}
							update={update}
							setUpdate={setUpdate}
						/>
					))}
				</Collapse>
			</Card>
		</Box>
	);
};
