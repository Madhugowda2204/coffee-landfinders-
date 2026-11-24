
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./config/db')

const app = express()

// ===================================
// MIDDLEWARE
// ===================================


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://coffee-landfinders.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '2mb' }))


// ===================================
// HEALTH CHECK
// ===================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Coffee Landfinders API!',
    status: 'Running'
  })
})


// ===================================
// PROPERTY API ROUTES
// ===================================

app.use('/api/properties', require('./routes/propertyRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))


// ===================================
// NOT FOUND HANDLER
// ===================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  })
})


// ===================================
// START SERVER
// ===================================

const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log('--------------------------------')
      console.log('COFFEE LANDFINDERS BACKEND')
      console.log('--------------------------------')
      console.log(`Server running on port ${PORT}`)
      console.log(`API: http://localhost:${PORT}/api/properties`)
      console.log('--------------------------------')
    })

  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
