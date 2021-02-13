import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, CardActions, LinearProgress } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 6,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 2,
      backgroundColor: theme.palette.primary.main,
    },
  }))(LinearProgress);

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 300,
		margin: '8px 16px!important'
	},
	media: {
		height: 170
		/* paddingTop: '56.25%' // 16:9 */
	},
	title: {
		height: 70
    },
    cardContent: {
        padding: theme.spacing(1)
    }
}));

export default function CardsCursosEstudiantes({ curso }) {
	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardMedia className={classes.media} image={curso.idCourse.urlPromotionalImage} />
            <BorderLinearProgress variant="determinate" value={parseInt(curso.studentAdvance)} />
			<CardContent className={classes.cardContent}>
				<Typography variant="h6" color="textPrimary" className={classes.title}>
					{curso.idCourse.title}
				</Typography>
			</CardContent>
			<CardActions className={classes.cardContent}>
                <Button variant="text" color="primary" fullWidth component={Link} to={`/dashboard/${curso.idCourse._id}`}>
					¡Continuar con tus clases!
				</Button>
			</CardActions>
		</Card>
	);
}
