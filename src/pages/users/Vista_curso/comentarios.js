import React, { Fragment } from 'react';
import { Avatar, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import { formatoFechaCurso } from '../../../config/reuserFunction';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	avatar: {
		backgroundColor: red[500]
	},
	respuestas: {
		marginTop: theme.spacing(2)
	}
}));

export default function ComentariosDelCurso({comentario, curso}) {
    const classes = useStyles();

	return (
		<Fragment>
			<Card className={classes.respuestas} variant="outlined">
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
					title={`${comentario.idUser.name} ${comentario.idUser._id === curso.course.idProfessor._id
						? '[Instructor]'
						: ''}`}
					subheader={formatoFechaCurso(comentario.createdAt)}
				/>
				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						{comentario.comment}
					</Typography>
				</CardContent>
			</Card>
		</Fragment>
	);
}
