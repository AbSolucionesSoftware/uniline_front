import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		zIndex: '99999'
	}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function MessageSnackbar({ open, mensaje, status, setSnackbar }) {
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbar({
			open: false,
			mensaje,
			status
		});
	};

	return (
		<div className={classes.root}>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				onClose={handleClose}
			>
				<Alert severity={status} onClose={handleClose}>
					{mensaje}
				</Alert>
			</Snackbar>
		</div>
	);
}
