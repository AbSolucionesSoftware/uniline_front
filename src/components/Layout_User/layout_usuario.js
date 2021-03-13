import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavegacionUsuario from '../Navegacion_User/navegacion';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../config/themeConfig';
import darkMode from '../../config/darkMode';
import { CssBaseline } from '@material-ui/core';
import Footer from '../Footer/footer';
import { NavProvider } from '../../context/context_nav';

export default function LayoutUsers(props) {
	let thema = localStorage.getItem('tema');
	let tema = JSON.parse(thema);
	const { routes } = props;
	const [ darkTheme, setDarkTheme ] = useState(tema);

	useEffect(
		() => {
			if (tema === null) {
				localStorage.setItem('tema', false);
				return;
			}
		},
		[ tema ]
	);

	return (
		<ThemeProvider theme={tema === true ? darkMode : theme}>
			<CssBaseline />
			<div>
				<NavProvider>
					<NavegacionUsuario tema={[ darkTheme, setDarkTheme ]} />
					<div style={{ minHeight: '90vh' }}>
						<LoadRoutes routes={routes} />
					</div>
				</NavProvider>
				<Footer darkTheme={darkTheme } />
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
