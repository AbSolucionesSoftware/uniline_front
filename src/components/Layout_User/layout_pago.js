import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../config/themeConfig';
import darkMode from '../../config/darkMode';
import { CssBaseline } from '@material-ui/core';
import PagarCurso from '../../pages/users/Compra_curso/pagar_curso';

export default function LayoutDashboardUser(props) {
	let thema = localStorage.getItem('tema');
	let tema = JSON.parse(thema);
	/* const [ darkTheme, setDarkTheme ] = useState(tema); */

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
                <PagarCurso />
			</div>
		</ThemeProvider>
	);
}