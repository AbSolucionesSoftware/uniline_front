import React, { useEffect } from 'react';
import Banner from './Banner/banner';
import BannerInformartivo from './Banner_Informativo/banner_informativo';
import CursosComprados from './Cursos/cursos_estudiante';
import CursosDisponibles from './Cursos/cursos';
import { Box } from '@material-ui/core';
/* import Metadata from '../../../config/metadata'; */
/* import DocumentMeta from 'react-document-meta'; */
import MetaTags from 'react-meta-tags';
import Imagen from '../../../images/inicio.jpg';

export default function Home() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	/* const meta = {
		title: 'uniline',
		description: 'Aprende en nuestra escuela en linea.',
		meta: {
			charset: 'utf-8',
			name: {
				keywords: 'react,meta,document,html,tags'
			},
			property: {
				'og:title': 'uni',
				'og:description': 'hoa hoa',
				'og:image': Imagen,
				'og:url': 'https://priceless-roentgen-d8c7ba.netlify.app/'
			},
		}
	}; */

	return (
		<Box>
			<MetaTags>
            <title>uniLine</title>
            <meta name="description" content="Aprende en nuestra escuela en linea." />
            <meta property="og:title" content="Escuela Al Revés UNILINE" />
            <meta property="og:image" content={Imagen} />
			<meta property="og:url" content="https://priceless-roentgen-d8c7ba.netlify.app" />
          </MetaTags>
			{/* <Metadata
				title="UNILINE"
				ogTitle="Escuela Al Revés UNILINE"
				description="Aprende en nuestra escuela en linea."
				url="https://priceless-roentgen-d8c7ba.netlify.app"
			/>*/}
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
