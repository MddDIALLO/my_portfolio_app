
import { Request, Response } from 'express';
import technologyDB from '../db/technology';
import { Technology } from '../models/technology';
import projectDB from '../db/project';
import { Project } from '../models/project';
import { Project_technology } from '../models/project_technologies';

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projectsList: Project[] = await projectDB.getAllProjects();
        const projectsReturnedList: any[] = [];

        for (const projectTechnology of projectsList) {
            const projectTechnologies: Project_technology[] = await projectDB.getProjectTechnologies(projectTechnology.id);
            let technologies: Technology[] = [];

            for (const projectTechnologyDetail of projectTechnologies) {
                const fetchedTechnology: Technology | null = await technologyDB.getTechnologyById(projectTechnologyDetail.technology_id);

                if (fetchedTechnology) {
                    technologies.push(fetchedTechnology);
                }
            }

            projectsReturnedList.push({
                "id": projectTechnology.id,
                "type": projectTechnology.type,
                "subject": projectTechnology.subject,
                "name": projectTechnology.name,
                "description": projectTechnology.description,
                "technologies": technologies
            });
        }

        res.status(200).send({
            message: 'Projects List',
            result: projectsReturnedList
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const getProjectById = async (req: Request, res: Response) => {
    try {
        const projectId: number = parseInt(req.params.id);
        const project: Project | null = await projectDB.getProjectById(projectId);

        if (!project) {
            return res.status(404).send({
                message: 'Project not found'
            });
        }

        const projectTechnologies: Project_technology[] = await projectDB.getProjectTechnologies(project.id);
        const technologies: Technology[] = [];

        for (const projectTechnology of projectTechnologies) {
            const fetchedTechnology: Technology | null = await technologyDB.getTechnologyById(projectTechnology.technology_id);

            if (fetchedTechnology) {
                technologies.push(fetchedTechnology);
            }
        }

        const projectDetails = {
            "id": project.id,
            "type": project.type,
            "subject": project.subject,
            "name": project.name,
            "description": project.description,
            "technologies": technologies
        };

        res.status(200).send({
            message: 'Project Details',
            result: projectDetails
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const addNewProject = async (req: Request, res: Response) => {
    try {
        const { type, subject, name, description, technologies } = req.body;
    
        if(!technologies) {
            return res.status(400).send({ 
                message: 'You must add technologies for any project like this { technologies: [{technology_id},] } ' });
        }

        const newProject: Project = {
            id: 0,
            type: '',
            subject: '',
            name: '',
            description: ''
        }

        if(type) {
            if(type.length > 5) {
                newProject.type = type;
            } else {
                return res.status(400).send({ message: 'Invalid type: it must contains at least 5 characters' });
            }
        } else {
            newProject.type = 'PROJECT';
        }

        if(subject) {
            if(subject.length > 2) {
                newProject.subject = subject;
            } else {
                return res.status(400).send({ message: 'Invalid subject: it must contains at least 3 characters' });
            }
        }else {
            newProject.subject = 'PRO';
        }

        if(name) {
            if(name.length >= 3) {
                newProject.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid name: it must contains at least 3 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Name is required' });
        }

        if(description) {
            if(name.length >= 15) {
                newProject.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid description: it must contains at least 15 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Description is required' });
        }

        let projectID: number = 0;

        try {
            const insertedId = await projectDB.addNewProject(newProject);

            console.log("Project added successfully", insertedId);
            projectID = insertedId;
            newProject.id = insertedId;
        } catch (error) {
            console.error('Error adding Project:', error);
            res.status(500).send({ message: 'Failed to add Project' });
        }

        const newProjectTechnologies: Project_technology[] = [];

        for (const technologyData of technologies) {
            const { technology_id } = technologyData;
            const newProjectTechnology: Project_technology = {
                project_id: projectID,
                technology_id
            }

            try {
                const insertedId = await projectDB.addNewProjectTechnology(newProjectTechnology);
                console.log("Project Technology added successfully", insertedId)
            } catch (error) {
                console.error('Error adding Project Technology:', error);
            }

            newProjectTechnologies.push(newProjectTechnology);
        }

        const technologiesForProject: Technology[] = [];
        for (const projectTechnology of newProjectTechnologies) {
            const fetchedTechnology: Technology | null = await technologyDB.getTechnologyById(projectTechnology.technology_id);

            if (fetchedTechnology) {
                technologiesForProject.push(fetchedTechnology);
            }
        }

        res.status(201).send({
            message: 'New project created',
            result: {
                order: newProject,
                technologies: technologiesForProject
            }
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};


const updateProject = async (req: Request, res: Response) => {
    try {
        const projectId: number = parseInt(req.params.id);
        const { type, subject, name, description, technologiesToAdd, technologiesToRemove } = req.body;

        const existingProject: Project | null = await projectDB.getProjectById(projectId);

        if (!existingProject) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        if(type) {
            if(type.length > 5) {
                existingProject.type = type;
            } else {
                return res.status(400).send({ message: 'Invalid type: it must contains at least 5 characters' });
            }
        }

        if(subject) {
            if(subject.length > 2) {
                existingProject.subject = subject;
            } else {
                return res.status(400).send({ message: 'Invalid subject: it must contains at least 3 characters' });
            }
        }

        if(name) {
            if(name.length >= 3) {
                existingProject.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid name: it must contains at least 3 characters' });
            }
        }

        if(description) {
            if(name.length >= 15) {
                existingProject.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid description: it must contains at least 15 characters' });
            }
        }

        if (technologiesToAdd && technologiesToAdd.length > 0) {
            for (const technologyData of technologiesToAdd) {
                const { technology_id } = technologyData;
                let projectTechnology: Project_technology = await projectDB.getProjectTechnology(projectId, technology_id);

                if(projectTechnology) {
                    console.log("Project Technology already exist.");
                } else {
                    const stat = await projectDB.addNewProjectTechnology({project_id: projectId, technology_id});

                    if(stat) {
                        console.log("Project Technology added.");
                    } else {
                        console.log("Project Technology add failed.")
                    }
                }
            }
        }

        if (technologiesToRemove && technologiesToRemove.length > 0) {
            for (const technologyData of technologiesToRemove) {
                const { technology_id } = technologyData;

                let projectTechnology: Project_technology = await projectDB.getProjectTechnology(projectId, technology_id);

                if(projectTechnology) {
                    const stat = await projectDB.deleteProjectTechnology(projectId, technology_id);

                    if(stat) {
                        console.log("Project Technology removed.");
                    } else {
                        console.log("Project Technology remove failed.")
                    }
                } else {
                    console.log("Project Technology not found.");
                }
            }
        }

        const projectUpdatetat: boolean = await projectDB.updateProject(projectId, existingProject);

        if(projectUpdatetat) {
            res.status(200).send({
                message: 'Order updated successfully',
                result: existingProject
            });
        } else {
            res.status(200).send({
                message: 'Order update failled',
            });
        }
        
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const deleteProjectById = async (req: Request, res: Response) => {
    try {
        const projectId: number = Number(req.params.id);
        const tecnologyDeleted: boolean = await projectDB.deleteProjectTechnologies(projectId);

        if (tecnologyDeleted) {
            console.log("Project technologies deleted.");
        } else {
            console.log("Not able to delete Project technologie.")
        }

        const projectDeleted: boolean = await projectDB.deleteProject(projectId);

        if (projectDeleted) {
            res.status(200).send({
                message: 'Project deleted successfully',
                projectId: projectId
            });
        } else {
            res.status(404).send({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getAllProjects, getProjectById, addNewProject, updateProject, deleteProjectById };