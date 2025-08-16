# 🎯 Multiplayer Chess Game

A real-time multiplayer chess game built with React, Node.js, Express, WebSockets (Socket.IO), and SQLite. Play chess with friends in real-time with a beautiful, responsive interface.

## 🚀 Features

### Core Game Features
- ✅ Standard 8x8 chessboard with correct piece setup
- ✅ Turn-based moves (White starts first)
- ✅ Valid move logic for all chess pieces (Pawn, Rook, Knight, Bishop, Queen, King)
- ✅ Real-time move synchronization between players
- ✅ Game state management (Check, Checkmate, Stalemate detection)
- ✅ Resign and draw offer options

### Multiplayer Features
- ✅ Two players connect to shared game rooms via WebSockets
- ✅ Moves instantly broadcasted to both players in real-time
- ✅ Graceful disconnect handling (pause/forfeit)
- ✅ Spectator mode support
- ✅ Game lobby with available games list

### UI/UX Features
- ✅ Responsive React chessboard with click-to-move
- ✅ Highlight valid moves when selecting a piece
- ✅ Visual indication of whose turn it is
- ✅ Game Over screen with winner display
- ✅ In-game chat via WebSockets
- ✅ Beautiful gradient backgrounds and animations

### User System & Persistence
- ✅ User registration/login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ User statistics tracking (wins/losses/draws/rating)
- ✅ Game history storage in SQLite database
- ✅ Leaderboard showing top players

## 🛠️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- Socket.IO Client for real-time communication
- CSS3 with custom styling and animations
- Context API for state management

**Backend:**
- Node.js with Express
- Socket.IO for WebSocket connections
- SQLite with better-sqlite3 (local database)
- JWT for authentication
- bcrypt for password hashing
- TypeScript for type safety

## 📁 Project Structure

```
multiplayer-chess/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ChessBoard.tsx
│   │   │   ├── ChessPiece.tsx
│   │   │   ├── ChessSquare.tsx
│   │   │   ├── Game.tsx
│   │   │   ├── GameInfo.tsx
│   │   │   ├── GameLobby.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── services/       # API services
│   │   │   ├── authService.ts
│   │   │   ├── gameService.ts
│   │   │   └── socketService.ts
│   │   ├── styles/         # CSS files
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   │   └── chessLogic.ts
│   │   └── App.tsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── db/            # Database setup
│   │   │   └── database.ts
│   │   ├── models/        # Data models
│   │   │   ├── userModel.ts
│   │   │   └── gameModel.ts
│   │   ├── routes/        # Express routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── gameRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/      # Business logic
│   │   │   └── socketService.ts
│   │   └── index.ts       # Server entry point
│   └── package.json
└── README.md
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### 1. Setup Project
If you haven't already, navigate to your project directory:
```bash
cd multiplayer-chess
```

### 2. Backend Setup
```bash
cd server
npm install
npm start
```

The server will start on `http://localhost:5000` and automatically:
- Create the SQLite database (`chess.db`)
- Set up all required tables
- Start the WebSocket server

**You should see:**
```
✅ Database initialized successfully
🚀 Chess server running on port 5000
🎮 WebSocket server ready for connections
```

### 3. Frontend Setup
Open a **new terminal window**:
```bash
cd client
npm install
npm start
```

The React app will start on `http://localhost:3000` and automatically open in your browser.

### 4. Test the Application

1. **Open two browser windows/tabs** to `http://localhost:3000`
2. **Register** as two different users in each window:
   - User 1: username: "player1", email: "player1@test.com", password: "123456"
   - User 2: username: "player2", email: "player2@test.com", password: "123456"
3. **Create a game** in one window (you'll be White)
4. **Join the game** from the other window (you'll be Black)
5. **Start playing!** Moves will sync in real-time

### 5. Quick Start Scripts

**Windows:**
```bash
# Double-click start-dev.bat or run:
start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 🎮 How to Play

### Getting Started
1. **Register** a new account or **Login** with existing credentials
2. In the **Game Lobby**, you can:
   - Create a new game (you'll be White)
   - Join an available game (you'll be Black)
   - View your game history

### Playing Chess
1. **Click on a piece** to select it (valid moves will be highlighted)
2. **Click on a highlighted square** to move the piece
3. The game follows standard chess rules
4. **Chat** with your opponent using the chat panel
5. **Resign** or **Offer a draw** using the game controls

### Game Features
- **Real-time synchronization**: Moves appear instantly for both players
- **Turn indicators**: Clear indication of whose turn it is
- **Move validation**: Only legal moves are allowed
- **Game status**: Check, checkmate, and stalemate detection
- **Spectator mode**: Watch ongoing games

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory (optional):
```env
PORT=5000
JWT_SECRET=your-secret-key-here
```

### Database
The application uses SQLite with the following tables:
- `users` - User accounts and statistics
- `games` - Game records and moves
- `game_moves` - Detailed move history

The database file (`chess.db`) is created automatically in the server directory.

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Game creation and joining
- [ ] Real-time move synchronization
- [ ] Chat functionality
- [ ] Game completion (checkmate/stalemate)
- [ ] Disconnect handling
- [ ] Mobile responsiveness

### Testing with Multiple Users
1. Open multiple browser windows/incognito tabs
2. Register different users in each
3. Create and join games
4. Test real-time features

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript compilation errors

**Client won't connect to server:**
- Verify server is running on port 5000
- Check browser console for WebSocket connection errors
- Ensure CORS is properly configured

**Database issues:**
- Delete `chess.db` file and restart server to recreate
- Check file permissions in server directory

**WebSocket connection fails:**
- Check firewall settings
- Verify server and client are on same network (for local testing)
- Check browser developer tools for connection errors

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=socket.io* npm start
```

## 🚀 Deployment Considerations

For production deployment, consider:
- Use PostgreSQL or MySQL instead of SQLite
- Set up proper environment variables
- Configure HTTPS and WSS
- Implement rate limiting
- Add comprehensive error handling
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- [ ] Chess engine AI opponent
- [ ] Tournament system
- [ ] Replay system with move navigation
- [ ] Time controls (blitz, rapid, classical)
- [ ] Puzzle mode
- [ ] Social features (friends, messaging)
- [ ] Mobile app version
- [ ] Advanced statistics and analytics

---

**Enjoy playing chess! ♟️**