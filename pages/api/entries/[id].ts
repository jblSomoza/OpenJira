import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import { db } from '../../../database';
import { Entry, IEntry } from '../../../models';

type Data = 
| { message: string }
| IEntry;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { id } = req.query;

    if(!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'El id no es valido' + id});

    switch (req.method) {
        case 'PUT':
            return  updateEntry(req, res)

        case 'GET':
            return getEntryById(req, res)

        case 'DELETE':
            return deleteEntryById(req, res)
    
        default:
            return res.status(400).json({ message: 'The method no exists'});
    }
}

const updateEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    await db.connect();

    const entryToUpdate = await Entry.findById( id );
    
    if( !entryToUpdate ){
        await db.disconnect();
        return res.status(400).json({ message: 'No hay entrada con ese ID' + id})  
    } 

    const {
        description = entryToUpdate.description,
        status = entryToUpdate.status
    } = req.body;

    try {
        const updatedEntry = await 
            Entry.findByIdAndUpdate( id , { description, status }, { runValidators: true , new : true });        
        
        await db.disconnect();
        res.status(200).json( updatedEntry! );
    } catch (error : any) {
        await db.disconnect();
        res.status(400).json({ message: JSON.stringify(error.errors.status.message)});
    }
}

const getEntryById = async( req : NextApiRequest, res : NextApiResponse) => {
    const { id } = req.query;
    await db.connect();

    const entryFind = await Entry.findById( id );

    await db.disconnect();
    
    if( !entryFind ){
        return res.status(400).json({ message: 'No hay entrada con ese ID' + id})  
    } 

    return res.status(200).json(entryFind);
}

const deleteEntryById = async(req : NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();

    const entryFind = await Entry.findById( id );

    if(!entryFind) {
        return res.status(400).json({ message : 'No se encontro ninguna entrada del id: ' + id});
    }

    const deletedEntry = await Entry.findByIdAndDelete(id);
    await db.disconnect();

    return res.status(200).json({ message: 'Eliminado exitosamente' });
}