import { Technology } from '../models/technology';
import { connection } from '../config/db';
import { QueryError, PoolConnection, OkPacket } from 'mysql2';

function isValidDateString(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
        return false;
    }

    const dateObject = new Date(dateString);
    const isValidDate = !isNaN(dateObject.getTime());

    return isValidDate;
}

const selectAll = (): Promise<Technology[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            conn.query("select * from technologies", (err, resultSet: Technology[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

const getTechnologyById = (technologyId: number): Promise<Technology | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM technologies WHERE id = ?", [technologyId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                if (Array.isArray(result) && result.length === 0) {
                    return resolve(null);
                }

                const Technology: Technology = result[0] as Technology;
                return resolve(Technology);
            });
        });
    });
};

const addNewTechnology = (newTechnology: Technology): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("INSERT INTO technologies SET ?", newTechnology, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.insertId);
            });
        });
    });
};

const updateTechnology = (technologyId: number, updatedTechnology: Technology): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE technologies SET ? WHERE id = ?", [updatedTechnology, technologyId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteTechnology = (technologyId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM technologies WHERE id = ?", technologyId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

export default { isValidDateString, selectAll, getTechnologyById, addNewTechnology, updateTechnology, deleteTechnology };