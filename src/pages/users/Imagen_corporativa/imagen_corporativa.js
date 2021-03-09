import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Hidden, Typography } from '@material-ui/core';
import Imagen from '../../../images/imagenCorporativa.png';
import ExtensionIcon from '@material-ui/icons/Extension';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import UpdateIcon from '@material-ui/icons/Update';
import Scroll from '../../../components/ScrolltoTop/scroll';

import { Parallax } from 'rc-scroll-anim';

const useStyles = makeStyles((theme) => ({
	color1: {
		backgroundColor: '#d1c4e9'
	},
	color2: {
		backgroundColor: '#c5cae9'
	},
	color3: {
		backgroundColor: '#bbdefb'
	},
	fondo: {
		zIndex: 0,
		backgroundColor: theme.palette.background.paper,
		height: '2000px',
		width: '100vw',
		position: 'absolute'
	},
	fondo2: {
		backgroundColor: theme.palette.background.paper
	}
}));

export default function ImagenCorporativa() {
	const classes = useStyles();

	return (
		<div>
            <Scroll showBelow={250} />
			<Hidden xlUp>
				<Parallax
					animation={{ x: 0, playScale: [ 1, 1.8 ] }}
					style={{ transform: 'translateX(-1940px)' }}
					className={classes.fondo}
				/>
			</Hidden>
			<Hidden lgDown>
				<Parallax
					animation={{ x: 0, playScale: [ 1, 1.8 ] }}
					style={{ transform: 'translateX(-2600px)' }}
					className={classes.fondo}
				/>
			</Hidden>
			<Box>
				<Box height="90vh">
					<img alt="imagen corporativa" width="100%" height="100%" src={Imagen} />
				</Box>

				<Box height="80vh" textAlign="center" display="flex" justifyContent="center" alignItems="center">
					<Container>
						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0, 0.6 ] }}
							style={{ transform: 'translateX(-100px)', opacity: 0 }}
						>
							<Box my={5}>
								<Typography variant="h2">Nuestro Sueño</Typography>
							</Box>
						</Parallax>

						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0.0, 0.5 ] }}
							style={{ transform: 'translateX(-100px)', opacity: 0 }}
						>
							<Box my={4}>
								<Typography variant="h5">
									Nuestro Sueño Ayudar a trabajadores, empresarios, emprendedores, profesores, alumnos
									y toda persona que quiera desarrollarse y crecer profesionalmente a través de
									nuestros cursos en línea
								</Typography>
							</Box>
						</Parallax>
					</Container>
				</Box>
				<Box
					textAlign="center"
					display="flex"
					justifyContent="center"
					alignItems="center"
					className={classes.fondo2}
				>
					<div>
						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0.0, 0.5 ] }}
							style={{ transform: 'translateX(100px)', opacity: 0 }}
						>
							<Box mb={10}>
								<Typography variant="h2">Valores</Typography>
							</Box>
						</Parallax>
						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0.0, 0.8 ] }}
							style={{ transform: 'translateX(-300px)', opacity: 0 }}
						>
							<Box m={10} p={5} boxShadow={3} width={500} borderRadius={20} className={classes.color1}>
								<Box my={2}>
									<Typography variant="h4">Coherencia</Typography>
								</Box>
								<ExtensionIcon style={{ fontSize: 100 }} />
								<Box textAlign="justify">
									<Typography variant="h6">
										Coherencia Cada curso ofrecido dentro de nuestra plataforma será por una persona
										experta en el área la cual tiene conocimientos y experiencia, la mezcla entre
										estas dos partes nos permite ofrecer cursos con un alto contenido de valor
										profesional.
									</Typography>
								</Box>
							</Box>
						</Parallax>
						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0.0, 0.8 ] }}
							style={{ transform: 'translateX(300px)', opacity: 0 }}
						>
							<Box m={10} p={5} boxShadow={3} width={500} borderRadius={20} className={classes.color2}>
								<Box my={2}>
									<Typography variant="h4">Innovación</Typography>
								</Box>
								<EmojiObjectsIcon style={{ fontSize: 100 }} />
								<Box textAlign="justify">
									<Typography variant="h6">
										Siempre en búsqueda de ofrecer la mejor experiencia hacia el usuario, en UNILINE
										nos dedicamos a crear metodologías tanto de navegación como de aprendizaje para
										ofrecer una experiencia agradable en cada segundo que nos visualices.
									</Typography>
								</Box>
							</Box>
						</Parallax>
						<Parallax
							animation={{ x: 0, opacity: 1, playScale: [ 0.0, 0.8 ] }}
							style={{ transform: 'translateX(-300px)', opacity: 0 }}
						>
							<Box m={10} p={5} boxShadow={3} width={500} borderRadius={20} className={classes.color3}>
								<Box my={2}>
									<Typography variant="h4">Actualización</Typography>
								</Box>
								<UpdateIcon style={{ fontSize: 100 }} />
								<Box textAlign="justify">
									<Typography variant="h6">
										Trabajaremos todos los días en la actualización de contenido, buscando ofrecer
										las mejores herramientas a cualquiera que tome uno de nuestros cursos, con la
										finalidad de que pueda sentir un verdadero cambio al termino de estos.
									</Typography>
								</Box>
							</Box>
						</Parallax>
					</div>
				</Box>
			</Box>
		</div>
	);
}
