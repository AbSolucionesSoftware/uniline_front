import React, { createContext, useState } from 'react';

export const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
	const [ datos, setDatos ] = useState([]);
	const [ update, setUpdate ] = useState(true);
	const [ preview, setPreview ] = useState(null);

	return (
		<CursoContext.Provider value={{ datos, setDatos, update, setUpdate, preview, setPreview }}>
			{children}
		</CursoContext.Provider>
	);
};
