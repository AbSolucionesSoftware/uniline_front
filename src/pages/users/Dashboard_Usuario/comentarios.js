import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Box, Button, Hidden } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	root: {
		width: '100%'
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	},
	respuestas: {
		paddingLeft: theme.spacing(10)
	},
	container: {
		paddingTop: theme.spacing(2),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
		paddingBottom: theme.spacing(6),
		[theme.breakpoints.down('sm')]: {
			paddingLeft: 0,
			paddingRight: 0
		}
	}
}));

export default function ComentariosCurso() {
	const classes = useStyles();
	const [ expanded, setExpanded ] = React.useState(false);
	const [ open, setOpen ] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleModal = () => {
		setOpen(!open);
	};

	return (
		<Box className={classes.container}>
			<ModalRespuesta open={open} handleModal={handleModal} classes={classes} />
			<Card className={classes.root}>
				{/* user */}
				<CardHeader
					avatar={
						<Avatar aria-label="recipe" className={classes.avatar}>
							R
						</Avatar>
					}
					action={
						<IconButton aria-label="settings">
							<MoreVertIcon />
						</IconButton>
					}
					title="Shrimp and Chorizo Paella"
					subheader="September 14, 2016"
				/>
				<CardContent>
					{/* Comentario */}
					<Typography variant="body2" color="textSecondary" component="p">
						This impressive paella is a perfect party dish and a fun meal to cook together with your guests.
						Add 1 cup of frozen peas along with the mussels, if you like.
					</Typography>
				</CardContent>
				<CardActions>
					<Button aria-label="like" startIcon={<ThumbUpAltOutlinedIcon />} size="large">
						13
					</Button>
					<Button aria-label="dislike" startIcon={<ThumbDownAltOutlinedIcon />} size="large">
						2
					</Button>
					<Hidden xsDown>
						<Button
							startIcon={<SmsOutlinedIcon />}
							color="primary"
							size="large"
							onClick={() => handleModal()}
						>
							Responder
						</Button>
						<div className={classes.grow} />
						<Typography>1 respuesta</Typography>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded
							})}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
						>
							<ExpandMoreIcon />
						</IconButton>
					</Hidden>
					<Hidden smUp>
						<Button
							startIcon={<SmsOutlinedIcon />}
							size="large"
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
						>
							1
						</Button>
						<Button color="primary">Responder</Button>
					</Hidden>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					{/* respuestas */}
					<Card className={classes.respuestas}>
						{/* user */}
						<CardHeader
							avatar={
								<Avatar aria-label="recipe" className={classes.avatar}>
									R
								</Avatar>
							}
							action={
								<IconButton aria-label="settings">
									<MoreVertIcon />
								</IconButton>
							}
							title="Shrimp and Chorizo Paella"
							subheader="September 14, 2016"
						/>
						<CardContent>
							{/* Comentario */}
							<Typography variant="body2" color="textSecondary" component="p">
								This impressive paella is a perfect party dish and a fun meal to cook together with your
								guests. Add 1 cup of frozen peas along with the mussels, if you like.
							</Typography>
						</CardContent>
						<CardActions>
							<Button aria-label="like" startIcon={<ThumbUpAltOutlinedIcon />} size="large">
								1
							</Button>
							<Button aria-label="dislike" startIcon={<ThumbDownAltOutlinedIcon />} size="large">
								0
							</Button>
						</CardActions>
					</Card>
				</Collapse>
			</Card>
		</Box>
	);
}

const ModalRespuesta = ({ open, handleModal, classes }) => {
	return (
		<Dialog open={open} onClose={handleModal} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
			<DialogContent>
				<DialogContentText>Responder a:</DialogContentText>
				<Card className={classes.root}>
					{/* user */}
					<CardHeader
						avatar={
							<Avatar aria-label="recipe" className={classes.avatar}>
								R
							</Avatar>
						}
						title="Shrimp and Chorizo Paella"
						subheader="September 14, 2016"
					/>
					<CardContent>
						{/* Comentario */}
						<Typography variant="body2" color="textSecondary" component="p">
							This impressive paella is a perfect party dish and a fun meal to cook together with your
							guests. Add 1 cup of frozen peas along with the mussels, if you like.
						</Typography>
					</CardContent>
				</Card>
				<TextField
					id="outlined-multiline-static"
					label="Tu respuesta"
					margin="dense"
					autoFocus
					multiline
					fullWidth
					rows={4}
					variant="outlined"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleModal} color="primary">
					Cancelar
				</Button>
				<Button onClick={handleModal} color="primary" variant="contained">
					Enviar respuesta
				</Button>
			</DialogActions>
		</Dialog>
	);
};
