import React, { useState, Fragment } from 'react';
import { makeStyles , Button, Grid, Box, Hidden, Chip } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DoneIcon from '@material-ui/icons/Done';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Link } from 'react-router-dom';


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
            alignItems: 'center',
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
		display: 'flex',
		justifyContent: 'space-evenly',
		[theme.breakpoints.up('md')]: {
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-evenly'
		}
	},
	content: {
		padding: '10px 10px 0px 10px'
	},
	cover: {
		maxWidth: '100%',
		maxHeight: '100%'
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	}
}));

export default function CursosProfesor(props) {
    const classes = useStyles();
	const [ publicado, setPublicado ] = useState(true);

	const publicacionCurso = () => {
		setPublicado(!publicado);
	};

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
									<img
										className={classes.cover}
										src="https://miro.medium.com/max/875/0*oZLL-N4dGNlBe4Oh.png"
										alt="Live from space album cover"
									/>
								</Box>
							</Grid>
							<Grid item sm={12} md={7}>
								<Box display="flex" flexDirection="column">
									<CardContent className={classes.content}>
										<Typography component="h5" variant="h5">
											React Hooks principiante a experto
										</Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            December 10, 2020
                                        </Typography>
									</CardContent>
									<div className={classes.controls}>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Ventas</Typography>
											<Typography>$200</Typography>
										</Box>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Alumnos inscritos</Typography>
											<Typography>150</Typography>
										</Box>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Calificación del curso</Typography>
											<Rating name="read-only" value={4.5} readOnly precision={0.5} />
										</Box>
									</div>
								</Box>
								<Box className={classes.chips}>
									<Chip
										color={publicado ? "primary" : "secondary"}
										label={publicado ? "Publicado" : "No publicado"}
										icon={publicado ? <DoneIcon /> : <VisibilityOffIcon />}
										style={{ marginRight: 5 }}
									/>
									<Chip variant="outlined" label="$144" icon={<AttachMoneyIcon />} />
								</Box>
							</Grid>
							<Grid item xs={12} sm={12} md={2}>
								<Hidden xsDown>
									<Box mx={1} className={classes.actions}>
										<Button
											size="small"
											color="secondary"
											variant="outlined"
											startIcon={publicado ? <DoneIcon /> : <VisibilityOffIcon />}
											onClick={publicacionCurso}
										>
											{publicado ? 'Publicado' : 'Sin publicar'}
										</Button>
										<Button color="secondary" variant="outlined" startIcon={<EditIcon />} component={Link} to="/instructor/contenido_curso/general">
											Editar
										</Button>
										<Button color="secondary" variant="outlined" startIcon={<OndemandVideoIcon />}>
											Ver curso
										</Button>
									</Box>
								</Hidden>
								<Hidden smUp>
									<Box mx={1} className={classes.actions}>
										<Button
											size="small"
											color="secondary"
											variant="outlined"
											onClick={publicacionCurso}
										>
											{publicado ? 'Publicado' : 'Sin publicar'}
										</Button>
										<Button color="secondary" variant="outlined">
											Editar
										</Button>
										<Button color="secondary" variant="outlined">
											Ver curso
										</Button>
									</Box>
								</Hidden>
							</Grid>
						</Grid>
					</Card>
				</Box>
                
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
									<img
										className={classes.cover}
										src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg"
										alt="curso de javascript"
									/>
								</Box>
							</Grid>
							<Grid item sm={12} md={7}>
								<Box display="flex" flexDirection="column">
									<CardContent className={classes.content}>
										<Typography component="h5" variant="h5">
											JavaScript, TypeScript moderno
										</Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            September 14, 2020
                                        </Typography>
									</CardContent>
									<div className={classes.controls}>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Ventas</Typography>
											<Typography>$0</Typography>
										</Box>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Alumnos inscritos</Typography>
											<Typography>0</Typography>
										</Box>
										<Box component="fieldset" borderColor="transparent">
											<Typography component="legend">Calificación del curso</Typography>
											<Rating name="read-only" value={0} readOnly precision={0.5} />
										</Box>
									</div>
								</Box>
								<Box className={classes.chips}>
                                    <Chip
										color="secondary"
										label="No publicado"
										icon={<VisibilityOffIcon />}
										style={{ marginRight: 5 }}
									/>
									<Chip variant="outlined" label="Gratis" icon={<AttachMoneyIcon />} />
								</Box>
							</Grid>
							<Grid item xs={12} sm={12} md={2}>
								<Hidden xsDown>
									<Box mx={1} className={classes.actions}>
										<Button
											size="small"
											color="secondary"
											variant="outlined"
											startIcon={<VisibilityOffIcon />}
										>
											Sin publicar
										</Button>
										<Button color="secondary" variant="outlined" startIcon={<EditIcon />}>
											Editar
										</Button>
										<Button color="secondary" variant="outlined" startIcon={<OndemandVideoIcon />}>
											Ver curso
										</Button>
									</Box>
								</Hidden>
								<Hidden smUp>
									<Box mx={1} className={classes.actions}>
										<Button
											size="small"
											color="secondary"
											variant="outlined"
											onClick={publicacionCurso}
										>
											{publicado ? 'Publicado' : 'Sin publicar'}
										</Button>
										<Button color="secondary" variant="outlined">
											Editar
										</Button>
										<Button color="secondary" variant="outlined">
											Ver curso
										</Button>
									</Box>
								</Hidden>
							</Grid>
						</Grid>
					</Card>
				</Box>
			</Grid>
		</Fragment>
	);
}
