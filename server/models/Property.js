
const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        'Land & Plots',
        'Coffee Estates',
        'Villas & Homes'
      ]
    },

    area: {
      type: String,
      required: true
    },

    price: {
      type: String,
      default: 'Price on Request'
    },

    description: {
      type: String,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    videos: {
      type: [String],
      default: []
    },

    features: {
      type: [String],
      default: []
    },

    featured: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ['Available', 'Sold'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Property', propertySchema)
