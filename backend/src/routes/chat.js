const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    res.send('Chat route is working');
});

router.get('/', protect, async (req, res) => {
    res.send('Chat route is working');
});

module.exports = router;