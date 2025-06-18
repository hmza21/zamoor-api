import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Notifications API routes

// Get all notifications for a specific user
router.get('/:user_id', isAuthenticated, async (req, res) => {
    const { user_id } = req.params
    try {
        const notifications = await db.query('SELECT * FROM notifications WHERE user_id = $1', [user_id])
        if (notifications.rows.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user' })
        }
        res.status(200).json(notifications.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Create a new notification for a specific user
router.post('/:user_id', isAuthenticated, async (req, res) => {
    const { user_id } = req.params
    const { type, message } = req.body

    if (!type || !message) {
        return res.status(400).json({ message: 'Type and message are required' })
    }

    try {
        const newNotification = await db.query(
            'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3) RETURNING *',
            [user_id, type, message]
        )
        res.status(201).json(newNotification.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Update a specific notification
router.put('/:notification_id', isAuthenticated, async (req, res) => {
    const { notification_id } = req.params
    const { read } = req.body

    if (read === undefined) {
        return res.status(400).json({ message: 'Read status is required' })
    }

    try {
        const updatedNotification = await db.query(
            'UPDATE notifications SET read = $1 WHERE id = $2 RETURNING *',
            [read, notification_id]
        )
        if (updatedNotification.rows.length === 0) {
            return res.status(404).json({ message: 'Notification not found' })
        }
        res.status(200).json(updatedNotification.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete a specific notification
router.delete('/:notification_id', isAuthenticated, async (req, res) => {
    const { notification_id } = req.params

    try {
        const result = await db.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [notification_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Notification not found' })
        }
        res.status(200).json({ message: 'Notification deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
