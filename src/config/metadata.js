import React from 'react'
/* import { Helmet } from 'react-helmet' */
import { HeadProvider, Title, Meta } from 'react-head';
import Imagen from '../images/inicio.jpg';

export default function Metadata({title, ogTitle, description, image, url}) {
    if(!image) image = Imagen;

    return (
        <HeadProvider>
            <Title>{title}</Title>
			<Meta property="og:title" content={ogTitle} />
			<Meta property="og:description" content={description} />
			<Meta property="og:image" content={image} />
			<Meta property="og:url" content={url} />
        </HeadProvider>
    )
}