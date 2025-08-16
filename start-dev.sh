#!/bin/bash

echo "Starting Chess Game Development Environment..."
echo ""

echo "Starting Backend Server..."
cd server
npm start &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "Starting Frontend Client..."
cd ../client
npm start &
CLIENT_PID=$!

echo ""
echo "Both server and client are starting..."
echo "Server: http://localhost:5000"
echo "Client: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both processes"

# Wait for user to stop
trap "kill $SERVER_PID $CLIENT_PID; exit" INT
wait