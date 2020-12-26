import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, IconButton, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Scroll from '../../../../components/ScrolltoTop/scroll';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	color: {
		backgroundColor: theme.backgroundColor
	},
	margin: {
		margin: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	},
	addContainer: {
		'& .addButton': {
			visibility: 'hidden',
			transition: 'all .1s linear'
		},
		'&:hover .addButton': {
			visibility: 'visible',
			transition: 'all .1s linear'
		}
	}
}));

export default function RegistroContenido() {
	const classes = useStyles();
	const [ bloque, setBloque ] = useState([]);

	const [ open, setOpen ] = React.useState(false);
	const [ openNewTheme, setOpenNewTheme ] = React.useState(false);
	const [ orientacion, setOrientacion ] = useState('');
	const [ index, setIndex ] = useState(1);
	const [ datosBloque, setDatosBloque ] = useState([]);

	const handleClickOpen = (orientacion, index) => {
		if (orientacion === 'NuevoTema') {
			setOpenNewTheme(true);
			return;
		}
		setOpen(true);
		setOrientacion(orientacion);
		setIndex(index);
	};

	const handleClose = () => {
		setOpenNewTheme(false);
		setOpen(false);
	};

	const nuevoBloque = () => {
		console.log(orientacion, index);
		if (orientacion === 'up') {
			bloque.splice(index - 1, 0, { bloque: datosBloque.blockTitle });
			setBloque([ ...bloque ]);
		} else if (orientacion === 'down') {
			bloque.splice(index + 1, 0, { bloque: datosBloque.blockTitle });
			setBloque([ ...bloque ]);
		} else {
			bloque.splice(index + 1, 0, { bloque: datosBloque.blockTitle });
			setBloque([ { bloque: datosBloque.blockTitle } ]);
		}
		handleClose();
	};

	const eliminarBloque = (index) => {
		bloque.splice(index, 1);
		setBloque([ ...bloque ]);
	};

	const obtenerNombrebloque = (e) => {
		setDatosBloque({ blockTitle: e.target.value });
	};

	const renderBloques = bloque.map((bloques, index) => {
		return (
			<div key={index}>
				{index < 1 ? (
					<Box className={classes.addContainer}>
						<Button
							variant="outlined"
							color="primary"
							fullWidth
							className="addButton"
							onClick={() => handleClickOpen('up', index)}
						>
							<AddIcon style={{ fontSize: 20 }} />
						</Button>
					</Box>
				) : null}
				<Box boxShadow={2} my={2} minHeight={150}>
					<Box mx={4} display="flex">
						<Box p={1}>
							<Typography variant="h6">{`Bloque ${index + 1}: ${bloques.bloque}`}</Typography>
						</Box>
						<IconButton onClick={() => eliminarBloque(index)}>
							<EditIcon />
						</IconButton>
						<IconButton onClick={() => eliminarBloque(index)}>
							<DeleteIcon />
						</IconButton>
					</Box>
					<Box mx={5}>
						<Box m={2}>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								className="addButton"
								onClick={() => handleClickOpen('NuevoTema')}
							>
								<AddIcon style={{ fontSize: 40 }} />
							</Button>
						</Box>
					</Box>
				</Box>
				<Box className={classes.addContainer}>
					<Button
						variant="outlined"
						color="primary"
						fullWidth
						className="addButton"
						onClick={() => handleClickOpen('down', index)}
					>
						<AddIcon style={{ fontSize: 20 }} />
					</Button>
				</Box>
			</div>
		);
	});

	const modalBloque = (
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
			<DialogTitle id="form-dialog-title">Nuevo bloque</DialogTitle>
			<DialogContent>
				<DialogContentText>Escribe el nombre de tu nuevo bloque.</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="blockTitle"
					label="Nombre del bloque"
					fullWidth
					onChange={obtenerNombrebloque}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancelar
				</Button>
				<Button onClick={() => nuevoBloque()} color="primary" variant="contained">
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
	const modalTema = (
		<Dialog open={openNewTheme} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
			<DialogTitle id="form-dialog-title">Nuevo bloque</DialogTitle>
			<DialogContent>
				<Box mb={5}>
					<DialogContentText>¿Cual es el nombre de tu nuevo tema?</DialogContentText>
					<TextField autoFocus margin="dense" id="blockTitle" placeholder="Nombre del tema" fullWidth />
				</Box>
                <Box mb={5}>
					<DialogContentText>Video del tema</DialogContentText>
					<TextField autoFocus margin="dense" id="blockTitle" placeholder="Nombre del tema" fullWidth />
				</Box>
                <Box>
					<DialogContentText>¿Quieres incluir un archivo en este tema?</DialogContentText>
					<TextField autoFocus margin="dense" id="blockTitle" placeholder="Nombre del tema" fullWidth />
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancelar
				</Button>
				<Button onClick={handleClose} color="primary" variant="contained">
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);

	return (
		<Box p={5} boxShadow={5} bgcolor={classes.color}>
			<div>
				<Scroll showBelow={250} />
			</div>
			<Box mb={2}>
				<Alert severity="info">
					En este apartado podrás subir el contenido de tu curso, como bloques, temas, tareas y más.
				</Alert>
			</Box>
			<Box p={5}>
				{renderBloques.length !== 0 ? (
					renderBloques
				) : (
					<Box>
						<Button
							variant="outlined"
							color="primary"
							fullWidth
							className="addButton"
							onClick={() => handleClickOpen('nuevo', 1)}
						>
							<AddIcon style={{ fontSize: 40 }} />
						</Button>
					</Box>
				)}
			</Box>
			{modalBloque}
			{modalTema}
		</Box>
	);
}
