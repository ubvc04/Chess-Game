# 🚀 Chess Game Setup Guide

## Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- Git (optional, for cloning)

## Quick Setup Commands

### 1. Install Dependencies

**Backend Setup:**
```bash
cd server
npm install
```

**Frontend Setup:**
```bash
cd client
npm install
```

### 2. Start the Application

**Option A: Manual Start (Recommended for first time)**

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```
*Keep this terminal open. You should see:*
```
✅ Database initialized successfully
🚀 Chess server running on port 5000
🎮 WebSocket server ready for connections
```

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm start
```
*This will automatically open http://localhost:3000 in your browser*

**Option B: Automated Start (Windows)**
```bash
# Double-click start-dev.bat or run:
start-dev.bat
```

**Option C: Automated Start (Mac/Linux)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### 3. Test the Application

1. **Open your browser** to http://localhost:3000
2. **Register a new account** (e.g., username: "player1", email: "player1@test.com", password: "123456")
3. **Open a second browser window/tab** (or incognito mode)
4. **Register another account** (e.g., username: "player2", email: "player2@test.com", password: "123456")
5. **Create a game** in the first window
6. **Join the game** from the second window
7. **Start playing!** Moves should sync in real-time

## Troubleshooting

### Server Issues

**Port 5000 already in use:**
```bash
# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Kill process using port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

**TypeScript compilation errors:**
```bash
cd server
npm install typescript ts-node --save-dev
```

**Database issues:**
```bash
# Delete the database file and restart
cd server
del chess.db  # Windows
rm chess.db   # Mac/Linux
npm start
```

### Client Issues

**Port 3000 already in use:**
- The React dev server will automatically suggest port 3001
- Type 'y' to accept the alternative port

**Module not found errors:**
```bash
cd client
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

**WebSocket connection failed:**
- Ensure the server is running on port 5000
- Check browser console for errors
- Verify no firewall is blocking the connection

### Common Issues

**"Cannot connect to server":**
1. Verify server is running: http://localhost:5000/api/health
2. Check server terminal for error messages
3. Restart both server and client

**"Moves not syncing":**
1. Check browser console for WebSocket errors
2. Ensure both players are in the same game
3. Refresh both browser windows

**"Authentication failed":**
1. Clear browser localStorage: F12 → Application → Local Storage → Clear
2. Register new accounts
3. Check server logs for authentication errors

## Development Commands

### Server Commands
```bash
cd server
npm start          # Start server
npm run dev        # Start with auto-reload (if nodemon installed)
npm run build      # Compile TypeScript
```

### Client Commands
```bash
cd client
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Project Structure
```
multiplayer-chess/
├── server/           # Backend (Node.js + Express + Socket.IO)
│   ├── src/
│   ├── chess.db     # SQLite database (auto-created)
│   └── package.json
├── client/          # Frontend (React + TypeScript)
│   ├── src/
│   └── package.json
├── start-dev.bat    # Windows startup script
├── start-dev.sh     # Mac/Linux startup script
└── README.md
```

## Features Checklist

After setup, you should be able to:
- ✅ Register and login users
- ✅ Create and join games
- ✅ Play chess with real-time move synchronization
- ✅ Chat during games
- ✅ View game history and statistics
- ✅ See leaderboard
- ✅ Handle disconnections gracefully

## Next Steps

1. **Play a complete game** to test all features
2. **Try spectator mode** by joining a game that's already full
3. **Test chat functionality** during gameplay
4. **Check the leaderboard** after completing games
5. **Explore game history** in the lobby

## Support

If you encounter any issues:
1. Check this troubleshooting guide
2. Look at browser console errors (F12)
3. Check server terminal output
4. Ensure all dependencies are installed correctly

**Happy Chess Playing! ♟️**