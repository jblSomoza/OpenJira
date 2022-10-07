import React, { ChangeEvent, FC, useContext, useMemo, useState } from 'react'

import { GetServerSideProps } from 'next'

import { Button, Card, CardActions, CardContent, CardHeader, FormControl, 
    FormControlLabel, FormLabel, Grid, RadioGroup, TextField, Radio, capitalize, IconButton
} from '@mui/material';

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { Layout } from '../../components/layouts';
import { Entry, EntryStatus } from '../../interfaces';
import { dbEntries } from '../../database';
import { EntriesContext } from '../../context/entries';
import { dateFunctions } from '../../utils';
import { useRouter } from 'next/router';

const validStatus : EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props {
    entry: Entry
}

export const EntryPage:FC<Props> = ({ entry }) => {

    const [inputValue, setInputValue] = useState(entry.description);
    const [status, setStatus] = useState<EntryStatus>(entry.status);
    const [touched, setTouched] = useState(false);

    const router = useRouter();

    const { updateEntry, deleteEntry } = useContext(EntriesContext)

    const isNotValid =  useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    const onTextFieldChange = (event : ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const onStatusChange = (event : ChangeEvent<HTMLInputElement>) => {
        
        setStatus(event.target.value as EntryStatus);
    }

    const onSave = () => {
        if( inputValue.trim().length === 0 ) return;

        const updatedEntry : Entry = {
            ...entry,
            status,
            description: inputValue,
        }

        updateEntry( updatedEntry, true);
    }

    const onDelete = () => {
        const updatedEntry : Entry = {
            ...entry,
            status,
            description: inputValue,
        }

        deleteEntry( updatedEntry, true);

        router.push('/');
    }

  return (
    <Layout title={ inputValue.substring(0, 20) + '....'}>
        <Grid
            container
            justifyContent='center'
            sx={{ marginTop: 2 }}
        >
            <Grid item xs={ 12 } sm={ 8 } md={ 6 }>
                <Card>
                    <CardHeader 
                        title={`Entrada:`} 
                        subheader={`Creada ${ dateFunctions.getFormatDistanceToNow(entry.createAt)}`} 
                    />

                    <CardContent>
                        <TextField 
                            sx={{ marginTop: 2, marginBottom: 1}}
                            fullWidth
                            placeholder='Nueva Entrada'
                            multiline
                            autoFocus
                            label= "Nueva entrada"
                            value={ inputValue }
                            onChange={ onTextFieldChange }
                            helperText={ isNotValid && `Ingrese una valor`}
                            onBlur={ () => setTouched(true) }
                            error={ isNotValid }
                        />

                        <FormControl>
                            <FormLabel>Estado:</FormLabel>
                            <RadioGroup 
                                row 
                                value={ status }
                                onChange={ onStatusChange }
                            >
                                {
                                    validStatus.map(option => (
                                        <FormControlLabel 
                                            key={option}
                                            value={ option }
                                            control = { <Radio /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <CardActions>
                            <Button
                                startIcon={ <SaveOutlinedIcon /> }
                                variant='contained'
                                fullWidth
                                onClick={ onSave }
                                disabled={ inputValue.length <= 0 }
                            >
                                Guardar
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>

            </Grid>

        </Grid>

        <IconButton sx={{
                position:'fixed',
                bottom: 30,
                right: 30,
                backgroundColor: 'text.secondary'
            }}
            onClick={ onDelete }
        >
            <DeleteOutlineOutlinedIcon />
        </IconButton>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { id } = params as { id: string };
    const entry = await dbEntries.getEntryById(id);

    if(!entry){
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            entry
        }
    }
}

export default EntryPage