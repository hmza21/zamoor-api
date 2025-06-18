import express from 'express'
import db from '../db.js'
const router = express.Router()

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Root endpoint' })
})

export default router
