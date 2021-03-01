import React, { useEffect } from 'react';
import Banner from './Banner/banner';
import BannerInformartivo from './Banner_Informativo/banner_informativo';
import CursosComprados from './Cursos/cursos_estudiante';
import CursosDisponibles from './Cursos/cursos';
import { Box } from '@material-ui/core';
import Metadata from '../../../config/metadata';

export default function Home() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<Box>
			<Metadata
				title="UNILINE"
				ogTitle="Escuela Al Revés UNILINE"
				description="Aprende en nuestra escuela en linea."
				url="https://priceless-roentgen-d8c7ba.netlify.app"
			/>
			<Banner />
			<CursosComprados />
			<CursosDisponibles />
			<BannerInformartivo />

			{/* 
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul> */}
		</Box>
	);
}
