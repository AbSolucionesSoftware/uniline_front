import React from 'react';
import Banner from './Banner/banner';
import BannerInformartivo from './Banner_Informativo/banner_informativo';
import CursosComprados from './Cursos/cursos_estudiante';
import CursosDisponibles from './Cursos/cursos';
import { Box } from '@material-ui/core';

export default function Home() {

	return (
		<Box>
			<Banner />
			<CursosComprados />
			<CursosDisponibles />
			<BannerInformartivo />
				
			{/* 
			<ul>
				<Link to="/busqueda/algo">resultado busqueda</Link>
			</ul>
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul> */}
		</Box>
	);
}