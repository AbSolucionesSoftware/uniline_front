import { createMuiTheme } from '@material-ui/core/styles';

const darkMode = createMuiTheme({
	palette: {
		type: 'dark',
		navbar: '#424242!important',
		session: {
			main: '#D82B2B'
		},
		/* primary: {
			main: '#2196f3'
		}, */
		/* secondary: {
			main: '#666666'
		}, */
		/* error: {
			main: '#f44336'
		},
		warning: {
			main: '#ff9800'
		},
		info: {
			main: 'rgba(255, 255, 255, 0.3)'
		},
		success: {
			main: '#4caf50'
		}, */
		/* text: {
			primary: '#fff',
			secondary: 'rgba(255, 255, 255, 0.7)',
			disabled: 'rgba(255, 255, 255, 0.5)',
			hint: 'rgba(255, 255, 255, 0.5)',
			icon: 'rgba(255, 255, 255, 0.5)'
		},

		divider: 'rgba(255, 255, 255, 0.12)', */
		background: {
			paper: '#424242',
			default: '#303030',
			selected: '#303030'
		},

		/* action: {
			active: '#fff',
			hover: 'rgba(255, 255, 255, 0.08)',
			hoverOpacity: 0.08,
			selected: 'rgba(255, 255, 255, 0.16)',
			selectedOpacity: 0.16,
			disabled: 'rgba(255, 255, 255, 0.3)',
			disabledBackground: 'rgba(255, 255, 255, 0.12)',
			disabledOpacity: 0.38,
			focus: 'rgba(255, 255, 255, 0.12)',
			focusOpacity: 0.12,
			activatedOpacity: 0.24
		} */
	}
});

export default darkMode;
