const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
    const { username, email, password, profilePic, bio} = req.body;
    try{
        const userExists = await prisma.user.findFirst({
            where: { OR: [{email}, {username}] }
        });

        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, profilePic: profilePic || null, bio: bio || null }
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            token: generateToken(user.id)
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await prisma.user.findUnique({ where: {email}});

        if(!user) return res.status(400).json({message: 'Invalid email or password'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid email or password'});

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });

    } catch (err) {
        res.status(500).json({ message: 'Login Failed' });
    };
};