const express = require('express')
const router = express.Router()

router.get('/chat-room', (req, res) => {
    res.send('We are up and running')
})

module.exports = router