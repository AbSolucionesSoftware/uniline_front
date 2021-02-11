import React, { Fragment, useState } from 'react';
import { Box, CardContent, Divider, Button, TextField, Chip } from '@material-ui/core';
import { makeStyles, Typography, IconButton, CircularProgress } from '@material-ui/core';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PlayCircleFilledOutlinedIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import { formatoMexico } from '../../../config/reuserFunction';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import MessageSnackbar from '../../../components/Snackbar/snackbar';

const useStyles = makeStyles((theme) => ({
	background: {
		height: 220,
		backgroundColor: '#434343'
	},
	buttonPlay: {
		color: 'white',
		fontSize: 80
	},
	backgroundPlay: {
		height: 220,
		width: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0, 0.5)!important',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	imagen: {
		maxWidth: '100%',
		maxHeight: '100%',
		position: 'relative'
	}
}));

function VistaCursoPanelPrincipal(props) {
	const classes = useStyles();
	let token = localStorage.getItem('token');
	const { curso, handleVideoModal } = props;
	const [ cupon, setCupon ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCupon = (e) => setCupon(e.target.value);

	const canjearCupon = async () => {
		if(!token || !user._id){
			props.history.push('/mis_cursos');
			return;
		}else if(!cupon){
			return;
		}
		setLoading(true);
		await clienteAxios
			.put(
				`/course/coupon/exchange/${curso.course._id}`,
				{
					idUser: user._id,
					idCourse: curso.course._id,
					code: cupon
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setLoading(false);
				setCupon('');
				props.history.push('/mis_cursos');
			})
			.catch((err) => {
				setLoading(false);
				if (err.response) {
					setSnackbar({
						open: true,
						mensaje: err.response.data.message,
						status: 'error'
					});
				} else {
					setSnackbar({
						open: true,
						mensaje: 'Al parecer no se a podido conectar al servidor.',
						status: 'error'
					});
				}
			});
	};

	return (
		<Fragment>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box
				height="220px"
				display="flex"
				justifyContent="center"
				alignItems="center"
				className={classes.background}
			>
				<img alt="imagen del curso" src={curso.course.urlPromotionalImage} className={classes.imagen} />
				<Box className={classes.backgroundPlay}>
					<IconButton onClick={handleVideoModal}>
						<PlayCircleFilledOutlinedIcon className={classes.buttonPlay} />
					</IconButton>
				</Box>
			</Box>
			<CardContent>
				<Box>
					{curso.course.priceCourse.free ? (
						<Chip
							className={classes.free}
							label={
								<Typography variant="h6" color="textPrimary">
									¡Este curso es gratis!
								</Typography>
							}
						/>
					) : curso.course.priceCourse.promotionPrice ? (
						<Box display="flex" justifyContent="center">
							<Box mr={2}>
								<Typography variant="h5" color="textPrimary">
									<b>{formatoMexico(curso.course.priceCourse.promotionPrice)} MX$</b>
								</Typography>
							</Box>
							<Typography variant="h5" color="textSecondary">
								<s>{formatoMexico(curso.course.priceCourse.price)} MX$</s>
							</Typography>
						</Box>
					) : (
						<Typography variant="h5" color="textPrimary">
							<b>{formatoMexico(curso.course.priceCourse.price)} MX$</b>
						</Typography>
					)}
				</Box>
				<Box my={1}>
					<Button color="primary" variant="contained" fullWidth size="large">
						Comprar ahora
					</Button>
				</Box>
				<Box my={1}>
					<Button
						color="secondary"
						variant="outlined"
						fullWidth
						size="large"
						startIcon={<ShoppingCartOutlinedIcon />}
					>
						Agregar a carrito
					</Button>
				</Box>
				<Divider />
				<Box my={2}>
					<Typography variant="subtitle1" align="center" color="textSecondary">
						<b>¡Canjea tu cupón aquí!</b>
					</Typography>
					<Box display="flex" justifyContent="space-around">
						<TextField variant="outlined" label="código de cupon" size="small" onChange={obtenerCupon} />
						<Button
							variant="contained"
							color="secondary"
							endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
							onClick={() => canjearCupon()}
						>
							Canjear
						</Button>
					</Box>
				</Box>
				<Divider />
				<Box mt={2}>
					<Typography variant="subtitle1" align="center" color="textSecondary">
						<b>Comparte este curso con tus amigos</b>
					</Typography>
					<Box display="flex" justifyContent="space-around">
						<Button variant="outlined" color="primary" startIcon={<FacebookIcon />}>
							Facebook
						</Button>
						<Button variant="outlined" color="primary" startIcon={<WhatsAppIcon />}>
							WhatsApp
						</Button>
					</Box>
				</Box>
			</CardContent>
		</Fragment>
	);
}
export default withRouter(VistaCursoPanelPrincipal);
