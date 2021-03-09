import React, { createContext, useState } from 'react'

export const TemaContext = createContext();

export const TemaProvider = ({children}) => {
    const [ darkTheme, setDarkTheme ] = useState(JSON.parse(localStorage.getItem('tema')));

    return (
        <TemaContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </TemaContext.Provider>
    )
}