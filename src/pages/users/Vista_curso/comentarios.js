import React, { Fragment } from 'react';
import { Avatar, Box, Card, CardContent, CardHeader, Grid, makeStyles, Typography, Chip } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { formatoFechaCurso } from '../../../config/reuserFunction';
import { red } from '@material-ui/core/colors';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
	avatar: {
		backgroundColor: red[500]
	},
	respuestas: {
		marginTop: theme.spacing(2)
	}
}));

export default function ComentariosDelCurso({ comentario, curso }) {
	const classes = useStyles();

	return (
		<Fragment>
			<Card className={classes.respuestas} variant="outlined">
				<Grid container>
					<CardHeader
						avatar={
							comentario.idUser.urlImage ? (
								<Avatar aria-label="recipe" alt="imagen user" src={comentario.idUser.urlImage} />
							) : (
								<Avatar aria-label="recipe" className={classes.avatar}>
									{comentario.idUser.name.charAt(0)}
								</Avatar>
							)
						}
						/* title={`${comentario.idUser.name} ${comentario.idUser._id === curso.course.idProfessor._id
						? '[Instructor]'
						: ''}`} */
						title={
							<Box display="flex">
								<Box mr={1}>
									<Typography>{comentario.idUser.name}</Typography>
								</Box>
								{comentario.idUser._id === curso.course.idProfessor._id ? (
									<Chip size="small" icon={<DoneIcon />} label="INSTRUCTOR" color="primary" />
								) : null}
							</Box>
						}
						subheader={formatoFechaCurso(comentario.createdAt)}
					/>
					<Box display="flex" mt={2}>
						<Rating name="read-only" value={comentario.qualification} readOnly precision={0.5} />
						<Box ml={2}>
							<Typography variant="subtitle1">
								<b>{comentario.qualification}</b>
							</Typography>
						</Box>
					</Box>
				</Grid>
				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						{comentario.comment}
					</Typography>
				</CardContent>
			</Card>
		</Fragment>
	);
}
