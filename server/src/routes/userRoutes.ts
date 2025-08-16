import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserById, getLeaderboard } from '../models/userModel';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chess-game-secret-key';

// Middleware to authenticate user
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get current user profile
router.get('/profile', authenticateToken, (req: any, res) => {
  try {
    const user = getUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password hash
    const { password_hash, ...userProfile } = user;
    
    res.json({ user: userProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password hash and email for other users
    const { password_hash, email, ...publicProfile } = user;
    
    res.json({ user: publicProfile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = getLeaderboard(limit);
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;