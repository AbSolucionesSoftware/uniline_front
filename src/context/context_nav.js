import React, { createContext, useState } from 'react';

export const NavContext = createContext();

export const NavProvider = ({ children }) => {
	const [ update, setUpdate ] = useState(true);
	/* const [ open, setOpen ] = useState(false); */
	const [ error, setError ] = useState({ error: false, message: '' });
	const [ carrito, setCarrito ] = useState([]);
	const [ misCursos, setMisCursos ] = useState([]);

	return (
		<NavContext.Provider
			value={{ update, setUpdate, error, setError, carrito, setCarrito, misCursos, setMisCursos }}
		>
			{children}
		</NavContext.Provider>
	);
};
