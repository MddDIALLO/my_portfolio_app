import { Project } from '../models/project';
import { Project_technology } from '../models/project_technologies';
import { connection } from '../config/db';
import { QueryError, PoolConnection, OkPacket } from 'mysql2';

const getAllProjects = (): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            conn.query("select * from projects", (err, resultSet: Project[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

const getProjectById = (projectId: number): Promise<Project | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM projects WHERE id = ?", [projectId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                if (Array.isArray(result) && result.length === 0) {
                    return resolve(null);
                }

                const Project: Project = result[0] as Project;
                return resolve(Project);
            });
        });
    });
};

const getProjectsByType = (type: string): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM projects WHERE type = ?", [type], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                const userProjects: Project[] = result as Project[];
                return resolve(userProjects);
            });
        });
    });
};

const getProjectTechnologies = (projectId: number): Promise<Project_technology[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM project_technologies WHERE project_id = ?", [projectId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                const project_technologies: Project_technology[] = result as Project_technology[];
                return resolve(project_technologies);
            });
        });
    });
};

const getProjectTechnologiesByTechnology = (technologyId: number): Promise<Project_technology[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM project_technologies WHERE technology_id = ?", [technologyId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                const projectTechnologies: Project_technology[] = result as Project_technology[];
                return resolve(projectTechnologies);
            });
        });
    });
};

const getProjectTechnology = (projectId: number, technologyId: number): Promise<Project_technology> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM project_technologies WHERE project_id = ? AND technology_id = ?", [projectId, technologyId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                const projectTechnologies: Project_technology[] = result as Project_technology[];
                const projectTechnology: Project_technology = projectTechnologies[0];
                return resolve(projectTechnology);
            });
        });
    });
};

const addNewProject = (newProject: Project): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            const query = 'INSERT INTO projects (type, subject, name, description) VALUES (?, ?, ?, ?)';

            conn.query(query, [newProject.type, newProject.subject, newProject.name, newProject.description], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.insertId);
            });
        });
    });
};

const addNewProjectTechnology = (newProjectTechnology: Project_technology): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("INSERT INTO project_technologies SET ?", newProjectTechnology, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return resolve(0);
                }
                return resolve(1);
            });
        });
    });
};

const updateProject = (projectId: number, updatedProject: Project): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE projects SET ? WHERE id = ?", [updatedProject, projectId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const updateProjectTechnology = (projectId: number, technologyId: number, updatedProjectTechnology: Project_technology): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE project_technologies SET ? WHERE project_id = ? AND technology_id = ?", [updatedProjectTechnology, projectId, technologyId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteProject = (projectId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM projects WHERE id = ?", projectId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteProjectTechnologies = (projectId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM project_technologies WHERE project_id = ?", projectId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteProjectTechnology = (projectId: number, technologyId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM project_technologies WHERE project_id = ? AND technology_id = ?", [projectId, technologyId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

export default { 
                    getAllProjects, 
                    getProjectById, 
                    getProjectTechnologies, 
                    getProjectTechnology,
                    getProjectsByType,
                    getProjectTechnologiesByTechnology,
                    addNewProject, 
                    addNewProjectTechnology, 
                    updateProject, 
                    updateProjectTechnology, 
                    deleteProject, 
                    deleteProjectTechnologies,
                    deleteProjectTechnology 
                };