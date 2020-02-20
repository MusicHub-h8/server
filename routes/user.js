const express = require('express')
const router = express.Router()



router.post('/login', (req, res) => {
    res.send('masuk', req.headers.access_token)
})

// cari di db ada gak yang emailnya udah sama 
// find

module.exports = router