const express = require('express')
const router = express.Router()
const Gun = require('../models/gun')

router.get('/', async (req, res) => {
    let guns
    try {
        guns = await Gun.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        guns = []
    }
    res.render('index', { guns: guns })
})


module.exports = router;