import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.12.21:5173",
    ],
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.12.21:5173",
    ],
    methods: ["GET", "POST"],
  },
});

const REST_API_BASE_URL =
  "http://192.168.12.21:8080/ServiciosRest/resources/sinnombre";

// Endpoint para obtener la lista de partes
app.get("/items", async (req, res) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/listarPartes`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Manejo de conexiones de Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Unirse a una sala de organigrama
  socket.on("join-orgchart", (orgChartId) => {
    socket.join(orgChartId);
    console.log(`User joined org chart ${orgChartId}`);
    console.log("Current rooms for this socket:", socket.rooms);
  });

  // Salir de una sala de organigrama
  socket.on("leave-orgchart", (orgChartId) => {
    socket.leave(orgChartId);
    console.log(`User left org chart ${orgChartId}`);
    console.log("Current rooms for this socket after leaving:", socket.rooms);
  });

  // Unirse a una sala de SITREP
  socket.on("join-sitrep", (sitrepId) => {
    socket.join(sitrepId);
    console.log(`User joined SITREP ${sitrepId}`);
    console.log("Current rooms for this socket:", socket.rooms);
  });

  // Salir de una sala de SITREP
  socket.on("leave-sitrep", (sitrepId) => {
    socket.leave(sitrepId);
    console.log(`User left SITREP ${sitrepId}`);
    console.log("Current rooms for this socket after leaving:", socket.rooms);
  });

  // Emitir una actualización de organigrama
  socket.on("update-orgchart", (orgChartId, updatedOrgChart) => {
    try {
      console.log(`Emitting update to room ${orgChartId}`);
      io.to(orgChartId).emit("orgchart-updated", JSON.parse(updatedOrgChart));
    } catch (error) {
      console.error("Error emitting updated org chart", error);
    }
  });

  socket.on("update-sitrep", (sitrepId, updatedSitrep) => {
    try {
      console.log(`Emitting update to room ${sitrepId}`);
      io.to(sitrepId).emit("sitrep-updated", JSON.parse(updatedSitrep));
    } catch (error) {
      console.error("Error emitting updated org chart", error);
    }
  });

  // Emitir un nuevo elemento de tabla
  socket.on("new-table-item", async (newItem) => {
    try {
      console.log("Received new table item:", newItem);
      io.emit("table-item-added", newItem);
    } catch (error) {
      console.error("Error adding new table item", error);
    }
  });
  socket.on("new-sitrep-item", async (newSitrep) => {
    try {
      console.log("Received new sitrep item:", newSitrep);
      io.emit("sitrep-item-added", newSitrep);
    } catch (error) {
      console.error("Error adding new sitrep item", error);
    }
  });

  // Manejo de la desconexión del usuario
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Iniciar el servidor
server.listen(3000, () => {
  console.log("Server is running on http://192.168.12.21:3000");
});
