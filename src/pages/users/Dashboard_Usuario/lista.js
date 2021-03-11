import React, { useCallback, useEffect, useState, Fragment, useContext } from 'react';
import { Menu, MenuItem, withStyles, makeStyles, Link, Grid, useTheme } from '@material-ui/core';
import { Box, Checkbox, Divider, IconButton, LinearProgress, Tooltip, Typography } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import LinkIcon from '@material-ui/icons/Link';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import clienteAxios from '../../../config/axios';
import SpinNormal from '../../../components/Spin/spinNormal';
import Error500 from '../../error500';
import { DashboardContext } from '../../../context/dashboar_context';

const useStyles = makeStyles((theme) => ({
	lista: {
		[theme.breakpoints.down('sm')]: {
			height: '45vh'
		}
	}
}));

export default function ListaContenido({ curso }) {
	const classes = useStyles();
	const [ lista, setLista ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState('');
	const { setTopics, update, progreso } = useContext(DashboardContext);
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerListaBD = useCallback(
		async () => {
			if (!user._id || !curso.course._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/course/datalist/${curso.course._id}/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setLista(res.data);

					const allTopics = [];

					res.data.forEach((block) => {
						block.topics.forEach((topic) => {
							allTopics.push(topic);
						});
					});
					setTopics(allTopics);
				})
				.catch((err) => {
					setLoading(false);
					if (err.response) {
						setError(err.response.data.message);
					} else {
						setError('Al parecer no se a podido conectar al servidor.');
					}
				});
		},
		[ token, user._id, curso.course._id, setTopics ]
	);

	useEffect(
		() => {
			obtenerListaBD();
		},
		[ obtenerListaBD, update ]
	);

	if (lista.length === 0 && !curso.endTopicView) {
		return (
			<Box minHeight="80vh" display="flex" justifyContent="center" alignItems="center">
				<Typography variant="h4">Aun no hay bloques</Typography>
			</Box>
		);
	}

	if (lista.length === 0) {
		if (loading) {
			return (
				<Box minHeight="80vh" display="flex" justifyContent="center" alignItems="center">
					<SpinNormal />
				</Box>
			);
		} else {
			return <Error500 error={error} />;
		}
	}

	const render_blocks = lista.map((bloque, index) => <ListaBloques key={index} bloque={bloque} curso={curso} />);

	return (
		<Box className={classes.lista}>
			<Box mt={2} ml={1}>
				<Typography variant="h6">Contenido del curso</Typography>
			</Box>
			<Box display="flex" alignItems="center">
				<Box width="100%" m={1}>
					<LinearProgress variant="determinate" value={parseInt(progreso)} />
				</Box>
				<Box minWidth={35}>
					<Tooltip disableFocusListener disableTouchListener title="Progreso del curso" arrow placement="top">
						<Typography variant="body2" color="textSecondary">{`${progreso}%`}</Typography>
					</Tooltip>
				</Box>
			</Box>
			<Divider />
			{render_blocks}
		</Box>
	);
}

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	/* 	width: 210,
		maxWidth: 300 */
	}
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center'
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center'
		}}
		{...props}
	/>
));

const ListaBloques = ({ bloque, curso }) => {
	const theme = useTheme();
	const block = bloque.block;
	const temas = bloque.topics;
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ open, setOpen ] = useState(false);
	const [ anchorEl, setAnchorEl ] = useState(null);
	const {
		temaActual,
		setTemaActual,
		topics,
		endTopic,
		setEndTopic,
		action,
		setAction,
		update,
		setUpdate,
		setProgreso
	} = useContext(DashboardContext);

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
	const handleCloseMenu = () => setAnchorEl(null);

	const handleClick = () => setOpen(!open);
	const handleToggle = async (value, topic) => {
		await clienteAxios
			.post(
				`/course/complete/topic/`,
				{
					idCourse: curso.course._id,
					idTopic: topic._id,
					idUser: user._id,
					public: value
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

	const ponerTemaActual = useCallback(
		(topicSelected) => {
			if (topicSelected) {
				topics.forEach((topic, index) => {
					if (topic._id === topicSelected._id) {
						setAction(1);
						setTemaActual({
							id: topics[index]._id,
							video: topics[index].keyTopicVideo,
							index: index,
							tema: topic
						});
						setEndTopic(topics.length === index + 1 ? topics[index]._id : topics[index + 1]._id);
						setOpen(true);
					}
				});
			} else {
				topics.forEach((topic, index) => {
					if (topic.topicCompleted.length > 0 && topic._id === endTopic && action === 0) {
						setAction(1);
						setTemaActual({
							id: topics.length === index + 1 ? topics[index]._id : topics[index]._id,
							video:
								topics.length === index + 1 ? topics[index].keyTopicVideo : topics[index].keyTopicVideo,
							index: topics.length === index + 1 ? index : index,
							tema: topic
						});
						setEndTopic(topics.length === index + 1 ? topics[index]._id : topics[index + 1]._id);
						setOpen(true);
					} else {
						if (topic.topicCompleted.length === 0 && topic._id === endTopic && action === 0) {
							setAction(1);
							setTemaActual({ id: topic._id, video: topic.keyTopicVideo, index: index, tema: topic });
							setEndTopic(topics.length === index + 1 ? topics[index]._id : topics[index + 1]._id);
							setOpen(true);
						}
					}
				});
			}
		},
		[ setTemaActual, topics, endTopic, setEndTopic, action, setAction ]
	);

	useEffect(
		() => {
			ponerTemaActual();
		},
		[ ponerTemaActual ]
	);

	return (
		<Fragment>
			<List>
				<ListItem button onClick={handleClick}>
					<ListItemText primary={block.blockTitle} />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{temas.map((topic, index) => {
							const labelId = `checkbox-list-secondary-label-${topic._id}`;
							return (
								<Grid container alignItems="center" key={topic._id}>
									<Grid item lg={1} xs={1}>
										<Checkbox
											edge="end"
											onClick={() =>
												topic.topicCompleted.length === 0
													? handleToggle(true, topic)
													: handleToggle(false, topic)}
											checked={topic.topicCompleted.length > 0}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</Grid>
									<Grid item lg={11} xs={11}>
										<ListItem
											button
											style={{
												backgroundColor:
													topic._id === temaActual.id
														? theme.palette.background.selected
														: null
											}}
											onClick={() => {
												ponerTemaActual(topic);
											}}
										>
											<ListItemText id={labelId} primary={topic.topicTitle} />
											{topic.resources.length > 0 ? (
												<ListItemSecondaryAction>
													<IconButton edge="end" onClick={(e) => handleClickMenu(e)}>
														<FolderOpenIcon />
													</IconButton>
												</ListItemSecondaryAction>
											) : null}
										</ListItem>
										<StyledMenu
											disableScrollLock={true}
											id={`customized-menu-${index}`}
											anchorEl={anchorEl}
											keepMounted
											open={Boolean(anchorEl)}
											onClose={handleCloseMenu}
										>
											{topic.resources.map((recurso, index) => {
												console.log(index);
												return recurso.urlExtern ? (
													<Link
														/* component="button" */
														key={index}
														target="_blank"
														rel="noopener"
														href={recurso.urlExtern}
													>
														<MenuItem dense /* component="a" */>
															<ListItemIcon>
																<LinkIcon fontSize="small" />
															</ListItemIcon>
															<ListItemText primary={recurso.title} />
														</MenuItem>
													</Link>
												) : (
													<Link
														/* component="button" */
														key={index}
														href={recurso.urlDownloadResource}
														download={recurso.title}
													>
														<MenuItem dense>
															<ListItemIcon>
																<InsertDriveFileOutlinedIcon fontSize="small" />
															</ListItemIcon>
															<ListItemText primary={recurso.title} />
														</MenuItem>
													</Link>
												);
											})}
										</StyledMenu>
									</Grid>
								</Grid>
							);
						})}
					</List>
				</Collapse>
			</List>
			<Divider />
		</Fragment>
	);
};
