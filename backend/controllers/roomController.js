const Room = require('../models/room');
const User = require('../models/user');

// Create private room
exports.createPrivateRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.userId;

    // Generate unique code
    let code;
    let codeExists = true;
    while (codeExists) {
      code = Room.generateCode();
      const existing = await Room.findOne({ code });
      if (!existing) codeExists = false;
    }

    // Create room
    const room = new Room({
      name,
      type: 'private',
      code,
      createdBy: creatorId,
      participants: [creatorId]
    });

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('participants', 'username avatar');

    res.status(201).json({
      message: 'Private room created successfully',
      room: populatedRoom,
      code
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join private room with code
exports.joinPrivateRoom = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    const room = await Room.findOne({ code, type: 'private' })
      .populate('createdBy', 'username')
      .populate('participants', 'username avatar');

    if (!room) {
      return res.status(404).json({ message: 'Invalid room code' });
    }

    // Check if already a participant
    if (room.participants.some(p => p._id.toString() === userId)) {
      return res.json({ message: 'Already in room', room });
    }

    // Add user to participants
    room.participants.push(userId);
    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('participants', 'username avatar');

    res.json({ message: 'Joined room successfully', room: updatedRoom });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's private rooms
exports.getMyPrivateRooms = async (req, res) => {
  try {
    const userId = req.userId;

    const rooms = await Room.find({
      type: 'private',
      participants: userId
    })
      .populate('createdBy', 'username')
      .populate('participants', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Leave private room
exports.leavePrivateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Remove user from participants
    room.participants = room.participants.filter(
      p => p.toString() !== userId
    );

    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete private room (only creator)
exports.deletePrivateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is creator
    if (room.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only creator can delete room' });
    }

    await Room.findByIdAndDelete(roomId);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get room members (for creator to see)
exports.getRoomMembers = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate('participants', 'username email avatar createdAt');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      members: room.participants,
      createdBy: room.createdBy,
      code: room.code   // 🔥 ADDED THIS LINE
    });

  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Create public room
exports.createPublicRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.userId;

    const room = new Room({
      name,
      type: 'public',
      createdBy: creatorId,
      participants: [creatorId]
    });

    await room.save();

    // Add room to user
    await User.findByIdAndUpdate(creatorId, {
      $addToSet: { rooms: room._id }
    });

    res.json({ message: 'Public room created', room });
  } catch (error) {
    console.error('Public room creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// List all public rooms
exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ type: 'public' })
      .select('name createdBy participants createdAt');

    res.json({ rooms });
  } catch (error) {
    console.error('Fetch public rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Join a public room
exports.joinPublicRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    const room = await Room.findById(roomId);

    if (!room || room.type !== 'public') {
      return res.status(400).json({ message: 'Invalid public room' });
    }

    // Add user to room if not already there
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { rooms: roomId }
    });

    res.json({ message: 'Joined public room', room });
  } catch (error) {
    console.error('Join public room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
