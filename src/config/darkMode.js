import { createMuiTheme } from '@material-ui/core/styles';

const darkMode = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#303030'
		},
		secondary: {
			main: '#424242'
		},
		error: {
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
		},
		grey: {
			50: '#fafafa',
			100: '#f5f5f5',
			200: '#eeeeee',
			300: '#e0e0e0',
			400: '#bdbdbd',
			500: '#9e9e9e',
			600: '#757575',
			700: '#616161',
			800: '#424242',
			900: '#212121',
			A100: '#d5d5d5',
			A200: '#aaaaaa',
			A400: '#303030',
			A700: '#616161'
		},
		text: {
			primary: '#fff',
			secondary: 'rgba(255, 255, 255, 0.7)',
			disabled: 'rgba(255, 255, 255, 0.5)',
			hint: 'rgba(255, 255, 255, 0.5)',
			icon: 'rgba(255, 255, 255, 0.5)'
		},

		divider: 'rgba(255, 255, 255, 0.12)',
		background: {
			paper: '#424242',
			default: '#303030'
		},

		action: {
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
		}
	}
});

export default darkMode;
