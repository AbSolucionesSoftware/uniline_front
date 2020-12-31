import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import{ Grid, Box, Hidden, Typography, Button} from '@material-ui/core';

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import CallIcon from '@material-ui/icons/Call';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import HomeIcon from '@material-ui/icons/Home';

import { Link } from 'react-router-dom';

import Imagen from '../../images/uniline2.png';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appfoot: {
		backgroundColor: theme.palette.info.main
    },
    marginText: {
		marginTop: theme.spacing(1)
	},
    appSupFoot: {
		backgroundColor: theme.palette.info.light
	},
    imgContainer: {
        height: 70,
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(5)
    },
    cover: {
		maxWidth: '100%',
        maxHeight: '100%'
    }
  }));

export default function Footer() {
    const classes = useStyles();

    return (
        <div >
            <Grid container >
               
                <Grid sm={4} xs={12} >
                     <Typography className={classes.marginText} align="center" variant="subtitle1">
                        <HomeIcon style={{ fontSize: 45}}/><br/>
                        Javier Mina 450, Interior 22, 
                        Privada San Javier <br />
                        Autlan de Navarro, Jalisco, Mex. <br />
                    </Typography>
                </Grid>

                <Grid justify-sm-center sm={4} >
                    <Hidden xsDown>
                        <Box    
                            className={classes.imgContainer}
                        >
                            <img alt="Uniline" src={Imagen} className={classes.cover} />
                        </Box>
                    </Hidden>
                </Grid>

                <Grid sm={4}  xs={12} align="center"> 
                    <Typography className={classes.marginText} variant="h6" > 
                        Contactanos: <br/>
                    </Typography>
                    <Typography >
                        <MailOutlineIcon/> atencionaclientes@escuelaalreves.com <br />
                        <CallIcon /> 3171035768 <br/>
                    </Typography>
                    <Box className={classes.marginText}>
                        <FacebookIcon  style={{ fontSize: 40}}/>
                        <InstagramIcon style={{ fontSize: 40}}/>
                        <TwitterIcon style={{ fontSize: 40}}/>
                    </Box>
                </Grid>

            </Grid>
            <Grid sm={12} >

                <Typography style={{ fontSize: 13}} align="center">
                        © AB Soluciones Empresariales 2020 All rights reserved. <br />
                        <Button style={{ fontSize: 12}} component={Link} to="/politicas">
                            Políticas de Privacidad
                        </Button>
                        <Button style={{ fontSize: 12}} component={Link} to="/politicas">
                            Misión
                        </Button>
                </Typography>
                
            </Grid>
        </div>
		
    )
}
