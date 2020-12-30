import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import{ Grid, Box, Hidden, Typography, Button} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Link } from 'react-router-dom';

import Imagen from '../../images/uniline2.png';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appbar: {
		backgroundColor: theme.palette.navbar
	},
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    imgContainer: {
        height: 60,
        display: 'flex',
        justifyContent: 'center',
    },
    cover: {
		maxWidth: '100%',
        maxHeight: '100%'
    }
  }));

export default function Footer() {
    const classes = useStyles();

    return (
        <div className={classes.appbar}>
            <Grid container >
                <Grid justify-sm-center sm={4}>
                    <Hidden xsDown>
                        <Box    
                            className={classes.imgContainer}
                        >
                            <img alt="Uniline" src={Imagen} className={classes.cover} />
                        </Box>
                    </Hidden>
               
                </Grid>

                <Grid sm={4} xs={12} >
                     <Typography align="center" variant="subtitle1">
                        © AB Soluciones Empresariales 2020 All rights reserved. <br />
                        Javier Mina 450, Interior 22, 
                        Privada San Javier <br />
                        Autlan de Navarro, Jalisco <br />
                        <Button  component={Link} to="/politicas">
                            Políticas de Privacidad
                        </Button>
                    </Typography>
                </Grid>

                <Grid sm={4}  xs={12}>
                    <Typography variant="h6" align="center"> 
                        Buscanos en:
                    </Typography>
                    <Box className={classes.imgContainer}>
                        <FacebookIcon  style={{ fontSize:  50}}/>
                        <InstagramIcon style={{ fontSize:  50}}/>
                        <TwitterIcon style={{ fontSize:  50}}/>
                        {/* <img alt="Uniline" src={Imagen} className={classes.cover} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
		
    )
}
