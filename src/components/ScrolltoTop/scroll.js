import React, { useEffect, useState } from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const useStyles = makeStyles((theme) => ({
	iconScroll: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
        right: theme.spacing(2)
	}
}));

export default function Scroll({showBelow}) {
	const classes = useStyles();
	const [ show, setShow ] = useState(showBelow ? false : true);

	const handleScrollToClick = () => {
		window['scrollTo']({ top: 0, behavior: 'smooth' });
	};
	const handleScrollToListener = () => {
		if (window.pageYOffset > showBelow) {
			if (!show) setShow(true);
		} else {
			if (show) setShow(false);
		}
    };

	useEffect(() => {
		if (showBelow) {
			window.addEventListener('scroll', handleScrollToListener);
			return () => window.removeEventListener('scroll', handleScrollToListener);
		}
	});

	return (
		<div>
			{show && (
				<Fab color="secondary" aria-label="up" className={classes.iconScroll} onClick={handleScrollToClick}>
					<ArrowUpwardIcon />
				</Fab>
			)}
		</div>
	);
}
