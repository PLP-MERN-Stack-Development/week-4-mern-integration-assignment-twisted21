const express = require('express');
const router = express.Router();


router.post('/login', async (req, res) => {
    res.json({message: "Login endpoint hit", user: req.body});
})


module.exports = router;
