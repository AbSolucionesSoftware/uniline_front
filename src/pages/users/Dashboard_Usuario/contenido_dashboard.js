import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Divider, Grid, Typography, Button } from '@material-ui/core';
import { List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import DOMPurify from 'dompurify';

import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ComentariosCurso from './comentarios';
import VimeoReproductor from '../../../components/Vimeo_Reproductor/Vimeo';

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
	}
}));

export default function ContenidoDashboard({ curso }) {
	const classes = useStyles();

	console.log(curso);

	return (
		<div>
			<Box className={classes.video} display="flex" justifyContent="center" alignItems="center">
				<VimeoReproductor
					idVideo={curso.urlCourseVideo ? curso.urlCourseVideo : ''}
					width="100%"
					height="100%"
				/>
			</Box>
			<Box minHeight={200}>
				<Box m={2}>
					<Grid container justify="space-between">
						<Grid item>
							<Typography variant="h6">{curso.title ? curso.title : ''}</Typography>
						</Grid>
						<Grid item>
							<Rating
								name="read-only"
								value={curso.qualification ? curso.qualification : 0}
								readOnly
								precision={0.5}
							/>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box p={2}>
					<Typography variant="h5">Más información de este curso</Typography>
					<Box mt={2}>
						<Typography variant="subtitle1">{curso.subtitle ? curso.subtitle : ''}</Typography>
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
													{curso.level ? `Nivel: ${curso.level}` : 'Nivel: -'}
												</Typography>
											</ListItem>
											<ListItem>
												<ListItemIcon className={classes.itemIcon}>
													<LanguageOutlinedIcon />
												</ListItemIcon>
												<Typography variant="subtitle1">
													{curso.language ? `Lenguaje: ${curso.language}` : 'Lenguaje: -'}
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
												<Typography variant="subtitle1">75 clases</Typography>
											</ListItem>
											<ListItem>
												<ListItemIcon className={classes.itemIcon}>
													<QueryBuilderOutlinedIcon />
												</ListItemIcon>
												<Typography variant="subtitle1">
													{curso.hours ? `${curso.hours} horas de curso` : '0 horas de curso'}
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
								</Grid>
							</Grid>
							<Grid item>
								<Typography>Instructor</Typography>
								<Divider />
								<List dense>
									<ListItem>
										<ListItemAvatar>
											<Avatar>A</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={<Typography variant="subtitle1">Aldo Chagollan</Typography>}
											secondary={<Typography variant="subtitle2">Desarrollador web</Typography>}
										/>
									</ListItem>
								</List>
							</Grid>
							<Grid item>
								<Box display="flex" justifyContent="center" alignItems="center" height="100%">
									<div>
										<Box m={1} width={200}>
											<Button fullWidth variant="outlined" color="primary" disabled>
												Proyecto final
											</Button>
										</Box>
										<Box m={1} width={200}>
											<Button fullWidth variant="outlined" color="primary" disabled>
												Certificado
											</Button>
										</Box>
									</div>
								</Box>
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
								__html: DOMPurify.sanitize(curso.description ? curso.description : '')
							}}
						/>
					</Box>
					<Typography variant="h6">¿Qué aprenderas en este curso?</Typography>
					<Box px={5} py={2}>
						<ul>
							{curso.learnings ? (
								curso.learnings.map((res) => {
									return (
										<li key={res._id}>
											<Typography>{res.learning}</Typography>
										</li>
									);
								})
							) : null}
						</ul>
					</Box>
					<Typography variant="h6">Requisitos para realizar este curso</Typography>
					<Box px={5} py={2}>
						<ul>
							{curso.requirements ? (
								curso.requirements.map((res) => {
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
							{curso.whoStudents ? (
								curso.whoStudents.map((res) => {
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
				<ComentariosCurso />
			</Box>
		</div>
	);
}
