import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../chess.db');
export const db = new Database(dbPath);

export const initializeDatabase = (): void => {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      draws INTEGER DEFAULT 0,
      rating INTEGER DEFAULT 1200,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create games table
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER,
      status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'active', 'completed', 'abandoned')),
      result TEXT CHECK(result IN ('white_wins', 'black_wins', 'draw', 'abandoned')),
      moves TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users (id),
      FOREIGN KEY (player2_id) REFERENCES users (id)
    )
  `);

  // Create game_moves table for detailed move history
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_moves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      move_number INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      move TEXT NOT NULL,
      position_fen TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (game_id) REFERENCES games (id),
      FOREIGN KEY (player_id) REFERENCES users (id)
    )
  `);

  console.log('✅ Database initialized successfully');
};