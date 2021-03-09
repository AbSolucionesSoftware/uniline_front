import React, { useEffect } from 'react';
import Banner from './Banner/banner';
import BannerInformartivo from './Banner_Informativo/banner_informativo';
import CursosComprados from './Cursos/cursos_estudiante';
import CursosDisponibles from './Cursos/cursos';
import { Box, Container } from '@material-ui/core';

export default function Home() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<Box>
			<Banner />
			<Container maxWidth="xl">
				<CursosComprados />
				<CursosDisponibles />
			</Container>
			<BannerInformartivo />

			{/* 
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul> */}
		</Box>
	);
}
