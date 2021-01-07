import React, {Fragment }  from 'react';
import { makeStyles , Button, Grid, Box, Tooltip, Avatar, Container} from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';
    
import Rating from '@material-ui/lab/Rating';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 330,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

const useStyles = makeStyles((theme) => ({
	cardContent: {
        height: 370,
		[theme.breakpoints.down('md')]: {
			height: 'auto'
        }
    },
    imgContainer: {
        height: 130,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
		}
    },
	chips: {
		marginLeft: 5,
		[theme.breakpoints.down('md')]: {
			marginBottom: 10,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	actions: {
		display: 'flex',
		justifyContent: 'space-evenly',
		[theme.breakpoints.up('md')]: {
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-evenly'
		}
	},
	content: {
		padding: '10px 10px 0px 10px'
    },
	cover: {
		width: '100%',
		maxHeight: '100%'
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
    },
    espaciado:{
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    
}));


export default function CardCurso() {

    const classes = useStyles();

    const descriptionCurso = [
        <Fragment>
            <Typography variant="h6" color="inherit">
                React Hooks principiante a experto
            </Typography>
            <Typography className={classes.spaceTop} variant="caption text">
                Duracion del curso
            </Typography>
            <Typography className={classes.spaceTop} variant="body1">
                Descripcion del curso
            </Typography>
            <Box m={3} align="center">
            <Button variant="contained" color="primary">
                <AddShoppingCartIcon /> 
                Agregar a carrito
            </Button>
            </Box>
        </Fragment>
    ]
        

    return (
            <Fragment >
            <Container maxWidth="xl">
                <Grid item sm={2} xs={6} >
                    
                    <HtmlTooltip title={descriptionCurso} placement="right" interactive>
                        <Card className={classes.cardContent} variant="outlined">
					    <Box flexDirection="column">
							<Grid item sm={12}>
								<Box
									className={classes.imgContainer}
									display="flex"
									justifyContent="center"
									alignItems="center"
								>
									<img
										className={classes.cover}
										src="https://miro.medium.com/max/875/0*oZLL-N4dGNlBe4Oh.png"
										alt="Live from space album cover"
									/>
								</Box>
							</Grid>
							<Grid item sm={12} md={12}>
								<Box display="flex" flexDirection="column">
                                    <CardContent className={classes.content}>
                                        <Typography component="h6" variant="h6" noWrap>
                                            React Hooks principiante a experto
                                        </Typography>
                                        <Box display="flex" m={1}>
                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                            <Typography  className={classes.espaciado} variant="caption" color="textSecondary">
                                                Maestro: Brayan Antonio
                                            </Typography>
                                        </Box>
                                        
                                        <Box>
                                            <Rating name="read-only" value={4.5} readOnly precision={0.5}/>
                                        </Box>
                                        <Typography variant="h6">
                                            $2,150
                                        </Typography>
                                        <Box align="center" mb={2} mt={1}>
                                            <Button variant="contained" color="secondary">
                                                Comprar ahora
                                            </Button>
                                        </Box>
                                    </CardContent>
								</Box>
							</Grid>
					    </Box>
                        </Card>
                    </HtmlTooltip>
                </Grid>
            </Container>
            </Fragment>
    )
}
