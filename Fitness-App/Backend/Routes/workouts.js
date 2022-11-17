const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    
})

router.post('/', (req, res) => {
    console.log('Post request made')
})

module.exports = router