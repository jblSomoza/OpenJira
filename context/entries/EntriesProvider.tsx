import { FC, useEffect, useReducer } from 'react';

import { useSnackbar } from 'notistack';

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
    const { enqueueSnackbar } = useSnackbar();

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

    const updateEntry = async( { _id, description, status}: Entry, showSnackbar = false) => {
        try{
            const { data } = await entrieApi.put<Entry>(`/entries/${_id}`, { description, status });
            dispatch({ type:'Entry Entry-Updated', payload: data });

            if(showSnackbar) {
                enqueueSnackbar('Entrada Actualizada', {
                    variant:'success',
                    autoHideDuration:1500,
                    anchorOrigin:{
                        vertical: 'top',
                        horizontal: 'right'
                    }
                })
            }

        }catch(error){
            console.log({ error });
        }
    }

    const deleteEntry = async({ _id } : Entry, showSnackbar = false) => {
        const { data } = await entrieApi.delete<Entry>(`/entries/${_id}`, {  });
        dispatch({ type: 'Entry Delete-Entry', payload: data });

        if(showSnackbar) {
            enqueueSnackbar('Entrada Eliminada', {
                variant:'error',
                autoHideDuration:1500,
                anchorOrigin:{
                    vertical: 'top',
                    horizontal: 'right'
                }
            })
        }
    }

    return (
        <EntriesContext.Provider value={{
             ...state,

             addNewEntry,
             updateEntry,
             deleteEntry
         }}>
             { children }
        </EntriesContext.Provider>
    )
}