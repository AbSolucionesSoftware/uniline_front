import React from 'react';
/* import { Helmet } from 'react-helmet' */
import { HeadProvider, Title, Link, Meta } from 'react-head';
import Imagen from '../images/inicio.jpg';

export default function Metadata({ title, ogTitle, description, image, url }) {
	if (!image) image = Imagen;

	const meta = {
		title: title,
		description: 'Aprende en nuestra escuela en linea.',
		meta: {
			charset: 'utf-8',
			name: {
				keywords: 'react,meta,document,html,tags'
			}
		}
	};
	return (
		<HeadProvider>
			{/* <Title>{title}</Title>
			<Meta charset="utf-8" />
			<Link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
			<Meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta name="theme-color" content="#000000" />
			<Link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
			<Link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

			<Meta property="og:title" content={ogTitle} />
			<Meta property="og:description" content={description} />
			<Meta property="og:image" content={image} />
			<Meta property="og:url" content={url} /> */}
		</HeadProvider>
	);
}
