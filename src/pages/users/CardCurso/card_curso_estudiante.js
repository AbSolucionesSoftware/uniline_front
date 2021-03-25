import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, CardActions, LinearProgress } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 6
	},
	colorPrimary: {
		backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
	},
	bar: {
		borderRadius: 2,
		backgroundColor: theme.palette.primary.main
	}
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
	root: {
		cursor: 'pointer',
		width: 270,
		/* margin: '8px 16px!important' */
		[theme.breakpoints.only('sm')]: {
			width: 220
		},
		[theme.breakpoints.down('xs')]: {
			width: 160
		}
	},
	media: {
		height: 170
		/* paddingTop: '56.25%' // 16:9 */
	},
	title: {
		display: '-webkit-box',
		height: 70,
		/* lineHeight: 1.5, */
		overflow: 'hidden',
		position: 'relative',
		textOverflow: 'ellipsis',
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical'
		/* whiteSpace: 'nowrap', */
	},
	cardContent: {
		padding: theme.spacing(1)
	}
}));

function CardsCursosEstudiantes(props) {
	const { curso } = props;
	const classes = useStyles();

	return (
		<Card className={classes.root} onClick={() => props.history.push(`/dashboard/${curso.idCourse.slug}`)}>
			<CardMedia className={classes.media} image={curso.idCourse.urlPromotionalImage} />
			<BorderLinearProgress variant="determinate" value={parseInt(curso.studentAdvance)} />
			<CardContent className={classes.cardContent}>
				<Typography variant="h6" color="textPrimary" className={classes.title}>
					{curso.idCourse.title}
				</Typography>
			</CardContent>
			<CardActions className={classes.cardContent}>
				<Button
					variant="text"
					color="primary"
					fullWidth
					component={Link}
					to={`/dashboard/${curso.idCourse.slug}`}
				>
					¡Continuar con tus clases!
				</Button>
			</CardActions>
		</Card>
	);
}
export default withRouter(CardsCursosEstudiantes);
