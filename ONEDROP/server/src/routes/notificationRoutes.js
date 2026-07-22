const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, notificationController.getNotifications);
router.put('/read-all', authenticate, notificationController.markAllRead);
router.put('/:id/read', authenticate, notificationController.markRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Manual trigger endpoints for scheduled blood request check reminders & time-based greetings
router.post('/trigger-reminders', authenticate, notificationController.triggerReminders);
router.post('/trigger-greetings', authenticate, notificationController.triggerGreetings);

module.exports = router;

