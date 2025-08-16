import { Server, Socket } from 'socket.io';
import { getGameById, updateGameMoves, joinGame, endGame } from '../models/gameModel';
import jwt from 'jsonwebtoken';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'chess-game-secret-key';

// Active games map to track game rooms and players
const activeGames = new Map<number, {
  white: number | null;
  black: number | null;
  spectators: number[];
}>();

// Setup socket handlers
export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    let userId: number | null = null;

    // Authenticate user
    socket.on('authenticate', (token: string) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = decoded.userId;
        console.log(`User authenticated: ${userId}`);
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('auth_error', { message: 'Authentication failed' });
      }
    });

    // Join game room
    socket.on('join_game', async ({ gameId, asSpectator = false }) => {
      if (!userId) {
        return socket.emit('error', { message: 'Not authenticated' });
      }

      try {
        const gameIdNum = parseInt(gameId);
        const game = await getGameById(gameIdNum);

        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        // Join socket room
        socket.join(`game:${gameId}`);

        // Handle joining as player or spectator
        if (asSpectator) {
          // Join as spectator
          if (!activeGames.has(gameIdNum)) {
            activeGames.set(gameIdNum, {
              white: game.player1_id,
              black: game.player2_id,
              spectators: [userId]
            });
          } else {
            const gameInfo = activeGames.get(gameIdNum)!;
            if (!gameInfo.spectators.includes(userId)) {
              gameInfo.spectators.push(userId);
            }
          }

          socket.emit('game_joined', { 
            gameId, 
            role: 'spectator',
            game: {
              ...game,
              currentTurn: game.moves.split(' ').length % 2 === 0 ? 'white' : 'black'
            }
          });
        } else {
          // Join as player
          if (game.player1_id === userId) {
            // Player is white
            if (!activeGames.has(gameIdNum)) {
              activeGames.set(gameIdNum, {
                white: userId,
                black: game.player2_id,
                spectators: []
              });
            } else {
              activeGames.get(gameIdNum)!.white = userId;
            }

            socket.emit('game_joined', { 
              gameId, 
              role: 'white',
              game: {
                ...game,
                currentTurn: game.moves.split(' ').length % 2 === 0 ? 'white' : 'black'
              }
            });
          } else if (game.player2_id === userId) {
            // Player is black
            if (!activeGames.has(gameIdNum)) {
              activeGames.set(gameIdNum, {
                white: game.player1_id,
                black: userId,
                spectators: []
              });
            } else {
              activeGames.get(gameIdNum)!.black = userId;
            }

            socket.emit('game_joined', { 
              gameId, 
              role: 'black',
              game: {
                ...game,
                currentTurn: game.moves.split(' ').length % 2 === 0 ? 'white' : 'black'
              }
            });
          } else if (!game.player2_id && game.status === 'waiting') {
            // Join as second player (black)
            const joined = await joinGame(gameIdNum, userId);
            
            if (joined) {
              if (!activeGames.has(gameIdNum)) {
                activeGames.set(gameIdNum, {
                  white: game.player1_id,
                  black: userId,
                  spectators: []
                });
              } else {
                activeGames.get(gameIdNum)!.black = userId;
              }

              const updatedGame = await getGameById(gameIdNum);
              
              socket.emit('game_joined', { 
                gameId, 
                role: 'black',
                game: {
                  ...updatedGame,
                  currentTurn: 'white' // White always starts
                }
              });

              // Notify the other player that someone joined
              socket.to(`game:${gameId}`).emit('opponent_joined', {
                gameId,
                opponent: { id: userId }
              });
            } else {
              socket.emit('error', { message: 'Could not join game' });
            }
          } else {
            // Can't join as player, join as spectator instead
            if (!activeGames.has(gameIdNum)) {
              activeGames.set(gameIdNum, {
                white: game.player1_id,
                black: game.player2_id,
                spectators: [userId]
              });
            } else {
              const gameInfo = activeGames.get(gameIdNum)!;
              if (!gameInfo.spectators.includes(userId)) {
                gameInfo.spectators.push(userId);
              }
            }

            socket.emit('game_joined', { 
              gameId, 
              role: 'spectator',
              game: {
                ...game,
                currentTurn: game.moves.split(' ').length % 2 === 0 ? 'white' : 'black'
              }
            });
          }
        }

        // Broadcast to room that a new user connected
        socket.to(`game:${gameId}`).emit('user_connected', { userId });
      } catch (error) {
        console.error('Join game error:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Make a move
    socket.on('make_move', async ({ gameId, move }) => {
      if (!userId) {
        return socket.emit('error', { message: 'Not authenticated' });
      }

      try {
        const gameIdNum = parseInt(gameId);
        const game = await getGameById(gameIdNum);

        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        // Check if user is a player in this game
        if (game.player1_id !== userId && game.player2_id !== userId) {
          return socket.emit('error', { message: 'You are not a player in this game' });
        }

        // Check if it's the player's turn
        const isWhiteTurn = game.moves.split(' ').length % 2 === 0;
        const isPlayerWhite = game.player1_id === userId;

        if (isWhiteTurn !== isPlayerWhite) {
          return socket.emit('error', { message: 'Not your turn' });
        }

        // Update moves in database
        const newMoves = game.moves ? `${game.moves} ${move}` : move;
        const updated = await updateGameMoves(gameIdNum, newMoves);

        if (updated) {
          // Broadcast move to all players in the room
          io.to(`game:${gameId}`).emit('move_made', {
            gameId,
            move,
            moves: newMoves,
            playerId: userId
          });
        } else {
          socket.emit('error', { message: 'Failed to update game' });
        }
      } catch (error) {
        console.error('Make move error:', error);
        socket.emit('error', { message: 'Failed to make move' });
      }
    });

    // End game
    socket.on('end_game', async ({ gameId, result }) => {
      if (!userId) {
        return socket.emit('error', { message: 'Not authenticated' });
      }

      try {
        const gameIdNum = parseInt(gameId);
        const game = await getGameById(gameIdNum);

        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        // Check if user is a player in this game
        if (game.player1_id !== userId && game.player2_id !== userId) {
          return socket.emit('error', { message: 'You are not a player in this game' });
        }

        // End the game
        const ended = await endGame(gameIdNum, result);

        if (ended) {
          // Broadcast game end to all players in the room
          io.to(`game:${gameId}`).emit('game_ended', {
            gameId,
            result
          });

          // Remove from active games
          activeGames.delete(gameIdNum);
        } else {
          socket.emit('error', { message: 'Failed to end game' });
        }
      } catch (error) {
        console.error('End game error:', error);
        socket.emit('error', { message: 'Failed to end game' });
      }
    });

    // Chat message
    socket.on('send_message', ({ gameId, message }) => {
      if (!userId) {
        return socket.emit('error', { message: 'Not authenticated' });
      }

      // Broadcast message to all players in the room
      io.to(`game:${gameId}`).emit('new_message', {
        gameId,
        userId,
        message,
        timestamp: new Date().toISOString()
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Notify all active games where this user is a player
      if (userId !== null) {
        const currentUserId = userId; // TypeScript type narrowing
        activeGames.forEach((gameInfo, gameId) => {
          if (gameInfo.white === currentUserId || gameInfo.black === currentUserId) {
            io.to(`game:${gameId}`).emit('player_disconnected', {
              gameId,
              userId: currentUserId,
              role: gameInfo.white === currentUserId ? 'white' : 'black'
            });
          } else if (gameInfo.spectators.includes(currentUserId)) {
            // Remove from spectators
            gameInfo.spectators = gameInfo.spectators.filter(id => id !== currentUserId);
          }
        });
      }
    });
  });
};