import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import { Helmet } from 'react-helmet';
import './styles.scss';
import Image from '../src/images/inicio.jpg';

{
	/* <meta charSet="utf-8" />
				<title>UNILINE</title>
				<meta property="og:title" content="Escuela Al Revés UNILINE" />
				<meta property="og:description" content="Aprende en nuestra escuela en linea." />
				<meta property="og:image" content={Image} />
				<meta property="og:url" content="https://priceless-roentgen-d8c7ba.netlify.app" /> */
}

function App() {
	return (
		<div className="App">
			<Helmet
				title="UNILINE"
				meta={[
					{ property: 'og:title', content: "Escuela Al Revés UNILINE" },
					{ property: 'og:type', content: 'website' },
					{ property: 'og:url', content: "https://priceless-roentgen-d8c7ba.netlify.app"},
					{ property: 'og:description', content: "Aprende en nuestra escuela en linea." },
					{ property: 'og:image', content: Image},

					{ name: 'viewport', content: 'width=device-width, maximum-scale=1' },
				]}
			/>
			<Router>
				<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
			</Router>
		</div>
	);
}

function RoutesWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => <route.component routes={route.routes} {...props} />}
		/>
	);
}

export default App;
