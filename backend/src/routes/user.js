const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const prisma = require('../prisma/client');

router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;