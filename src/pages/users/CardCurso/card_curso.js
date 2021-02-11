import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Chip } from '@material-ui/core';
import { Avatar, Box, Tooltip, Button, IconButton, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { red } from '@material-ui/core/colors';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FacebookIcon from '@material-ui/icons/Facebook';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { formatoFechaCurso, formatoMexico } from '../../../config/reuserFunction';
import { Link } from 'react-router-dom';

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 330,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9'
	}
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
	root: {
		width: 300,
		margin: '8px 16px!important'
	},
	media: {
		height: 170
		/* paddingTop: '56.25%' // 16:9 */
	},
	avatar: {
		backgroundColor: red[500]
	},
	free: {
		backgroundColor: theme.palette.success.secondary
	},
	title: {
		height: 70
	},
	descripcion: {
		height: 200,
		width: '100%',
		whiteSpace: 'normal',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}
}));

export default function CardsCursos({ curso }) {
	const classes = useStyles();

	const descriptionCurso = (
		<Box>
			<Typography variant="subtitle1" color="inherit">
				{curso.title}
			</Typography>
			<Typography variant="subtitle2" color="inherit">
				{curso.subtitle}
			</Typography>
			<Typography variant="caption" color="textSecondary">
				{`nivel ${curso.level}, ${curso.hours} horas de curso, en ${curso.language}`}
			</Typography>
			<ul>
				{curso.learnings.map((learning, index) => {
					if (index + 1 > 3) {
						return null;
					}
					return (
						<li key={index}>
							<Typography variant="subtitle1">{learning.learning}</Typography>
						</li>
					);
				})}
			</ul>
			<Button variant="text" color="primary" fullWidth component={Link} to={`/curso/${curso._id}`}>
				Ver descripción completa
			</Button>
            <br/>
            <Typography align="center">¡Comparte este curso!</Typography>
            <br />
			<Box display="flex" justifyContent="space-around">
				<Button variant="outlined" color="primary" startIcon={<FacebookIcon />}>
					Facebook
				</Button>
                <Button variant="outlined" color="primary" startIcon={<WhatsAppIcon />}>
					WhatsApp
				</Button>
			</Box>
		</Box>
	);

	return (
		<HtmlTooltip title={descriptionCurso} placement="right" interactive>
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
										{formatoMexico(curso.priceCourse.promotionPrice)} MX$
									</Typography>
								</Box>
								<Typography variant="h6" color="textSecondary">
									<s>{formatoMexico(curso.priceCourse.price)} MX$</s>
								</Typography>
							</Box>
						) : (
							<Typography variant="h6" color="textPrimary">
								<b>{formatoMexico(curso.priceCourse.price)} MX$</b>
							</Typography>
						)}
					</Box>
				</CardContent>
				<CardActions>
					<Box>
						<Button variant="text" color="primary" fullWidth component={Link} to={`/curso/${curso._id}`}>
							Ver descripción completa
						</Button>
						<Button variant="contained" color="primary">
							Comprar ahora
						</Button>
						<IconButton variant="contained" color="secondary">
							<AddShoppingCartIcon />
						</IconButton>
					</Box>
				</CardActions>
			</Card>
		</HtmlTooltip>
	);
}
