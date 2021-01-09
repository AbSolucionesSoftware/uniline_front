import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Box,
	Checkbox,
	Divider,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Tooltip,
	Typography
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

const useStyles = makeStyles((theme) => ({
	lista: {
		[theme.breakpoints.down('sm')]: {
			height: '45vh',
		}
	}
}));

export default function ListaContenido() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(true);
	const [ checked, setChecked ] = React.useState([ 0 ]);

	const handleClick = () => {
		setOpen(!open);
	};

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [ ...checked ];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	return (
		<Box className={classes.lista}>
			<Box mt={2} ml={1}>
				<Typography variant="h6">Contenido del curso</Typography>
			</Box>
			<Box display="flex" alignItems="center">
				<Box width="100%" m={1}>
					<LinearProgress variant="determinate" value={40} />
				</Box>
				<Box minWidth={35}>
					<Tooltip disableFocusListener disableTouchListener title="Progreso del curso" arrow placement="top">
						<Typography variant="body2" color="textSecondary">{`${Math.round(40)}%`}</Typography>
					</Tooltip>
				</Box>
			</Box>
			<Divider />
			<List>
				<ListItem button onClick={handleClick} >
					<ListItemText primary="Introduccion" />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List dense component="div" disablePadding>
						{[ 0, 1, 2, 3 ].map((value) => {
							const labelId = `checkbox-list-secondary-label-${value}`;
							return (
								<ListItem key={value} button>
									<ListItemIcon>
										<Checkbox
											edge="end"
											onChange={handleToggle(value)}
											checked={checked.indexOf(value) !== -1}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={`Line item ${value + 1}`} />
									<ListItemSecondaryAction>
										<IconButton edge="end">
											<InsertDriveFileOutlinedIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Collapse>
			</List>
			<Divider />
			<List>
				<ListItem button onClick={handleClick} >
					<ListItemText primary="Introduccion" />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List dense component="div" disablePadding>
						{[ 0, 1, 2, 3 ].map((value) => {
							const labelId = `checkbox-list-secondary-label-${value}`;
							return (
								<ListItem key={value} button>
									<ListItemIcon>
										<Checkbox
											edge="end"
											onChange={handleToggle(value)}
											checked={checked.indexOf(value) !== -1}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={`Line item ${value + 1}`} />
									<ListItemSecondaryAction>
										<IconButton edge="end">
											<InsertDriveFileOutlinedIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Collapse>
			</List>
			<Divider />
			<List>
				<ListItem button onClick={handleClick} >
					<ListItemText primary="Introduccion" />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List dense component="div" disablePadding>
						{[ 0, 1, 2, 3 ].map((value) => {
							const labelId = `checkbox-list-secondary-label-${value}`;
							return (
								<ListItem key={value} button>
									<ListItemIcon>
										<Checkbox
											edge="end"
											onChange={handleToggle(value)}
											checked={checked.indexOf(value) !== -1}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={`Line item ${value + 1}`} />
									<ListItemSecondaryAction>
										<IconButton edge="end">
											<InsertDriveFileOutlinedIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Collapse>
			</List>
			<Divider />
		</Box>
	);
}
