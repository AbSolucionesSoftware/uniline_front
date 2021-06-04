import React, { useCallback, useEffect, useState } from 'react';
import { Box, Card, Container, Dialog, Grid, Hidden, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clienteAxios from '../../../config/axios';
import SpinNormal from '../../../components/Spin/spinNormal';
import Spin from '../../../components/Spin/spin';
import Error500 from '../../error500';
import VistaCursoPanelPrincipal from './panel_principal';
import VistaCursoContenidoInfo from './contenido_info';
/* import ModalVideo from 'react-modal-video'; */
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import Vimeo from '@u-wave/react-vimeo';
import MetaTags from 'react-meta-tags';

const useStyles = makeStyles((theme) => ({
	background: {
		height: '100vh',
		width: '100vw',
		position: 'fixed',
		filter: 'blur(5px)',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover'
	},
	backgroundBlack: {
		height: '100vh',
		width: '100vw',
		position: 'fixed',
		backgroundColor: 'rgba(0,0,0, 0.4)!important' /* Black w/opacity/see-through */
	},
	root: {
		backgroundColor: theme.palette.background.paper,
		borderRadius: 4
	},
	contenedor: {
		position: 'relative',
		padding: theme.spacing(5),
		[theme.breakpoints.down('xs')]: {
			padding: theme.spacing(2)
		}
	},
	cardSticky: {
		position: 'sticky',
		top: theme.spacing(13),
		marginRight: theme.spacing(3),
		[theme.breakpoints.down('sm')]: {
			margin: 0
		}
	},
	titleResponsive: {
		backgroundColor: 'rgba(0,0,0, 0.4)!important',
		color: '#FFFFFF'
	},
	vimeoPlayer: {
		height: '65vh',
		width: '100%',
		'& iframe': {
			height: '100%',
			width: '100%',
			backgroundColor: 'rgba(0,0,0, 0.9)!important'
		},
		[theme.breakpoints.down('sm')]: {
			height: '50vh'
		},
		[theme.breakpoints.down('xs')]: {
			height: '30vh'
		}
	}
}));

export default function VistaCurso(props) {
	const classes = useStyles();
	const [ cursos, setCursos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState({ error: false, message: '' });
	const idcurso = props.match.params.url;
	const [ open, setOpen ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	const handleVideoModal = () => setOpen(!open);

	const obtenerCursosBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/course/view-course/${idcurso}`)
				.then((res) => {
					setLoading(false);
					setCursos(res.data);
				})
				.catch((err) => {
					setLoading(false);
					if (err.response) {
						setError({ error: true, message: err.response.data.message });
					} else {
						setError({ error: true, message: 'Al parecer no se a podido conectar al servidor.' });
					}
				});
		},
		[ idcurso ]
	);

	useEffect(
		() => {
			obtenerCursosBD();
			window.scrollTo(0, 0);
		},
		[ obtenerCursosBD ]
	);

	if (error.error) {
		return <Error500 error={error.message} />;
	}

	if (cursos.length === 0) {
		return <Spin loading={loading} />;
	}

	return (
		<Box>
			<MetaTags>
				<title>UNILINE</title>
				<meta id="meta-description" name="description" content={cursos.course.description} />
				<meta id="og-title" property="og:title" content={cursos.course.title} />
				<meta id="og-image" property="og:image" content={cursos.course.urlPromotionalImage} />
				<meta id="og-url" property="og:url" content={"https://uniline.online/curso/" + cursos.course.slug} />
			</MetaTags>
			<Box
				className={classes.background}
				style={{ backgroundImage: `url(${cursos.course.urlPromotionalImage})` }}
			/>
			<Box className={classes.backgroundBlack} />
			<Container className={classes.contenedor} maxWidth="lg">
				<Grid container>
					<Grid item lg={4} md={4} sm={5} xs={12}>
						<Box className={classes.cardSticky}>
							<Hidden smUp>
								<Box px={2} className={classes.titleResponsive} borderRadius={4}>
									<Typography variant="h5" style={{ fontWeight: '500' }}>
										{cursos.course.title}
									</Typography>
								</Box>
							</Hidden>
							<Card>
								{loading ? (
									<SpinNormal />
								) : (
									<VistaCursoPanelPrincipal
										curso={cursos}
										handleVideoModal={handleVideoModal}
										setSnackbar={setSnackbar}
									/>
								)}
							</Card>
						</Box>
					</Grid>
					<Grid item lg={8} md={8} sm={7} xs={12} className={classes.root}>
						{loading ? <SpinNormal /> : <VistaCursoContenidoInfo curso={cursos} />}
					</Grid>
				</Grid>
			</Container>
			{/* <ModalVideo
				channel="vimeo"
				autoplay
				isOpen={open}
				videoId={cursos.course.urlCourseVideo}
				onClose={handleVideoModal}
				callback={(e) => console.log(e)}
				
			/> */}
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Dialog onClose={handleVideoModal} open={open} fullWidth maxWidth="md">
				<Vimeo
					video={cursos.course.urlCourseVideo}
					autoplay={true}
					onEnd={() => handleVideoModal()}
					id="vimeo-player-description"
					className={classes.vimeoPlayer}
				/>
			</Dialog>
		</Box>
	);
}
