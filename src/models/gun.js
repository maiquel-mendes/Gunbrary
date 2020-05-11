const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/gunImages'

const gunSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    caliber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brand'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    }
})

gunSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Gun', gunSchema)
module.exports.coverImageBasePath = coverImageBasePath