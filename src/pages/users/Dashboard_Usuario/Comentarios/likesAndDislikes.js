import React, { Fragment } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import clienteAxios from '../../../../config/axios';
import { red, blue } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
	like: {
		color: blue[700]
	},
	dislike: {
		color: red[400]
	}
}));

export default function LikesAndDislikes({ update, setUpdate, comentario, respuesta }) {
	const classes = useStyles();
	const token = localStorage.getItem('token');

	const like = async () => {
		await clienteAxios
			.put(
				!respuesta
					? `/comment/${comentario._id}/like`
					: `/comment/${comentario._id}/answer/${respuesta._id}/like`,
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setUpdate(!update);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const dislike = async () => {
		await clienteAxios
			.put(
				!respuesta
					? `/comment/${comentario._id}/dislike`
					: `/comment/${comentario._id}/answer/${respuesta._id}/dislike`,
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				setUpdate(!update);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<Fragment>
			<Button
				aria-label="like"
				startIcon={<ThumbUpAltOutlinedIcon />}
				size="large"
				onClick={() => like()}
				className={
					!respuesta ? comentario.likes > 0 ? classes.like : null : respuesta.likes > 0 ? classes.like : null
				}
			>
				{!respuesta ? comentario.likes : respuesta.likes}
			</Button>
			<Button
				aria-label="dislike"
				startIcon={<ThumbDownAltOutlinedIcon />}
				size="large"
				onClick={() => dislike()}
				className={
					!respuesta ? comentario.dislikes > 0 ? (
						classes.dislike
					) : null : respuesta.dislikes > 0 ? (
						classes.dislike
					) : null
				}
			>
				{!respuesta ? comentario.dislikes : respuesta.dislikes}
			</Button>
		</Fragment>
	);
}
