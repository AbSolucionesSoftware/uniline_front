import React, { Fragment } from 'react'
import Texty from 'rc-texty';
import QueueAnim from 'rc-queue-anim';
import { makeStyles, Grid, Box, Button, Hidden, Typography} from '@material-ui/core';
import Carousel from 'react-material-ui-carousel'

import Imagen from '../../../../images/Escritorio.gif';
import Celular from '../../../../images/Celular.gif';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    bannerOne:{
        backgroundColor: '#08f',
        width: '100%',
		height: 650
    },
    bannerTwo:{
        backgroundColor: '#fff',
        width: '100%',
		height: 650
    },
    imagen: {
        width: '85%',
        height: 650
    },
    tipografia:{
        color: '#fff',
        fontSize: 120,
    },
    tipografiaTwo:{
        color: '#08f',
        fontSize: 55,
    },
    buttonOne:{
        width: 'auto',
        backgroundColor: 'white',
        color: '#08f',
        fontSize: 25
    },
    buttonTwo:{
        width: 'auto',
        backgroundColor: '#08f',
        color: 'white',
        fontSize: 25
    },
    
}))


export default function Banner() {
    const classes = useStyles();

    return (
        <Fragment>
            <Grid flexDirection="column" >
            <Carousel interval={4000} indicators={false} >
                <Box className={classes.bannerOne} display="flex" >
                    <Grid sm={12} md={6} columns>
                        <QueueAnim delay={700} className="queue-simple">
                            <Box key="a" mt={13} sm={3} align="center">
                                <Texty className={classes.tipografia}> UNILINE</Texty>
                                <Box mt="2">
                                    <Typography style={{color: 'white'}} variant='h5'>
                                        Tu salón de clases está en tu casa...
                                    </Typography>
                                </Box>
                            </Box>
                            <Box key="b" mt={2} align='center'>
                                <Button variant="contained" component={Link} className={classes.buttonOne}>
                                    Ver mas...
                                </Button>
                            </Box>
                        </QueueAnim>
                    </Grid>
                    <Hidden smDown>
                        <Grid  sm={6} >
                            <QueueAnim delay={800} className="queue-simple">
                                <img key="a" alt="Escritorio animado" src={Imagen} className={classes.imagen} />
                            </QueueAnim>
                        </Grid>
                    </Hidden>
                </Box>

                <Box className={classes.bannerTwo} display="flex">
                    
                    <Hidden smDown>
                        <Grid sm={6}>
                            <Box >
                                <QueueAnim delay={900} className="queue-simple">
                                    <img key="a" alt="Celualar Animado" src={Celular} className={classes.imagen} />
                                </QueueAnim>
                            </Box>
                        </Grid>
                    </Hidden>

                    <Grid sm={12} md={7} >
                        <QueueAnim delay={700} className="queue-simple">
                            <Box key="a" mt={13} align="center">
                                <Typography variant='h6' className={classes.tipografiaTwo}>
                                    Aprende desde casa en el
                                </Typography>
                                <Typography variant='h6' className={classes.tipografiaTwo}>
                                    momento que quieras
                                </Typography>
                            </Box>
                            <Box key="b" mt={4} align='center'>
                                <Button variant="contained" component={Link} className={classes.buttonTwo}>
                                    Comenzar ahora...
                                </Button>
                            </Box>
                        </QueueAnim>
                    </Grid>
                </Box>
                
            </Carousel>
            </Grid>
        </Fragment>
    )
}
