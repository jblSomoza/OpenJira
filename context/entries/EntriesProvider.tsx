import { FC, useReducer } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './'

export interface EntriesState {
    entries: Entry[];
}

const Entries_INITIAL_STATE : EntriesState = {
    entries: [
        {
            _id: uuidv4(),
            description: 'Pendiente: Lorem ipsum prodfaflkasfjsal;fas',
            status: 'pending',
            createAt: Date.now()
        },
        {
            _id: uuidv4(),
            description: 'En Progreso: Lorem ipsum prodfaflkasfjsal;fasasfsadf',
            status: 'in-progress',
            createAt: Date.now() - 1000000
        },
        {
            _id: uuidv4(),
            description: 'Finalizada: Lorem ipsum prodfaflkasfjsal;fasfasfasdfasfsfsf',
            status: 'finished',
            createAt: Date.now() - 100000
        },
    ]
}

interface Props {
    children : JSX.Element | JSX.Element[]
}

export const EntriesProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

    const addNewEntry = (description : string) => {
        const newEntry : Entry = {
            _id: uuidv4(),
            description: description,
            createAt: Date.now(),
            status: 'pending'
        }

        dispatch({ type: 'Entry Add-Entry', payload: newEntry });
    }

    const updateEntry = ( entry: Entry) => {
        dispatch({ type:'Entry Entry-Updated', payload: entry });
    }

    return (
        <EntriesContext.Provider value={{
             ...state,

             addNewEntry,
             updateEntry
         }}>
             { children }
        </EntriesContext.Provider>
    )
}