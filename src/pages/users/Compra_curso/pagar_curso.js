import React from 'react';

export default function PagarCurso(props) {
	let user = { _id: '' };
	let token = localStorage.getItem('token');

	if (!token || !user) props.history.push('/');
	if (token !== null) user = JSON.parse(localStorage.getItem('student'));

	return (
		<div>
			Estamos PagarCurso USUARIO
		</div>
	);
}