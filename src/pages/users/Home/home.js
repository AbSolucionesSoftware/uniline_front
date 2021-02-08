import React from 'react';
import { Container, Grid, Box} from '@material-ui/core';

import CardCurso from './Card_cursos/cardCurso';
import Banner from './Banner/banner';
import BannerInformartivo from './Banner_Informativo/banner_informativo';




export default function Home() {

	return (
		<Grid>
			<Banner />
			<Container maxWidth="xl">				
					<Box mt={3}>
						<CardCurso />
					</Box>
			</Container>
			<Grid>
				<BannerInformartivo />
			</Grid>
				
			{/* <ul>
				<Link to="/">Home user</Link>
			</ul>
			<ul>
				<Link to="/busqueda/algo">resultado busqueda</Link>
			</ul>
			<ul>
				<Link to="/compra">pagar curso</Link>
			</ul>
			<ul>
				<Link to="/dashboard/algo">dashboard usuario</Link>
			</ul>
			<ul>
				<Link to="/curso/algo">curso</Link>
			</ul>
			##### links maestro ####
			<ul>
				<Link to="/instructor/cursos">dashboard maestro</Link>
			</ul>
			<ul>
				{' '}
				<Link to="/instructor/nuevo_curso">subiur curso</Link>
			</ul>
			<ul>
				<Link to="/instructor/contenido_curso">contendio curso</Link>
			</ul> */}
		</Grid>
	);
}
