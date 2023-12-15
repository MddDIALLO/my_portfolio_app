const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Request, Response } from 'express';
import user from '../db/user';
import { User } from '../models/user';

const login = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let existingUser: User | null = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: ''
        };

        if(username) {
            existingUser = await user.getUserByUsernameOrEmail(username);
        } else if(email){
            existingUser = await user.getUserByUsernameOrEmail(email);
        }

        if (!existingUser || existingUser.id === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const secretKey = process.env.JWT_SECRET || 'default_secret_key';

        const tokenPayload = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role
        };

        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '2h' });

        res.status(200).send({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getAll = (req: Request, res: Response) => {
    user.selectAll().then(users => {
        res.status(200).send({
            message: 'Users List',
            result: users
        })
    }).catch(err => {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).send({ message: 'Invalid user ID' });
        }

        const userResult = await user.getUserById(userId);

        if (userResult) {
            res.status(200).send({
                message: 'User found',
                user: userResult
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const addNewUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;
        const exitingUsername: User | null = await user.getUserByUsernameOrEmail(username);
        const exitingEmail: User | null = await user.getUserByUsernameOrEmail(email);

        if(exitingUsername) {
            return res.status(400).send({ message: 'Username already used' });
        }

        if(exitingEmail) {
            return res.status(400).send({ message: 'Email already used' });
        }

        const newUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: 'USER'
        };

        if(username) {
            if(username.length >= 3) {
                newUser.username = username;
            } else {
                return res.status(400).send({ message: 'Invalid username: it must contain at lest three characters' });
            }
        } else {
            return res.status(400).send({ message: 'Username is required' });
        }

        if(email) {
            const isValidEmail = user.validateEmail(email);

            if (isValidEmail) {
                newUser.email = email;
            } else {
                return res.status(400).send({ message: 'Invalid Email Adress: It must be like "example@example.com"' });
            }
        } else {
            return res.status(400).send({ message: 'Email is required' });
        }

        if(password) {
            const isValidPassword = user.validatePassword(password);

            if (isValidPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);

                newUser.password = hashedPassword;
            } else {
                return res.status(400).send({ message: 'Invalid Password' });
            }
        } else {
            return res.status(400).send({ message: 'Password is required' });
        }

        if(role) {
            if(role === 'USER' || role === 'ADMIN') {
                newUser.role = role;
            } else {
                return res.status(400).send({ message: 'Invalid role' });
            }
        }

        try {
            const insertedId = await user.addUser(newUser);
            res.status(200).send({
                message: 'User added successfully',
                userId: insertedId
            });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send({ message: 'Failed to add user' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateExistingUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const { password, role } = req.body;

        let updatedUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: ''
        };

        const userResult = await user.getUserById(userId);

        if (userResult) {
            updatedUser = userResult;
        } else {
            return res.status(404).send({ message: 'User not found' });
        }

        if (password) {
            const isValidPassword = user.validatePassword(password);

            if (isValidPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);

                updatedUser.password = hashedPassword;
            } else {
                return res.status(400).send({ message: 'Invalid Password' });
            }
        }

        if(role) {
            if(role === 'USER' || role === 'ADMIN') {
                updatedUser.role = role;
            } else {
                return res.status(400).send({ message: 'Invalid role' });
            }
        }

        const updated = await user.updateUser(userId, updatedUser);

        if (updated) {
            res.status(200).send({
                message: 'User updated successfully',
                userId: userId
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const deleted = await user.deleteUser(userId);

        if (deleted) {
            res.status(200).send({
                message: 'User deleted successfully',
                userId: userId
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { login, getAll, getUserById, addNewUser, updateExistingUser, deleteUserById };