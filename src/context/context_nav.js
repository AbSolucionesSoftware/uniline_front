import React, { createContext, useState } from 'react'

export const NavContext = createContext();

export const NavProvider = ({children}) => {
    const [ update, setUpdate ] = useState(true);

    return (
        <NavContext.Provider value={{ update, setUpdate }}>
            {children}
        </NavContext.Provider>
    )
}
