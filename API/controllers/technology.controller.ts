import { Request, Response } from 'express';
import technologyDB from '../db/technology'
import { Technology } from '../models/technology';
import projectDB from '../db/project';
import { Project_technology } from '../models/project_technologies';

const getAll = (req: Request, res: Response) => {
    technologyDB.selectAll().then(technologies => {
        res.status(200).send({
            message: 'Technologies List',
            result: technologies
        })
    }).catch(err => {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}

const getTechnologyById = async (req: Request, res: Response) => {
    try {
        const technologyId = Number(req.params.id);

        if (isNaN(technologyId)) {
            return res.status(400).send({ message: 'Invalid technology ID' });
        }

        const technologyResult = await technologyDB.getTechnologyById(technologyId);

        if (technologyResult) {
            res.status(200).send({
                message: 'Technology found',
                technology: technologyResult
            });
        } else {
            res.status(404).send({ message: 'Technology not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const addNewTechnology = async (req: Request, res: Response) => {
    try {
        const { type, subject, name, image_url } = req.body;

        const newTechnology: Technology = {
            id: 0,
            type: '',
            subject: '',
            name: '',
            image_url: ''
        }

        if(type) {
            if(type.length > 5) {
                newTechnology.type = type;
            } else {
                return res.status(400).send({ message: 'Invalid type: it must contains at least 5 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Technology type is required' });
        }

        if(subject) {
            if(subject.length > 2) {
                newTechnology.subject = subject;
            } else {
                return res.status(400).send({ message: 'Invalid subject: it must contains at least 3 characters' });
            }
        }

        if(name) {
            if(name.length >= 3) {
                newTechnology.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid name: it must contains at least 3 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Name is required' });
        }

        if(image_url) {
            newTechnology.image_url = image_url;
        }

        try {
            const insertedId = await technologyDB.addNewTechnology(newTechnology);
            res.status(200).send({
                message: 'Technology added successfully',
                technologyId: insertedId
            });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send({ message: 'Failed to add Technology' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateTechnology = async (req: Request, res: Response) => {
    try {
        const technologyId = Number(req.params.id);
        const { type, subject, name, image_url } = req.body;
        let updatedTechnology: Technology = {
            id: 0,
            type: '',
            subject: '',
            name: '',
            image_url: ''
        };

        const technologyResult = await technologyDB.getTechnologyById(technologyId);

        if (technologyResult) {
            updatedTechnology = technologyResult;
        } else {
            return res.status(404).send({ message: 'Technology not found' });
        }

        if(type) {
            if(type.length > 5) {
                updatedTechnology.type = type;
            } else {
                return res.status(400).send({ message: 'Invalid type: it must contains at least 5 characters' });
            }
        }

        if(subject) {
            if(subject.length > 2) {
                updatedTechnology.subject = subject;
            } else {
                return res.status(400).send({ message: 'Invalid Technology subject: it must contains at least 3 characters' });
            }
        }

        if(name) {
            if(name.length >= 3) {
                updatedTechnology.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid Technology name: it must contains at least 3 characters' });
            }
        }

        if(image_url) {
            updatedTechnology.image_url = image_url;
        }

        const updated = await technologyDB.updateTechnology(technologyId, updatedTechnology);

        if (updated) {
            res.status(200).send({
                message: 'Technology updated successfully',
                technologyId: technologyId
            });
        } else {
            res.status(404).send({ message: 'Technology not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteTechnology = async (req: Request, res: Response) => {
    try {
        const technologyId = Number(req.params.id);
        const projectTechnologies: Project_technology[] = await projectDB.getProjectTechnologiesByTechnology(technologyId);

        if(projectTechnologies && projectTechnologies.length > 0) {
            return res.status(201).send({ message: 'This Technology belongs to one or many orders: deletion failled' });
        }

        const deleted = await technologyDB.deleteTechnology(technologyId);

        if (deleted) {
            res.status(200).send({
                message: 'Technology deleted successfully',
                technologyId: technologyId
            });
        } else {
            res.status(404).send({ message: 'Technology not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getAll, getTechnologyById, addNewTechnology, updateTechnology, deleteTechnology };