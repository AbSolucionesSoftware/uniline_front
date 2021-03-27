import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, LinearProgress, Box } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 10
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
		width: 280,
		/* margin: '8px 16px!important' */
		[theme.breakpoints.only('sm')]: {
			width: 220
		},
		[theme.breakpoints.down('xs')]: {
			width: 160
		}
	},
	media: {
		height: 170,
		/* paddingTop: '56.25%' // 16:9, */
		[theme.breakpoints.down('xs')]: {
			height: 100
		}
	},
	title: {
		display: '-webkit-box',
		height: 70,
		/* lineHeight: 1.5, */
		overflow: 'hidden',
		position: 'relative',
		textOverflow: 'ellipsis',
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical',
		fontSize: 22,
		fontWeight: 500,
		/* whiteSpace: 'nowrap', */
		[theme.breakpoints.down('xs')]: {
			fontSize: 16
		}
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
			<CardContent className={classes.cardContent}>
				<Typography color="textPrimary" className={classes.title}>
					{curso.idCourse.title}
				</Typography>
			</CardContent>
			<Box px={2} pb={3}>
				<BorderLinearProgress variant="determinate" value={parseInt(curso.studentAdvance)} />
				<Typography>Avance del curso: {curso.studentAdvance}%</Typography>
			</Box>
			{/* <CardActions className={classes.cardContent}>
				<Button
					variant="text"
					color="primary"
					fullWidth
					component={Link}
					to={`/dashboard/${curso.idCourse.slug}`}
				>
					¡Continuar con tus clases!
				</Button>
			</CardActions> */}
		</Card>
	);
}
export default withRouter(CardsCursosEstudiantes);
