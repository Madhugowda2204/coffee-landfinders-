
const express = require('express')
const router = express.Router()

const {
  getProperties,
  getPropertyById,
  getAllProperties,
  uploadPropertyMedia,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController')

const { protectAdmin } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// ADMIN: Get all properties, including sold
router.get('/admin/all', protectAdmin, getAllProperties)

// ADMIN: Upload property photos and videos
router.post(
  '/upload',
  protectAdmin,
  upload,
  uploadPropertyMedia
)

// PUBLIC: Get available properties
router.get('/', getProperties)

// PUBLIC: Get one property
router.get('/:id', getPropertyById)

// ADMIN: Add property
router.post('/', protectAdmin, createProperty)

// ADMIN: Update property
router.put('/:id', protectAdmin, updateProperty)

// ADMIN: Delete property
router.delete('/:id', protectAdmin, deleteProperty)

module.exports = router
