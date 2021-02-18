import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Badge, CircularProgress } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { NavContext } from '../../context/context_nav';
import clienteAxios from '../../config/axios';

export default function CarritoNavbar() {
	const { carrito, setCarrito, update, setMisCursos } = useContext(NavContext);
	const [ loading, setLoading ] = useState(false);
	let token = localStorage.getItem('token');
	let user = { _id: '' };

	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	const obtenerCarritoBD = useCallback(
		async () => {
			if (!user._id) return;
			setLoading(true);
			await clienteAxios
				.get(`/cart/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setCarrito(res.data);
				})
				.catch((err) => {
					setLoading(false);
				});
		},
		[ token, user._id, setCarrito ]
	);

	const obtenerMisCursos = useCallback(
		async () => {
			if (!user._id) return;
			await clienteAxios
				.get(`/course/user/${user._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setMisCursos(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ token, user._id, setMisCursos ]
	);

	useEffect(
		() => {
			obtenerCarritoBD();
			obtenerMisCursos();
		},
		[ obtenerCarritoBD, obtenerMisCursos, update ]
	);

	if (loading) {
		return (
			<Badge badgeContent={<CircularProgress color="inherit" size={12} />} color="secondary">
				<ShoppingCartIcon />
			</Badge>
		);
	}

	return (
		<Badge badgeContent={carrito.length !== 0 ? carrito.courses.length : 0} color="secondary">
			<ShoppingCartIcon />
		</Badge>
	);
}
