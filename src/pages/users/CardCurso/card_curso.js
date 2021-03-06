import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Chip,
	CircularProgress,
	Dialog
} from '@material-ui/core';
import { Avatar, Box, Button, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { red } from '@material-ui/core/colors';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { formatoFechaCurso, formatoMexico } from '../../../config/reuserFunction';
import { Link, withRouter } from 'react-router-dom';
import WarningIcon from '@material-ui/icons/Warning';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import { NavContext } from '../../../context/context_nav';
import { AgregarCarritoBD } from '../PeticionesCompras/peticiones_compras';
import RegistroAlterno from '../RegistroAlterno/registro_alterno';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
	root: {
		width: 300,
		minHeight: 512,
		margin: '8px 16px!important'
	},
	media: {
		height: 170
	},
	avatar: {
		backgroundColor: red[500]
	},
	free: {
		backgroundColor: theme.palette.success.secondary
	},
	title: {
		display: '-webkit-box',
		height: 70,
		overflow: 'hidden',
		position: 'relative',
		textOverflow: 'ellipsis',
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical'
	},
	descripcion: {
		height: 200,
		width: '100%',
		whiteSpace: 'normal',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}
}));

function CardsCursos(props) {
	const classes = useStyles();
	const { curso } = props;
	let token = localStorage.getItem('token');
	const [ loading, setLoading ] = useState(false);
	const [ open, setOpen ] = useState(false);
	const { error, setError, update, setUpdate, carrito, misCursos } = useContext(NavContext);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	const urlActual = props.match.url;
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const handleModal = () => setOpen(!open);

	const agregarCarrito = async (curso) => {
		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('cart', JSON.stringify({ curso, urlActual }));
			return;
		}

		const result = await AgregarCarritoBD(token, user, curso);
		setLoading(true);
		if (result.status && result.status === 200) {
			setLoading(false);
			setUpdate(!update);
			setSnackbar({
				open: true,
				mensaje: result.data.message,
				status: 'success'
			});
		} else {
			setLoading(false);
			if (result.response) {
				setSnackbar({
					open: true,
					mensaje: result.response.data.message,
					status: 'error'
				});
			} else {
				setSnackbar({
					open: true,
					mensaje: 'Al parecer no se a podido conectar al servidor.',
					status: 'error'
				});
			}
		}
	};

	const adquirirCursoGratis = (curso) => {
		console.log('curso gratis');
	};

	const pagarCurso = (curso) => {
		let cursos = [];

		if (curso.priceCourse.promotionPrice) {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: curso.priceCourse.promotionPrice,
				persentagePromotion: curso.priceCourse.persentagePromotion,
				idCourse: curso,
				promotion: true
			});
		} else {
			cursos.push({
				priceCourse: curso.priceCourse.price,
				pricePromotionCourse: 0,
				persentagePromotion: '',
				idCourse: curso,
				promotion: false
			});
		}

		if (!token || !user._id) {
			handleModal();
			localStorage.setItem('buy', JSON.stringify({ curso: cursos, urlActual }));
			return;
		}

		localStorage.setItem(
			'payment',
			JSON.stringify({
				user: user,
				courses: cursos
			})
		);
		setTimeout(() => {
			props.history.push(`/compra/${curso.slug}`);
		}, 500);
	};

	/* verificar si esta en carrito */
	let cart = false;
	if (carrito && carrito.courses) {
		carrito.courses.forEach((res) => {
			if (res.course._id === curso._id) cart = true;
		});
	}
	/* verificar si ya tiene el curso */
	let course = false;
	if (misCursos) {
		misCursos.forEach((res) => {
			if (res.idCourse._id === curso._id) {
				course = true;
			}
			return;
		});
	}

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Card className={classes.root}>
				<CardHeader
					avatar={
						curso.idProfessor.urlImage ? (
							<Avatar aria-label="recipe" className={classes.avatar} src={curso.idProfessor.urlImage} />
						) : (
							<Avatar aria-label="recipe" className={classes.avatar}>
								{curso.idProfessor.name.charAt(0)}
							</Avatar>
						)
					}
					title={curso.idProfessor.name}
					subheader={`Creado el ${formatoFechaCurso(curso.createdAt)}`}
				/>
				<CardMedia className={classes.media} image={curso.urlPromotionalImage} />
				<CardContent>
					<Typography variant="h6" color="textPrimary" className={classes.title}>
						{curso.title}
					</Typography>
					<Rating name="read-only" value={curso.qualification} precision={0.5} readOnly />
					<Box>
						{curso.priceCourse.free ? (
							<Chip
								className={classes.free}
								label={
									<Typography variant="h6" color="textPrimary">
										¡Gratis!
									</Typography>
								}
							/>
						) : curso.priceCourse.promotionPrice ? (
							<Box display="flex">
								<Box mr={2}>
									<Typography variant="h6" color="textPrimary">
										{formatoMexico(curso.priceCourse.promotionPrice)} MXN$
									</Typography>
								</Box>
								<Typography variant="h6" color="textSecondary">
									<s>{formatoMexico(curso.priceCourse.price)} MXN$</s>
								</Typography>
							</Box>
						) : (
							<Typography variant="h6" color="textPrimary">
								<b>{formatoMexico(curso.priceCourse.price)} MXN$</b>
							</Typography>
						)}
					</Box>
				</CardContent>
				<CardActions>
					<Box width="100%">
						<Button variant="text" color="primary" fullWidth component={Link} to={`/curso/${curso.slug}`}>
							Ver descripción completa
						</Button>
						{course ? (
							<Box display="flex" justifyContent="space-around" alignItems="center">
								<Button
									fullWidth
									variant="contained"
									color="primary"
									component={Link}
									to={`/dashboard/${curso.slug}`}
								>
									Ver curso
								</Button>
							</Box>
						) : (
							<Box display="flex" justifyContent="space-around" alignItems="center">
								{curso.priceCourse.free ? (
									<Button
										variant="contained"
										color="primary"
										onClick={() => adquirirCursoGratis(curso)}
										fullWidth
									>
										¡Adquirir ahora!
									</Button>
								) : (
									<Button variant="contained" color="primary" onClick={() => pagarCurso(curso)}>
										Comprar ahora
									</Button>
								)}
								{curso.priceCourse.free ? null : loading ? (
									<CircularProgress color="secondary" size={30} />
								) : cart ? (
									<Button color="secondary" size="large">
										<ShoppingCartOutlinedIcon />
										<ArrowForwardIcon />
									</Button>
								) : (
									<Button color="secondary" onClick={() => agregarCarrito(curso)} size="large">
										<ShoppingCartOutlinedIcon style={{ fontSize: 25 }} />
									</Button>
								)}
							</Box>
						)}
					</Box>
				</CardActions>
				<ModalRegistro handleModal={handleModal} open={open} error={error} setError={setError} />
			</Card>
		</Fragment>
	);
}
const ModalRegistro = ({ handleModal, open, error, setError }) => {
	const handleClose = () => {
		handleModal();
		localStorage.removeItem('coupon');
		localStorage.removeItem('cart');
		setError({ error: false, message: '' });
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth>
			{!error.error ? (
				<RegistroAlterno />
			) : error.message.response ? (
				<Box m={5} display="flex" alignItems="center">
					<WarningIcon style={{ fontSize: 70, marginRight: 10 }} color="error" />
					<Box>
						<Typography variant="h6">Lo sentimos</Typography>
						<Typography variant="h5">{error.message.response.data.message}</Typography>
					</Box>
				</Box>
			) : (
				<div>hubo un error desconocido</div>
			)}
		</Dialog>
	);
};

export default withRouter(CardsCursos);
