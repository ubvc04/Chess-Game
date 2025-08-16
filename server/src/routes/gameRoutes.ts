import express from 'express';
import jwt from 'jsonwebtoken';
import { 
  createGame, 
  getGameById, 
  getGameWithPlayers, 
  getAvailableGames, 
  getUserGames,
  joinGame 
} from '../models/gameModel';

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

// Create a new game
router.post('/create', authenticateToken, (req: any, res) => {
  try {
    const gameId = createGame(req.userId);
    
    if (!gameId) {
      return res.status(500).json({ error: 'Failed to create game' });
    }

    const game = getGameWithPlayers(gameId);
    res.status(201).json({
      message: 'Game created successfully',
      game
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get game by ID
router.get('/:id', authenticateToken, (req: any, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const game = getGameWithPlayers(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join a game
router.post('/:id/join', authenticateToken, (req: any, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const game = getGameById(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ error: 'Game is not available to join' });
    }

    if (game.player1_id === req.userId) {
      return res.status(400).json({ error: 'Cannot join your own game' });
    }

    if (game.player2_id) {
      return res.status(400).json({ error: 'Game is already full' });
    }

    const joined = joinGame(gameId, req.userId);
    
    if (!joined) {
      return res.status(500).json({ error: 'Failed to join game' });
    }

    const updatedGame = getGameWithPlayers(gameId);
    res.json({
      message: 'Joined game successfully',
      game: updatedGame
    });
  } catch (error) {
    console.error('Join game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available games
router.get('/', (req, res) => {
  try {
    const games = getAvailableGames();
    res.json({ games });
  } catch (error) {
    console.error('Get available games error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's games
router.get('/user/my-games', authenticateToken, (req: any, res) => {
  try {
    const games = getUserGames(req.userId);
    res.json({ games });
  } catch (error) {
    console.error('Get user games error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;