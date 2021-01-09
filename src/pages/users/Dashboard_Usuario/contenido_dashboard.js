import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Avatar,
	Box,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
    Typography, 
    Button
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ComentariosCurso from './comentarios';

const useStyles = makeStyles((theme) => ({
	itemIcon: {
		display: 'flex',
		justifyContent: 'center'
    },
    video: {
        height: '60vh',
        [theme.breakpoints.down('sm')]: {
			height: '40vh',
		}
    },
}));

export default function ContenidoDashboard() {
	const classes = useStyles();

	return (
		<div>
			<Box className={classes.video} display="flex" justifyContent="center" alignItems="center">
				<iframe
					title="reproductor"
					width="100%"
					height="100%"
					src="https://www.youtube.com/embed/7bDLIV96LD4"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</Box>
			<Box minHeight={200}>
				<Box m={2}>
					<Grid container justify="space-between">
						<Grid item>
							<Typography variant="h6">
								{/* title */}
								React - La Guía Completa: Hooks Context Redux MERN +15 Apps
							</Typography>
						</Grid>
						<Grid item>
							{/* qualification */}
							<Rating name="read-only" value={4.5} readOnly precision={0.5} />
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box p={2}>
					<Typography variant="h5">Más información de este curso</Typography>
					<Box mt={2}>
						<Typography variant="subtitle1">
							{/* subtitle */}
							Incluye React Hooks Gatsby GraphQL Firestore Redux Context MERN Next.js Styled Components
							Testing Cypress +15 PROYECTOS!
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
													{/* level */}
													Nivel básico
												</Typography>
											</ListItem>
											<ListItem>
												<ListItemIcon className={classes.itemIcon}>
													<LanguageOutlinedIcon />
												</ListItemIcon>
												<Typography variant="subtitle1">
													{/* lenguaje */}
													Curso en Español
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
													{/* hours */}
													12 Horas de curso:
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
                                        <Button fullWidth variant="outlined" color="primary">Proyecto final</Button>
                                    </Box>
                                    <Box m={1} width={200}>
                                        <Button fullWidth variant="outlined" color="primary">Certificado</Button>
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
						<Typography>
							El único curso que enseña REACT SIN CONOCIMIENTO PREVIO HASTA LOS TEMAS MÁS AVANZADOS!
							COMPLETAMENTE REGRABADO (2020) PARA APRENDER HOOKS, CONTEXT Y REDUX, MERN, Gatsby, GraphQL,
							Testing Creando más de 15 proyectos React es una librería JavaScript desarrollada por
							Facebook para crear Interfaces Web y Aplicaciones Interactivas y con flujo de datos más
							complejo que jQuery o JavaScript. Aprender React sin duda te hará mejor desarrollador Web y
							JavaScript, es una libreria que nos permite escribir código de JavaScript Moderno hoy en
							dia. En este curso aprenderás esta librería creando múltiples proyectos del Mundo Real (Nada
							de Autenticaciones desde archivos TXT como en otros archivos, solo código del mundo real que
							te dará un trabajo) Si nunca has escrito código React pero tienes deseos de aprenderlo,
							estas en el curso adecuado, asumo que nunca has escrito una sola linea de React.
						</Typography>
					</Box>
					<Typography variant="h6">¿Qué aprenderas en este curso?</Typography>
					<Box px={5} py={2}>
						<ul>
                            <li>El curso incluye SSR, Gatsby, Nextjs, MERN, Styled Components, Context</li>
                            <li>Crear proyectos con Redux y React Redux v7 (con Hooks)</li>
                            <li>Crear Más de 15 Proyectos con React</li>
                            <li>Conocer React a fondo</li>
                            <li>Conocer que es son los Hooks y crear tus propios Hooks</li>
                            <li>Utilizar Fetch API y Axios con React para consumir API's</li>
                            <li>Integrar React con otras tecnologías JavaScript como Local Storage</li>
                            <li>Crear aplicaciones y request CRUD con React</li>
                            <li>Conocer Server Side Rendering con React con Nextjs y Gatsby</li>
                            <li>Deployment de Aplicaciones en React en Netlify, Heroku, Zeit y mucho más</li>
                            <li>Crear Proyectos en React y escribir código React que siga las buenas prácticas</li>
                            <li>Crear Proyectos con Nextjs y Gatsby</li>
                            <li>Integrar Mongo Express y Node con React</li>
                            <li>Aprender los Hooks useReducer y useContext</li>
                        </ul>
					</Box>
                    <Typography variant="h6">Requisitos para realizar este curso</Typography>
                    <Box px={5} py={2}>
						<ul>
                            <li>Si has escrito HTML, CSS y JavaScript y deseas aprender React, estas en el curso adecuado</li>
                            <li>Incluso si no has escrito Código JavaScript Moderno ( ES6+ ) el curso tiene una sección de JavaScript antes de comenzar con React</li>
                            <li>No es necesario conocimientos previos en React asumo que nunca has escrito una sola línea de React!</li>
                        </ul>
					</Box>
                    <Typography variant="h6">¿Para quién es este curso?</Typography>
                    <Box px={5} py={2}>
						<ul>
                            <li>Si ya has tomado un curso en React pero te dejo más dudas que otra cosa, este curso es para ti, iremos paso a paso introduciendo temas nuevos y cada vez más complejos</li>
                            <li>Desarrolladores y Programadores Web que desean incorporar React a sus habilidades</li>
                            <li>Desarrolladores que deseen aprender la Librería más popular para Aplicaciones Modernas con JavaScript</li>
                            <li>Si eres de las personas que aprenden más desarrollando proyectos reales, este curso es para ti, incluimos más de 15 Proyectos!</li>
                            <li>Si eres de las personas que aprenden con cursos paso a paso, escribiendo código sin prisas y sabiendo que sucede, este curso es para ti</li>
                            <li>React es una de las librerías mejor pagadas, cualquier persona que desee obtener un ingreso mayor debe tomar este curso</li>
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
