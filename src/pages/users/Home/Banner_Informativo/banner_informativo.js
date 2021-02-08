import React from 'react'
import { Grid, makeStyles, Box, Container, Typography } from '@material-ui/core'

import imagen from '../../../../images/SchoolHome.gif';
import blog from '../../../../images/Blog.png';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
    color:{
        backgroundColor: "white"
    },
    imagen:{
        width: "90%",
        height: "100%"
    },
    titulos:{
        fontWeight: 'bold'
    },
    vinetas:{
        color: '#08f',
        fontSize: 30
    }

}))

export default function BannerInformativo() {

    const classes = useStyles();

    return (
        <div>
            <Grid className={classes.color}>
            <Container maxWidth="lg">
                <Grid>
                    <Box mt={5}>
                        <Typography align="center" variant="h3" className={classes.titulos}>
                            Uniline, una escuela que nunca para...
                        </Typography>
                    </Box>
                </Grid>
                <Grid container>
                    <Grid item sm={6} xs={6} align="center">
                        <img alt="Personal animado" src={imagen} />
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <Box mt={10}>
                            <Typography variant="h5" className={classes.titulos}>
                                <FiberManualRecordIcon className={classes.vinetas} />
                                Clases desde casa
                            </Typography>
                            <Box ml={4} mt={2}>
                                <Typography variant="h5">
                                    Aprende de la mejor manera, con la mejor comodidad, desde tu casa.
                                </Typography>
                            </Box>

                            <Box mt={4}>
                                <Typography variant="h5" className={classes.titulos}>
                                    <FiberManualRecordIcon className={classes.vinetas} /> 
                                    Consiso y claro
                                </Typography>
                            </Box>
                            <Box ml={4} mt={2}>
                                <Typography variant="h5">
                                    Las mejores explicaciones, lo mas claro posible y no queden dudas.
                                </Typography> 
                            </Box>   
                        </Box>              
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item sm={6} xs={6}>
                        <Box mt={3}>
                            <Typography variant="h5" className={classes.titulos}>
                                <FiberManualRecordIcon className={classes.vinetas} /> 
                                Blogs
                            </Typography>
                            <Box ml={4} mt={2}>
                                <Typography variant="h5">
                                    Tener la facilidad de calificar tus cursos, dar comentarios de estos y resolver todas tus dudas.
                                </Typography> 
                            </Box>
                            
                            <Box mt={4}>
                                <Typography variant="h5" className={classes.titulos}>
                                    <FiberManualRecordIcon className={classes.vinetas} /> 
                                    Audio y Video
                                </Typography>
                            </Box>
                            <Box ml={4} mt={2}>
                                <Typography variant="h5">
                                    El mejor audio y video en nuestros cursos, la mayor calidad para nuestros alumnos.
                                </Typography> 
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={6} xs={6} align="center">
                        <img alt="Blog animado" src={blog} className={classes.imagen} />
                    </Grid>
                </Grid>
            </Container>
            </Grid>
        </div>
    )
}