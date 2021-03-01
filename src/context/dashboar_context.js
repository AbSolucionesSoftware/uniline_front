import React, { createContext, useState } from 'react';

export const DashboardContext = createContext();

export const DashProvider = ({ children }) => {
	const [ curso, setCurso ] = useState([]);
	const [ topics, setTopics ] = useState([]);
	const [ update, setUpdate ] = useState(false);
	const [ temaActual, setTemaActual ] = useState({ id: '', video: '', index: 0 });
	const [ progreso, setProgreso ] = useState(0);
    const [ endTopic, setEndTopic ] = useState('');
    const [action, setAction] = useState(0);

	return (
		<DashboardContext.Provider
			value={{
				curso,
				setCurso,
				temaActual,
				setTemaActual,
				topics,
				setTopics,
				update,
				setUpdate,
				progreso,
				setProgreso,
                endTopic, 
                setEndTopic,
                action, 
                setAction
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};
