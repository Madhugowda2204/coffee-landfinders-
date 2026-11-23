
const Property = require('../models/Property')
const mongoose = require('mongoose')
const uploadToCloudinary = require('../utils/cloudinaryUpload')

// ========================================
// PUBLIC: GET AVAILABLE PROPERTIES
// ========================================

const getProperties = async (req, res) => {
  try {
    const { type, location, featured } = req.query

    const filter = { status: 'Available' }

    if (type) filter.type = type

    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i'
      }
    }

    if (featured === 'true') filter.featured = true

    const properties = await Property.find(filter).sort({
      createdAt: -1
    })

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// PUBLIC: GET SINGLE PROPERTY
// ========================================

const getPropertyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    res.status(200).json({
      success: true,
      property
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// ADMIN: GET ALL PROPERTIES
// ========================================

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({
      createdAt: -1
    })

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// ADMIN: UPLOAD PROPERTY MEDIA
// ========================================

const uploadPropertyMedia = async (req, res) => {
  try {
    const images = req.files?.images || []
    const videos = req.files?.videos || []

    if (images.length === 0 && videos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select photos or videos to upload'
      })
    }

    const uploadedImages = []
    const uploadedVideos = []

    for (const image of images) {
      const result = await uploadToCloudinary(
        image.buffer,
        'property-images',
        'image'
      )

      uploadedImages.push(result.url)
    }

    for (const video of videos) {
      const result = await uploadToCloudinary(
        video.buffer,
        'property-videos',
        'video'
      )

      uploadedVideos.push(result.url)
    }

    res.status(200).json({
      success: true,
      message: 'Property media uploaded successfully',
      images: uploadedImages,
      videos: uploadedVideos
    })
  } catch (error) {
    console.error('Media upload error:', error)

    res.status(500).json({
      success: false,
      message: error.message || 'Media upload failed'
    })
  }
}

// ========================================
// ADMIN: CREATE PROPERTY
// ========================================

const createProperty = async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      area,
      price,
      description,
      images,
      videos,
      features,
      featured,
      status
    } = req.body

    if (
      !title ||
      !location ||
      !type ||
      !area ||
      price === undefined ||
      price === null ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required property details'
      })
    }

    const property = await Property.create({
      title,
      location,
      type,
      area,
      price,
      description,
      images: images || [],
      videos: videos || [],
      features: features || [],
      featured: featured === true || featured === 'true',
      status: status || 'Available'
    })

    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      property
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// ADMIN: UPDATE PROPERTY
// ========================================

const updateProperty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      })
    }

    const allowedFields = [
      'title',
      'location',
      'type',
      'area',
      'price',
      'description',
      'images',
      'videos',
      'features',
      'featured',
      'status'
    ]

    const updates = {}

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    )

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// ADMIN: DELETE PROPERTY
// ========================================

const deleteProperty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      })
    }

    const property = await Property.findByIdAndDelete(
      req.params.id
    )

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========================================
// EXPORT ALL FUNCTIONS
// ========================================

module.exports = {
  getProperties,
  getPropertyById,
  getAllProperties,
  uploadPropertyMedia,
  createProperty,
  updateProperty,
  deleteProperty
}
