import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div>
			Home
			<Button variant="contained" color="primary">
				Hola Mundo!
			</Button>
			<ul>
				<Link to="/">Home user</Link>
			</ul>
			<ul>
				<Link to="/busqueda/algo">resultado busqueda</Link>
			</ul>
			<ul>
				<Link to="/carrito">carrito</Link>
			</ul>
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul>
			<ul>
				<Link to="/mis_cursos">mis cursos</Link>
			</ul>
			<ul>
				<Link to="/dashboard/algo">dashboard usuario</Link>
			</ul>
			<ul>
				<Link to="/perfil">perfil</Link>
			</ul>
			<ul>
				<Link to="/politicas">politicas</Link>
			</ul>
			<ul>
				<Link to="/login">login</Link>
			</ul>
			<ul>
				<Link to="/curso/algo">curso</Link>
			</ul>
			##### links maestro ####
			<ul>
				<Link to="/instructor/dashboard">dashboard maestro</Link>
			</ul>
			<ul>
				{' '}
				<Link to="/instructor/dashboard/contenido_curso">subiur curso</Link>
			</ul>
			<ul>
				<Link to="/instructor/dashboard/costo_curso">precios y promociones</Link>
			</ul>
		</div>
	);
}
