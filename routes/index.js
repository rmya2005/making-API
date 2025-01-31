const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
let data = [];

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Decoded user',req.user)
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

router.get('/user', authMiddleware, roleMiddleware('User'), (req, res) => {
    res.json({ message: 'User data', data });
});

router.post('/user', authMiddleware, roleMiddleware('Admin'), (req, res) => {
    if (!req.body || req.body.id === undefined) {
        return res.status(400).json({ error: 'Request must contain an id' });
    }
    data.push(req.body.id);
    res.json({ message: 'User added', data });
});

router.delete('/user', authMiddleware, roleMiddleware('Admin'), (req, res) => {
    if (!req.body || req.body.id === undefined) {
        return res.status(400).json({ error: 'Request body must contain an id' });
    }

    data = data.filter(num => num !== req.body.id);
    res.json({ message: 'User deleted', data });
});

router.patch('/user', authMiddleware, roleMiddleware('Admin'), (req, res) => {
    const userId = parseInt(req.body.id);
    const index = data.indexOf(userId);
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    data[index] = req.body.newId;
    res.status(200).json({ message: 'User updated', users: data });
});

module.exports = router;
