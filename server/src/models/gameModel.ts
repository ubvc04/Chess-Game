import { db } from '../db/database';
import { updateUserStats } from './userModel';

export interface Game {
  id: number;
  player1_id: number;
  player2_id: number | null;
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  result: 'white_wins' | 'black_wins' | 'draw' | 'abandoned' | null;
  moves: string;
  created_at: string;
  updated_at: string;
}

export interface GameWithPlayers extends Game {
  player1_username: string;
  player2_username: string | null;
}

// Create a new game
export const createGame = (playerId: number): number | null => {
  try {
    const stmt = db.prepare(`
      INSERT INTO games (player1_id, status)
      VALUES (?, 'waiting')
    `);
    
    const result = stmt.run(playerId);
    return result.lastInsertRowid as number;
  } catch (error) {
    console.error('Error creating game:', error);
    return null;
  }
};

// Get game by ID
export const getGameById = (id: number): Game | null => {
  try {
    const stmt = db.prepare('SELECT * FROM games WHERE id = ?');
    return stmt.get(id) as Game | null;
  } catch (error) {
    console.error('Error getting game by ID:', error);
    return null;
  }
};

// Get game with player usernames
export const getGameWithPlayers = (id: number): GameWithPlayers | null => {
  try {
    const stmt = db.prepare(`
      SELECT 
        g.*,
        u1.username as player1_username,
        u2.username as player2_username
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      LEFT JOIN users u2 ON g.player2_id = u2.id
      WHERE g.id = ?
    `);
    
    return stmt.get(id) as GameWithPlayers | null;
  } catch (error) {
    console.error('Error getting game with players:', error);
    return null;
  }
};

// Join a game as player 2
export const joinGame = (gameId: number, playerId: number): boolean => {
  try {
    const stmt = db.prepare(`
      UPDATE games 
      SET player2_id = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND player2_id IS NULL AND status = 'waiting'
    `);
    
    const result = stmt.run(playerId, gameId);
    return result.changes > 0;
  } catch (error) {
    console.error('Error joining game:', error);
    return false;
  }
};

// Update game moves
export const updateGameMoves = (gameId: number, moves: string): boolean => {
  try {
    const stmt = db.prepare(`
      UPDATE games 
      SET moves = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(moves, gameId);
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating game moves:', error);
    return false;
  }
};

// End a game
export const endGame = (gameId: number, result: 'white_wins' | 'black_wins' | 'draw' | 'abandoned'): boolean => {
  try {
    const game = getGameById(gameId);
    if (!game) return false;

    const stmt = db.prepare(`
      UPDATE games 
      SET status = 'completed', result = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const updateResult = stmt.run(result, gameId);
    
    if (updateResult.changes > 0 && game.player2_id) {
      // Update player stats
      if (result === 'white_wins') {
        updateUserStats(game.player1_id, 'win');
        updateUserStats(game.player2_id, 'loss');
      } else if (result === 'black_wins') {
        updateUserStats(game.player1_id, 'loss');
        updateUserStats(game.player2_id, 'win');
      } else if (result === 'draw') {
        updateUserStats(game.player1_id, 'draw');
        updateUserStats(game.player2_id, 'draw');
      }
    }
    
    return updateResult.changes > 0;
  } catch (error) {
    console.error('Error ending game:', error);
    return false;
  }
};

// Get available games (waiting for players)
export const getAvailableGames = (): GameWithPlayers[] => {
  try {
    const stmt = db.prepare(`
      SELECT 
        g.*,
        u1.username as player1_username,
        u2.username as player2_username
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      LEFT JOIN users u2 ON g.player2_id = u2.id
      WHERE g.status = 'waiting'
      ORDER BY g.created_at DESC
      LIMIT 20
    `);
    
    return stmt.all() as GameWithPlayers[];
  } catch (error) {
    console.error('Error getting available games:', error);
    return [];
  }
};

// Get user's games
export const getUserGames = (userId: number, limit: number = 10): GameWithPlayers[] => {
  try {
    const stmt = db.prepare(`
      SELECT 
        g.*,
        u1.username as player1_username,
        u2.username as player2_username
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      LEFT JOIN users u2 ON g.player2_id = u2.id
      WHERE g.player1_id = ? OR g.player2_id = ?
      ORDER BY g.updated_at DESC
      LIMIT ?
    `);
    
    return stmt.all(userId, userId, limit) as GameWithPlayers[];
  } catch (error) {
    console.error('Error getting user games:', error);
    return [];
  }
};