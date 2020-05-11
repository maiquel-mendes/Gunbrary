const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Gun = require('../models/gun')
const uploadPath = path.join('public', Gun.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Brand = require('../models/brand')

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//All guns route
router.get('/', async (req, res) => {
   try {
       const guns = await Gun.find({})
       res.render('guns/index', {
           guns: guns,
           searchOptions: req.query
       })
   } catch  {
       res.redirect('/')
   }
})

//New guns route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Gun())

})

//Create guns route
router.post('/', upload.single('image'), async (req, res) => {
   const fileName = req.file != null ? req.file.filename : null 
   const gun = new Gun({
       model: req.body.model,
       brand: req.body.brand,
       caliber: req.body.caliber,
       coverImageName: fileName,
       description: req.body.description,
   })

   try {
       const newGun = await gun.save()
       res.redirect(`guns`)
   } catch  {
    if (gun.coverImageName != null) {
        removeGunCover(gun.coverImageName)
    }
    renderNewPage(res, gun, true)
   }
    
})

function removeGunCover(fileName) {
     fs.unlink(path.join(uploadPath, fileName), err => {
         if (err) console.error(err)
     })
}

async function renderNewPage(res, gun, hasError = false) {
    try {
        const brands = await Brand.find({})
        const params = {
            brands: brands,
            gun: gun
        }
        if (hasError) params.errorMessage = 'Error creating gun'
        res.render('guns/new', params)
    } catch {
        res.redirect('/guns')
    }
}
module.exports = router;