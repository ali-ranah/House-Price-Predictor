import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io('http://localhost:3001', {
    autoConnect: true, // Automatically connects when initialized
    reconnection: true, // Enable reconnection in case of connection loss
    reconnectionAttempts: Infinity, // Retry indefinitely
    reconnectionDelay: 1000, // Wait 1 second before retrying
    reconnectionDelayMax: 5000, // Wait up to 5 seconds for reconnection
  });
  
// Event listeners for common socket events (optional)
socket.on('connect', () => {
  console.log('Connected to socket.io server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket.io server');
});

socket.on('error', (error) => {
  console.error('Socket.io error:', error);
});

// Export the socket instance for use in other components
export default socket;
