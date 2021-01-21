import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

export default function BackDropVideo({ backdrop, loading, progress }) {
	const classes = useStyles();

	return (
		<div>
			<Backdrop className={classes.backdrop} open={backdrop}>
				{loading ? <CircularProgress variant="indeterminate" size={70} /> : null}
				{progress ? (
					<Box>
						<CircularProgressWithLabel value={progress} className={classes.progressbar} />
					</Box>
				) : null}
			</Backdrop>
		</div>
	);
}

function CircularProgressWithLabel(props) {
	return (
		<Box position="relative" display="inline-flex">
			<CircularProgress variant="determinate" size={70} {...props} />
			<Box
				top={0}
				left={0}
				bottom={0}
				right={0}
				position="absolute"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Typography component="div" color="initial" variant="h6">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}
