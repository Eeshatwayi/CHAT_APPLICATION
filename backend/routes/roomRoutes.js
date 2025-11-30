const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Create private room
router.post('/create', roomController.createPrivateRoom);

// Join private room with code
router.post('/join', roomController.joinPrivateRoom);

// Get my private rooms
router.get('/my-rooms', roomController.getMyPrivateRooms);

// Leave private room
router.post('/leave/:roomId', roomController.leavePrivateRoom);

// Delete private room (creator only)
router.delete('/delete/:roomId', roomController.deletePrivateRoom);

// Get room members
router.get('/members/:roomId', roomController.getRoomMembers);


// Public room routes
router.post('/public/create', roomController.createPublicRoom);
router.get('/public/list', roomController.getPublicRooms);
router.post('/public/join', roomController.joinPublicRoom);


module.exports = router;