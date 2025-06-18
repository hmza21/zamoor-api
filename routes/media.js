import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Media API routes

// Get all media files for a post
router.get('/post/:post_id', isAuthenticated, async (req, res) => {
    const { post_id } = req.params
    try {
        const mediaFiles = await db.query('SELECT * FROM media WHERE post_id = $1', [post_id])
        if (mediaFiles.rows.length === 0) {
            return res.status(404).json({ message: 'No media files found for this post' })
        }
        res.status(200).json(mediaFiles.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Get a specific media file by ID
router.get('/:media_id', isAuthenticated, async (req, res) => {
    const { media_id } = req.params
    try {
        const mediaFile = await db.query('SELECT * FROM media WHERE id = $1', [media_id])
        if (mediaFile.rows.length === 0) {
            return res.status(404).json({ message: 'Media file not found' })
        }
        res.status(200).json(mediaFile.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Upload a new media file for a post
router.post('/upload', isAuthenticated, async (req, res) => {
    const { post_id, file_path, file_type } = req.body

    if (!post_id || !file_path || !file_type) {
        return res.status(400).json({ message: 'Post ID, file path, and file type are required' })
    }

    try {
        const newMedia = await db.query(
            'INSERT INTO media (post_id, file_path, file_type) VALUES ($1, $2, $3) RETURNING *',
            [post_id, file_path, file_type]
        )
        res.status(201).json(newMedia.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete a specific media file
router.delete('/:media_id', isAuthenticated, async (req, res) => {
    const { media_id } = req.params
    try {
        const result = await db.query('DELETE FROM media WHERE id = $1 RETURNING *', [media_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Media file not found' })
        }
        res.status(200).json({ message: 'Media file deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
