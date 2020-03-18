const express = require('express')
const router = express.Router()

router.get('/chat', (req, res) => {
    res.send('We are up and running')
})

module.exports = router