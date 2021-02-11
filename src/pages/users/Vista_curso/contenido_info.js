import React, { Fragment } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Box, Breadcrumbs, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import SchoolIcon from '@material-ui/icons/School';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LanguageIcon from '@material-ui/icons/Language';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Rating from '@material-ui/lab/Rating';
import { formatoFechaCurso } from '../../../config/reuserFunction';
import DOMPurify from 'dompurify';
import Scroll from '../../../components/ScrolltoTop/scroll';

const useStyles = makeStyles((theme) => ({
	acordionDetails: {
		padding: 0
	}
}));

export default function VistaCursoContenidoInfo({ curso }) {
	const classes = useStyles();
	return (
		<Fragment>
			<Scroll showBelow={250} />
			<Box p={5} pb={1}>
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
					<Link color="inherit" href="/">
						{curso.course.category}
					</Link>
					<Link color="inherit" href="/getting-started/installation/">
						{curso.course.subCategory}
					</Link>
				</Breadcrumbs>
				<Typography variant="h4" component="h1">
					<b>{curso.course.title}</b>
				</Typography>
				<Typography variant="h5" component="h2">
					{curso.course.subtitle}
				</Typography>
				<Box my={1}>
					<Grid container spacing={2}>
						<Grid item>
							<Rating name="read-only" value={curso.course.qualification} precision={0.5} readOnly />
						</Grid>
						<Grid item>
							<Typography>{`${curso.totalInscription} estudiantes compraron este curso`}</Typography>
						</Grid>
					</Grid>
				</Box>
				<Typography>
					{`Creado el ${formatoFechaCurso(curso.course.createdAt)} por ${curso.course.idProfessor.name}`}
				</Typography>
				<Box my={1}>
					<Grid container spacing={2}>
						<Grid item>
							<List dense>
								<ListItem>
									<ListItemIcon>{<AccessTimeIcon />}</ListItemIcon>
									<ListItemText primary={`${curso.course.hours} horas de curso`} />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<SubscriptionsIcon />}</ListItemIcon>
									<ListItemText primary={`${curso.totalTopics} temas disponibles`} />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<AllInclusiveIcon />}</ListItemIcon>
									<ListItemText primary="Acceso de por vida" />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<MobileFriendlyIcon />}</ListItemIcon>
									<ListItemText primary="Acceso desde dispositivos moviles" />
								</ListItem>
							</List>
						</Grid>
						<Grid item>
							<List dense>
								<ListItem>
									<ListItemIcon>{<SchoolIcon />}</ListItemIcon>
									<ListItemText primary="Certificado al finalizar" />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<LanguageIcon />}</ListItemIcon>
									<ListItemText primary={`Lenguaje en ${curso.course.language}`} />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<AssessmentOutlinedIcon />}</ListItemIcon>
									<ListItemText primary={`Nivel ${curso.course.level}`} />
								</ListItem>
								<ListItem>
									<ListItemIcon>{<FolderOpenOutlinedIcon />}</ListItemIcon>
									<ListItemText primary="Trabajo final" />
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box minHeight="50vh" p={5}>
				<Typography variant="h6">¿Qué aprenderas en este curso?</Typography>
				<Box px={5}>
					<ul>
						{curso.course.learnings.map((res) => {
							return (
								<li key={res._id}>
									<Typography>{res.learning}</Typography>
								</li>
							);
						})}
					</ul>
				</Box>
				<Typography variant="h6">Requisitos para realizar este curso</Typography>
				<Box px={5}>
					<ul>
						{curso.course.requirements.map((res) => {
							return (
								<li key={res._id}>
									<Typography>{res.requirement}</Typography>
								</li>
							);
						})}
					</ul>
				</Box>
				<Typography variant="h6">¿Para quién es este curso?</Typography>
				<Box px={5}>
					<ul>
						{curso.course.whoStudents.map((res) => {
							return (
								<li key={res._id}>
									<Typography>{res.whoStudent}</Typography>
								</li>
							);
						})}
					</ul>
				</Box>

				<Box my={5} textAlign="justify">
					<Typography variant="h6">Descripción del curso</Typography>
					<Typography
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(curso.course.description)
						}}
					/>
				</Box>

				<Box>
					<Box mb={2}>
						<Typography variant="h6">Contenido del curso</Typography>
					</Box>
					<Box>
						{curso.contentCourse.map((res, index) => {
							return (
								<Accordion key={index}>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Typography variant="h6">{`Bloque ${index + 1}: ${res.block
											.blockTitle}`}</Typography>
									</AccordionSummary>
									<AccordionDetails className={classes.acordionDetails}>
										<ol>
											{res.topics.map((topic) => {
												return (
													<li key={topic._id}>
														<Typography>{topic.topicTitle}</Typography>
													</li>
												);
											})}
										</ol>
									</AccordionDetails>
								</Accordion>
							);
						})}
					</Box>
				</Box>
			</Box>
		</Fragment>
	);
}
