import React, { useCallback, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Box, Button, Container, makeStyles, Typography } from '@material-ui/core';
import ImagenCertificado from '../../../images/certificacion.png';
import GetAppIcon from '@material-ui/icons/GetApp';
import { formatoFechaCertificado } from '../../../config/reuserFunction';
import Spin from '../../../components/Spin/spin';
import MessageSnackbar from '../../../components/Snackbar/snackbar';
import clienteAxios from '../../../config/axios';

const useStyles = makeStyles((theme) => ({
	root: {
		/* top: 0,
		left: 0, */
		zIndex: 9999,
		position: 'absolute',
		backgroundImage: `url(${ImagenCertificado})`,
		width: '297mm',
		minHeight: '210mm',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		/* border: 'solid 1px black' */
		/* display: 'none' */
	},
	nombre: {
		marginTop: theme.spacing(54),
		marginLeft: theme.spacing(61)
	},
	textoSecundario: {
		marginTop: theme.spacing(2),
		marginLeft: theme.spacing(55),
		width: 600
	},
	firma: {
		marginTop: theme.spacing(12),
		marginLeft: theme.spacing(76)
	},
	intructor: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(85)
	},
	codigo: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(126)
	}
}));

export default function GenerarCertificado(props) {
	let user = { _id: '' };
	const token = localStorage.getItem('token');
	const [ curso, setCurso ] = useState([]);
	const slugCourse = props.match.params.url;
	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	});

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCursoBD = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/course/view/${slugCourse}/user-progress/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setCurso(res.data);
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
		},
		[ slugCourse, token, setCurso, user._id ]
	);

	const printDocument = () => {
		const input = document.getElementById('divToPrint');
		html2canvas(input).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('l', 'mm', 'a4');
			const imgProps = pdf.getImageProperties(imgData);
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
			pdf.addImage(imgData, 'JPEG', -2, 0, pdfWidth, pdfHeight);
			// pdf.output('dataurlnewwindow');
			pdf.save('certificado_uniline.pdf');
		});
	};

	useEffect(
		() => {
			obtenerCursoBD();
		},
		[ obtenerCursoBD ]
	);

	if (!token || !user) {
		props.history.push('/');
	}

	if (loading) return <Spin loading={loading} />;

	if (curso.length === 0) return null;

	if (
		curso.inscriptionStudent === null ||
		user._id !== curso.inscriptionStudent.idUser ||
		!curso.inscriptionStudent
	) {
		props.history.push('/');
	}

	return (
		<Box mt={1}>
			<MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/>
			<Box display="flex" justifyContent="center" m={2}>
				<Button variant="outlined" color="primary" onClick={printDocument} startIcon={<GetAppIcon />}>
					Descargar
				</Button>
			</Box>
			<Container >
				<Certificado curso={curso} user={user} />
			</Container>
		</Box>
	);
}

const Certificado = ({ curso, user }) => {
	const classes = useStyles();

	if (!curso) {
		return null;
	}

	return (
		<div id="divToPrint" className={classes.root}>
			<div className={classes.nombre}>
				<Typography variant="h4">{user.name}</Typography>
			</div>
			<div className={classes.textoSecundario}>
				<Typography variant="h6" align="justify">
					Por haber acreditado satisfactoriamente el curso <b>"{curso.course.title}"</b> en La Escuela
					Uniline, iniciado el {formatoFechaCertificado(curso.inscriptionStudent.createdAt)} y terminado el{' '}
					{formatoFechaCertificado(curso.inscriptionStudent.endDate)}
				</Typography>
			</div>
			<div className={classes.firma}>
				<Typography variant="h5">{curso.course.idProfessor.name}</Typography>
			</div>
			<div className={classes.intructor}>
				<Typography variant="h6">Instructor del curso</Typography>
			</div>
			<div className={classes.codigo}>
				<Typography variant="button">N° {curso.inscriptionStudent.numCertificate}</Typography>
			</div>
		</div>
	);
};
