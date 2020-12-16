import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
        type: 'light',
		primary: {
			main: '#3f51b5'
		},
		secondary: {
			main: '#f50057'
		},
		error: {
			main: '#f44336'
		},
		warning: {
			main: '#ff9800'
		},
		info: {
			main: '#2196f3'
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
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
			hint: 'rgba(0, 0, 0, 0.38)'
		},
        divider: 'rgba(0, 0, 0, 0.12)',
		background: {
			paper: '#fff',
			default: '#fafafa'
		},
		action: {
			active: 'rgba(0, 0, 0, 0.54)',
			hover: 'rgba(0, 0, 0, 0.04)',
			hoverOpacity: 0.04,
			selected: 'rgba(0, 0, 0, 0.08)',
			selectedOpacity: 0.08,
			disabled: 'rgba(0, 0, 0, 0.26)',
			disabledBackground: 'rgba(0, 0, 0, 0.12)',
			disabledOpacity: 0.38,
			focus: 'rgba(0, 0, 0, 0.12)',
			focusOpacity: 0.12,
			activatedOpacity: 0.12
		}
	}
});

export default theme;
