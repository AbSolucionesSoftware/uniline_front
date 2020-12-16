import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavegacionUsuario from '../Navegacion_User/navegacion';

export default function LayoutMaestro(props) {
	const { routes } = props;

	return (
		<Fragment>
			<NavegacionUsuario />
			<div className="site-layout-background bg-white" style={{ padding: 24, minHeight: 360 }}>
				<LoadRoutes routes={routes} />
			</div>
		</Fragment>
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
