import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavbarMaestro from '../Navegacion_maestro/navegacion_maestro';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../config/themeConfig';
import darkMode from '../../config/darkMode';
/* import Sesion from '../Verificacion_sesion/verificacion_sesion'; */

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}));

export default function LayoutMaestro(props) {
	const { routes } = props;
	const classes = useStyles();
	let thema = localStorage.getItem('tema');
	let tema = JSON.parse(thema)
	const [ darkTheme, setDarkTheme ] = useState(tema);

	useEffect(() => {
		if(tema === null){
			localStorage.setItem('tema', false);
			return;
		}
	}, [tema]);

	useEffect(() => {
		//Sesion(props);
	}, [props])

	return (
		<ThemeProvider theme={tema === true ? darkMode : theme}>
			<CssBaseline />
			<div className={classes.root}>
				<NavbarMaestro tema={[ darkTheme ,setDarkTheme]} />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<div className="site-layout-background bg-white" style={{ padding: 24, minHeight: 360 }}>
						<LoadRoutes routes={routes} />
					</div>
				</main>
			</div>
		</ThemeProvider>
		
	);
}

function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} exact={route.exact} component={route.component} />
			))}
		</Switch>
	);
}
