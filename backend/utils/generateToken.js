const jwt = require('jsonwebtoken');

const generateToken = (id, role, blocks, labs) => {
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables!');
        throw new Error('JWT_SECRET missing');
    }
    return jwt.sign({
        id,
        role,
        assignedBlocks: blocks,
        assignedLabs: labs
    }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expiration set to 1 day
    });
};

module.exports = generateToken;
