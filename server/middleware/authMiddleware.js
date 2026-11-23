
const jwt = require('jsonwebtoken')

const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Check authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      })
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing'
      })
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Check admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      })
    }

    // Attach admin information
    req.admin = {
      id: decoded.id,
      role: decoded.role
    }

    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    })
  }
}

module.exports = { protectAdmin }
