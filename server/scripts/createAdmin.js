
require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const prompt = require('prompt-sync')({ sigint: true })

const Admin = require('../models/Admin')

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('\n=== COFFEE LANDFINDERS ADMIN SETUP ===\n')

    const name = prompt('Enter admin name: ').trim()
    const email = prompt('Enter admin email: ').trim().toLowerCase()
    const password = prompt.hide('Enter admin password: ')
    const confirmPassword = prompt.hide('Confirm password: ')

    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }

    if (password.length < 12) {
      throw new Error('Password must contain at least 12 characters')
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const existingAdmin = await Admin.findOne({ email })

    if (existingAdmin) {
      throw new Error('An admin with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    console.log('\nAdmin account created successfully!')
    console.log('Email:', email)

  } catch (error) {
    console.error('\nAdmin setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()
