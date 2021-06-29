import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Divider,Hidden, Grid, Typography, CircularProgress, Tab } from '@material-ui/core';
import { List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import DOMPurify from 'dompurify';
import Vimeo from '@u-wave/react-vimeo';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ComentariosCurso from './Comentarios/comentarios';
import { Fragment } from 'react';
import { DashboardContext } from '../../../context/dashboar_context';
import clienteAxios from '../../../config/axios';
import Calificacion from './calificacion';
import ProyectoFinal from './proyecto_final';
import { Tabs } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
	itemIcon: {
		display: 'flex',
		justifyContent: 'center'
	},
	video: {
		backgroundColor: '#1A1A1A',
		height: '60vh',
		[theme.breakpoints.down('sm')]: {
			height: '40vh'
		}
	},
	vimeoPlayer: {
		height: '100%',
		width: '100%',
		'& iframe': {
			height: '100%',
			width: '100%'
		}
	}
}));


export default function ContenidoDashboard({ user }) {
	const classes = useStyles();
	const token = localStorage.getItem('token');
	const { curso, temaActual, topics, update, setUpdate, setProgreso, setAction, calificado } = useContext(
		DashboardContext
	);
	const [ cursoFinalizado, setCursoFinalizado ] = useState(false);
	
	const checkTema = async (topic) => {
		setAction(0);
		await clienteAxios
			.post(
				`/course/complete/topic/`,
				{
					idCourse: curso.course._id,
					idTopic: topic,
					idUser: user._id
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setUpdate(!update);
				setProgreso(res.data.message);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const checkVideo = () => {
		topics.forEach((topic, index) => {
			if (topics.length === index + 1 && temaActual.id === topic._id) {
				setCursoFinalizado(true);
			}
		});
		checkTema(temaActual.id);
	};

	useEffect(() => {
		/* window.scrollTo(0, 0); */
	}, []);

	return (
		<div>
			{/* <Box
				id="dashboard-reproductor"
				className={classes.video}
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				{cursoFinalizado ? (
					<Box textAlign="center">
						<Typography variant="h4" style={{ color: '#FFFF' }}>
						¡En hora buena!
					</Typography>
					<Typography variant="h4" style={{ color: '#FFFF' }}>
						Haz finalizado este curso
					</Typography>
					</Box>
				) : !curso.endTopicView || temaActual.video === undefined ? (
					<Typography variant="h4" style={{ color: '#FFFF' }}>
						No hay video
					</Typography>
				) : temaActual.video === '' ? (
					<CircularProgress style={{ color: '#FFFF' }} />
				) : (
					<Vimeo
						video={temaActual.video ? temaActual.video : ''}
						autoplay={true}
						onEnd={() => checkVideo()}
						id="vimeo-player"
						className={classes.vimeoPlayer}
					/>
				)}
			</Box> */}
				<Box minHeight={200}>
					<Box m={2}>
						<Grid container justify="space-between">
							<Grid item>
								<Typography variant="h6">
									{temaActual ? temaActual.tema.topicTitle : curso.course.title ? curso.course.title : ''}
								</Typography>
							</Grid>
							<Grid item classes={classes.stars}>
								<Box display="flex" justifyContent="center">
									<Rating
										name="read-only"
										value={curso.course.qualification ? curso.course.qualification : 0}
										readOnly
										precision={0.5}
									/>
								</Box>
								{!calificado ? <Calificacion curso={curso} update={update} setUpdate={setUpdate} /> : null}
							</Grid>
						</Grid>
					</Box>
					<Divider />
					<Box p={2}>
						<Typography variant="h5">Más información de este curso</Typography>
						<Box mt={2}>
							<Typography variant="subtitle1">
								{curso.course.subtitle ? curso.course.subtitle : ''}
							</Typography>
						</Box>
						<Box mt={3}>
							<Grid container spacing={5}>
								<Grid item>
									<Typography>Informacion básica</Typography>
									<Divider />
									<Grid container spacing={2}>
										<Grid item>
											<List dense>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<InsertChartOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">
														{curso.course.level ? `Nivel: ${curso.course.level}` : 'Nivel: -'}
													</Typography>
												</ListItem>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<LanguageOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">
														{curso.course.language ? (
															`Lenguaje: ${curso.course.language}`
														) : (
															'Lenguaje: -'
														)}
													</Typography>
												</ListItem>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<SchoolOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">Certificación al finalizar</Typography>
												</ListItem>
											</List>
										</Grid>
										<Grid item>
											<List dense>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<SubscriptionsOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">
														{`${curso.totalTopics} clases`}
													</Typography>
												</ListItem>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<QueryBuilderOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">
														{curso.course.hours ? (
															`${curso.course.hours} horas de curso`
														) : (
															'0 horas de curso'
														)}
													</Typography>
												</ListItem>
												<ListItem>
													<ListItemIcon className={classes.itemIcon}>
														<FolderOutlinedIcon />
													</ListItemIcon>
													<Typography variant="subtitle1">Trabajo final</Typography>
												</ListItem>
											</List>
										</Grid>
										<Grid item lg={4}>
											<List dense>
												<ListItem>
													<ListItemAvatar>
														{curso.course.idProfessor.urlImage ? (
															<Avatar
																alt="img-maestro"
																src={curso.course.idProfessor.urlImage}
															/>
														) : (
															<Avatar>P</Avatar>
														)}
													</ListItemAvatar>
													<ListItemText
														primary={
															<Fragment>
																<Typography>Instructor</Typography>
																<Typography variant="subtitle1">
																	{curso.course.idProfessor.name ? (
																		curso.course.idProfessor.name
																	) : (
																		'-'
																	)}
																</Typography>
															</Fragment>
														}
														secondary={
															<Typography variant="subtitle2">
																{curso.course.idProfessor.profession ? (
																	curso.course.idProfessor.profession
																) : (
																	'-'
																)}
															</Typography>
														}
													/>
												</ListItem>
											</List>
										</Grid>
										<Grid item>
											<Box display="flex" justifyContent="center" alignItems="center" height="100%">
												<div>
													<ProyectoFinal curso={curso} update={update} user={user} />
												</div>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
						<Box />
					</Box>
					<Box p={2}>
						<Typography variant="h6">Descripción del curso</Typography>
						<Divider />
						<Box p={2} textAlign="justify">
							<Typography
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(curso.course.description ? curso.course.description : '')
								}}
							/>
						</Box>
						<Typography variant="h6">¿Qué aprenderás?</Typography>
						<Box px={5} py={2}>
							<ul>
								{curso.course.learnings ? (
									curso.course.learnings.map((res) => {
										return (
											<li key={res._id}>
												<Typography>{res.learning}</Typography>
											</li>
										);
									})
								) : null}
							</ul>
						</Box>
						<Typography variant="h6">Requisitos</Typography>
						<Box px={5} py={2}>
							<ul>
								{curso.course.requirements ? (
									curso.course.requirements.map((res) => {
										return (
											<li key={res._id}>
												<Typography>{res.requirement}</Typography>
											</li>
										);
									})
								) : null}
							</ul>
						</Box>
						<Typography variant="h6">¿Para quién es este curso?</Typography>
						<Box px={5} py={2}>
							<ul>
								{curso.course.whoStudents ? (
									curso.course.whoStudents.map((res) => {
										return (
											<li key={res._id}>
												<Typography>{res.whoStudent}</Typography>
											</li>
										);
									})
								) : null}
							</ul>
						</Box>
					</Box>
				</Box>
				<Divider />
				<Box minHeight={200}>
					<ComentariosCurso curso={curso} />
				</Box>
		</div>
	);
}
