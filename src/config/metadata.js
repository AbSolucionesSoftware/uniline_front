import React from 'react'
import { Helmet } from 'react-helmet'
import Image from '../images/inicio.jpg';

export default function Metadata() {
    return (
        <Helmet>
            <title>UNILINE</title>
			<meta property="og:title" content="Escuela Al Revés UNILINE" />
			<meta property="og:description" content="Aprende en nuestra escuela en linea." />
			<meta property="og:image" content={Image} />
			<meta property="og:url" content="https://priceless-roentgen-d8c7ba.netlify.app" />
        </Helmet>
    )
}