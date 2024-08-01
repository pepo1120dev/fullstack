import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors"; // Importa el middleware cors

const app = express();

// Configurar CORS para Express
app.use(
  cors({
    origin: "http://localhost:5173", // Permitir solicitudes desde tu aplicación React
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL de tu aplicación React
    methods: ["GET", "POST"],
  },
});

const REST_API_BASE_URL = "http://localhost:8080";

// Endpoint REST para obtener items
app.get("/items", async (req, res) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/items`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-orgchart", async (orgChartId) => {
    socket.join(orgChartId);
    console.log(`User joined org chart ${orgChartId}`);
  });

  socket.on("update-orgchart", async (orgChartId, newNode) => {
    try {
      await axios.post(
        `${REST_API_BASE_URL}/orguser/${orgChartId}/addNode`,
        newNode
      );
      const response = await axios.get(
        `${REST_API_BASE_URL}/orguser/${orgChartId}`
      );
      io.to(orgChartId).emit("orgchart-updated", response.data);
    } catch (error) {
      console.error("Error updating org chart", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
