import React, { Fragment } from 'react';
import { makeStyles, Button, Grid, Box, Chip } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import ImageSearchOutlinedIcon from '@material-ui/icons/ImageSearchOutlined';
import DoneIcon from '@material-ui/icons/Done';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Link } from 'react-router-dom';
import { formatoFecha } from '../../../config/reuserFunction';

const useStyles = makeStyles((theme) => ({
	cardContent: {
		height: 200,
		[theme.breakpoints.down('md')]: {
			height: 'auto'
		}
	},
	imgContainer: {
		height: 200,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('md')]: {
			height: 'auto',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}
	},
	chips: {
		marginLeft: 5,
		[theme.breakpoints.down('md')]: {
			marginBottom: 10,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	actions: {
		height: '100%',
		display: 'flex',
		justifyContent: 'space-evenly'
	},
	content: {
		padding: '10px 10px 0px 10px'
	},
	cover: {
		maxWidth: '100%',
		maxHeight: '100%'
	}
}));

export default function CursosProfesor({ curso }) {
	const classes = useStyles();

	return (
		<Fragment>
			<Grid item xs={12}>
				<Box mt={2} boxShadow={3}>
					<Card className={classes.cardContent} variant="outlined">
						<Grid container>
							<Grid item sm={12} md={3}>
								<Box
									className={classes.imgContainer}
									display="flex"
									justifyContent="center"
									alignItems="center"
								>
									{!curso.urlPromotionalImage ? (
										<Box textAlign="center">
											<Box display="flex" justifyContent="center" alignItems="center">
												<ImageSearchOutlinedIcon style={{ fontSize: 40 }} />
											</Box>
											<Typography>Este curso aun no tiene imagen</Typography>
										</Box>
									) : (
										<img
											className={classes.cover}
											src={curso.urlPromotionalImage}
											alt="imagen promocional del curso"
										/>
									)}
								</Box>
							</Grid>
							<Grid item sm={12} md={7}>
								<Box display="flex" flexDirection="column">
									<CardContent className={classes.content}>
										<Typography component="h5" variant="h5">
											{curso.title}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{formatoFecha(curso.createdAt)}
										</Typography>
									</CardContent>
									<Grid container>
										<Grid item>
											<Box component="fieldset" borderColor="transparent">
												<Typography component="legend">Ventas</Typography>
												<Typography>$0</Typography>
											</Box>
										</Grid>
										<Grid item>
											<Box component="fieldset" borderColor="transparent">
												<Typography component="legend">Alumnos inscritos</Typography>
												<Typography>0</Typography>
											</Box>
										</Grid>
										<Grid item>
											{!curso.qualification ? (
												<Box component="fieldset" borderColor="transparent">
													<Typography component="legend">Sin calificaciones</Typography>
												</Box>
											) : (
												<Box component="fieldset" borderColor="transparent">
													<Typography component="legend">1 calificaciones</Typography>
													<Rating
														name="read-only"
														value={curso.qualification}
														readOnly
														precision={0.5}
													/>
												</Box>
											)}
										</Grid>
									</Grid>
								</Box>
								<Box className={classes.chips}>
									<Chip
										color={curso.publication ? 'primary' : 'secondary'}
										label={curso.publication ? 'Publicado' : 'No publicado'}
										icon={curso.publication ? <DoneIcon /> : <VisibilityOffIcon />}
										style={{ marginRight: 5 }}
									/>
									<Chip
										variant="outlined"
										label={!curso.price ? 'Sin precio' : curso.price === 0 ? 'Gratis' : curso.price}
										icon={<AttachMoneyIcon />}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} sm={12} md={2}>
								<Box p={1} className={classes.actions}>
									<Grid container spacing={1}>
										<Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color="secondary"
												variant="outlined"
												startIcon={curso.publication ? <DoneIcon /> : <VisibilityOffIcon />}
												/* onClick={publicacionCurso} */
											>
												{curso.publication ? 'Publicado' : 'Publicar'}
											</Button>
										</Grid>
										<Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color="secondary"
												variant="outlined"
												startIcon={<EditIcon />}
												component={Link}
												to={`/instructor/contenido_curso/${curso._id}/general`}
											>
												Editar
											</Button>
										</Grid>
										<Grid item xs={12} md={12} sm={4}>
											<Button
												fullWidth
												color="secondary"
												variant="outlined"
												startIcon={<OndemandVideoIcon />}
											>
												Ver curso
											</Button>
										</Grid>
									</Grid>
								</Box>
							</Grid>
						</Grid>
					</Card>
				</Box>
			</Grid>
		</Fragment>
	);
}
