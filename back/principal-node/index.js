import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://renfe.daw.inspedralbes.com",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Connexions al Socket
io.on("connection", (socket) => {
  console.log(`Nou client connectat: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client desconnectat: ${socket.id}`);
  });
});

// Ruta per els sockets
app.post("/api/broadcast", (req, res) => {

  // Sockets

});

httpServer.listen(PORT, () => {
  console.log(`Servidor de Socket.io escoltant al port ${PORT}`);
});
