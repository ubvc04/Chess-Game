import { db } from '../db/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: number;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  totalGames: number;
}

// Create a new user
export const createUser = async (username: string, email: string, password: string): Promise<number | null> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(username, email, hashedPassword);
    return result.lastInsertRowid as number;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = (id: number): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Get user by username
export const getUserByUsername = (username: string): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Verify user password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Update user stats after game
export const updateUserStats = (userId: number, gameResult: 'win' | 'loss' | 'draw'): boolean => {
  try {
    let updateQuery = '';
    let ratingChange = 0;

    switch (gameResult) {
      case 'win':
        updateQuery = 'UPDATE users SET wins = wins + 1, rating = rating + ? WHERE id = ?';
        ratingChange = 25;
        break;
      case 'loss':
        updateQuery = 'UPDATE users SET losses = losses + 1, rating = rating + ? WHERE id = ?';
        ratingChange = -15;
        break;
      case 'draw':
        updateQuery = 'UPDATE users SET draws = draws + 1, rating = rating + ? WHERE id = ?';
        ratingChange = 5;
        break;
    }

    const stmt = db.prepare(updateQuery);
    const result = stmt.run(ratingChange, userId);
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
};

// Get leaderboard
export const getLeaderboard = (limit: number = 10): UserStats[] => {
  try {
    const stmt = db.prepare(`
      SELECT 
        id, 
        username, 
        wins, 
        losses, 
        draws, 
        rating,
        (wins + losses + draws) as totalGames
      FROM users 
      WHERE (wins + losses + draws) > 0
      ORDER BY rating DESC, wins DESC 
      LIMIT ?
    `);
    
    return stmt.all(limit) as UserStats[];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};