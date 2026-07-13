const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize real-time WebSocket communication layer
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Points to your Vite frontend server development port
    methods: ["GET", "POST"]
  }
});

// Attach socket connection context globally to the Express application object instance
app.set('socketio', io);

// =========================================================================
// 🌐 GLOBAL CORE INBOUND APPLICATION MIDDLEWARES
// =========================================================================
app.use(cors());
app.use(express.json()); // Parses incoming application/json body string payloads

// Telemetry monitoring middleware: logs all route attempts straight to terminal
app.use((req, res, next) => {
  console.log(`📡 [LOG-TRAFFIC]: ${req.method} request sent to path: ${req.url}`);
  next(); // Hands off control seamlessly to the next middleware downstream
});

// =========================================================================
// ⛓️ MOUNT DECOUPLED INFRASTRUCTURE ROUTE LAYERS
// =========================================================================
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use('/api/v1/auth', authRoutes);         // Public Identity Ingestion Endpoint
app.use('/api/v1/resources', resourceRoutes);   // Protected Resource Asset Queries
app.use('/api/v1/bookings', bookingRoutes);     // Protected Real-Time Locking Engine
app.use('/api/v1/health', healthRoutes);         // Public DevOps Metrics System

// =========================================================================
// 🔌 REAL-TIME COMMUNICATION CLUSTER PIPELINES
// =========================================================================
io.on('connection', (socket) => {
  console.log(`🔌 Node connection registered to cluster communication matrix: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client context disconnected from socket instance: ${socket.id}`);
  });
});

// =========================================================================
// 🛡️ CENTRALIZED ERROR INTERCEPTOR GATEWAY (MUST BE MOUNTED LAST)
// =========================================================================
const globalErrorHandler = require('./middlewares/errorMiddleware');
app.use(globalErrorHandler);

// =========================================================================
// 🚀 INITIATE SYSTEM DISTRIBUTION CORE ENGINE
// =========================================================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('🚀 =============================================================');
  console.log(`🚀 Distributed Resource Mesh core listening natively on port ${PORT}`);
  console.log(`🎯 Diagnostic health metrics terminal active at http://localhost:${PORT}/api/v1/health`);
  console.log('🚀 =============================================================');
});