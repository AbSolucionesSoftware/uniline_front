import React, { Fragment } from 'react';

export default function Vimeo({ idVideo, width, height }) {
	return (
		<Fragment>
			<iframe
				title="reproductorVimeo"
				className="iframe-responsivo"
				src={`https://player.vimeo.com/video/${idVideo}`}
				width={width}
				height={height}
				frameBorder="0"
				allow="autoplay; fullscreen"
				allowFullScreen=""
			/>
		</Fragment>
	);
}
