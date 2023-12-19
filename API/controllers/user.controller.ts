const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Request, Response } from 'express';
import user from '../db/user';
import { User } from '../models/user';

const validateToken = (req: Request, res: Response) => {
    const { token } = req.body;
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';

    jwt.verify(token, secretKey, (err) => {
    if (err) {
        return res.status(200).send({ message: 'Invalid token' });
    } else {
        return res.status(200).send({ message: 'Valid token' });
    }
    });
}

const login = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let existingUser: User | null = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: '',
            image_url: ''
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
        const connectedUser: any = {
            id: existingUser.id,
            username: existingUser.username,
            role: existingUser.role,
            image_url: existingUser.image_url
        }

        res.status(200).send({
            message: 'Login successful',
            token: token,
            connectedUser: connectedUser
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const logout = (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(401).send({ message: 'Invalid or missing token' });
        }

        const secretKey = process.env.JWT_SECRET || 'default_secret_key';
        const decodedToken = jwt.decode(token);

        if (!decodedToken) {
            return res.status(403).send({ message: 'Invalid token' });
        }

        const expiredToken = jwt.sign({ 
            tokenPayload: decodedToken.tokenPayload, 
            expiresIn: Math.floor(Date.now() / 1000) - 1
        }, secretKey);

        res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getAll = (req: Request, res: Response) => {
    user.selectAll().then(users => {
        let returnedUsers: any[] = [];
        for (const gotUser of users) {
            returnedUsers.push({id:gotUser.id, username: gotUser.username, email: gotUser.email, role: gotUser.role, image_url: gotUser.image_url})
        }
        res.status(200).send({
            message: 'Users List',
            result: returnedUsers
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

        if (!(req.isAuth && req.user.id === userId)) {
            return res.status(400).send({ message: 'You are not authorized to perform this action.' });
        } 

        if (isNaN(userId)) {
            return res.status(400).send({ message: 'Invalid user ID' });
        }

        const userResult = await user.getUserById(userId);

        if (userResult) {
            const returnedUser: any = {
                id: userResult.id,
                username: userResult.username,
                email: userResult.email,
                role: userResult.role
            }

            res.status(200).send({
                message: 'User found',
                user: returnedUser
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
        const { username, email, password } = req.body;
        // const exitingUsername: User | null = await user.getUserByUsernameOrEmail(username);
        const exitingEmail: User | null = await user.getUserByUsernameOrEmail(email);

        // if(exitingUsername) {
        //     return res.status(400).send({ message: 'Username already used' });
        // }

        if(exitingEmail) {
            return res.status(400).send({ message: 'Email already used' });
        }

        const newUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: 'USER',
            image_url: ''
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

        try {
            const insertedId = await user.addUser(newUser);

            if (!insertedId) {
                return res.status(500).send({ message: 'Failed to add user' });
            }
    
            newUser.id = insertedId;
            
            const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    
            const tokenPayload = {
                id: insertedId,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            };
    
            const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '2h' });
            const connectedUser: any = {
                id: insertedId,
                username: newUser.username,
                role: newUser.role,
                image_url: newUser.image_url
            }

            res.status(200).send({
                message: 'User added successfully',
                token: token,
                connectedUser: connectedUser
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

        if (!((req.isAuth && req.user.id === userId) || (req.isAuth && req.user.role === 'ADMIN'))) {
            return res.status(400).send({ message: 'You are not authorized to perform this action.' });
        } 

        const { password, image_url } = req.body;

        let updatedUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role: '',
            image_url: ''
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

        if(image_url && image_url.length> 0) {
            updatedUser.image_url = image_url;
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

        if (!(req.isAuth && req.user.id === userId)) {
            return res.status(400).send({ message: 'You are not authorized to perform this action.' });
        } 

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

export default { validateToken, login, logout, getAll, getUserById, addNewUser, updateExistingUser, deleteUserById };