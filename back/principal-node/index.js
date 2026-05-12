import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import libre from "libreoffice-convert";
import { promisify } from "util";
import fs from "fs";
import path from "path";

libre.convertAsync = promisify(libre.convert);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT;
const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:4200",
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
  const { event, data } = req.body;
  if (!event) {
    return res.status(400).json({ error: "Falta l'esdeveniment (event)" });
  }
  console.log(`[SOCKET] Emetent esdeveniment: ${event}`);
  io.emit(event, data);
  res.json({ success: true, message: `Esdeveniment ${event} emès` });
});

// Endpoint per convertir Word a PDF (version per base64)
app.post("/api/convert/word-to-pdf", async (req, res) => {
  try {
    const { fileBase64, fileName } = req.body;

    if (!fileBase64 || !fileName) {
      return res
        .status(400)
        .json({ error: "Falten paràmetres: fileBase64, fileName" });
    }

    // Decodificar el fitxer Word desde base64
    const wordBuffer = Buffer.from(fileBase64, "base64");

    // Guardar fitxer temporal
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempPath = path.join(tempDir, "input_" + Date.now() + ".docx");
    console.log("Temp file:", tempPath);
    fs.writeFileSync(tempPath, wordBuffer);

    // Convertir a PDF
    const pdfBuffer = await libre.convertAsync(fs.readFileSync(tempPath), ".pdf", undefined);

    // Esborrar fitxer temporal
    fs.unlinkSync(tempPath);

    // Generar nom del fitxer PDF
    const pdfFileName = fileName.replace(/\.docx$/, ".pdf");

    // Enviar el PDF com a resposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${pdfFileName}`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error en convertir:", error);
    res.status(500).json({ error: "Error en convertir: " + error.message });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Servidor de Socket.io escoltant al port ${PORT}`);
});
