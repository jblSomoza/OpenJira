import { FC, useEffect, useReducer } from 'react';

import { entrieApi } from '../../apis';

import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './'

export interface EntriesState {
    entries: Entry[];
}

const Entries_INITIAL_STATE : EntriesState = {
    entries: []
}

interface Props {
    children : JSX.Element | JSX.Element[]
}

export const EntriesProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

    useEffect(() => {
      refreshEntries();
    }, [])

    const refreshEntries = async() => {
        const { data } = await entrieApi.get<Entry[]>('/entries');
        dispatch({ type: 'Entry Refresh-Data', payload: data });
    }
    

    const addNewEntry = async(description : string) => {
        const { data } = await entrieApi.post<Entry>('/entries', { description });

        dispatch({ type: 'Entry Add-Entry', payload: data });
    }

    const updateEntry = async( { _id, description, status}: Entry) => {
        try{
            const { data } = await entrieApi.put<Entry>(`/entries/${_id}`, { description, status });
            dispatch({ type:'Entry Entry-Updated', payload: data });
        }catch(error){
            console.log({ error });
        }
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