import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

const REST_API_BASE_URL =
  "http://localhost:8080/ServiciosRest/resources/sinnombre";

app.get("/items", async (req, res) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/listarPartes`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-orgchart", (orgChartId) => {
    socket.join(orgChartId);
    console.log(`User joined org chart ${orgChartId}`);
    console.log("Current rooms for this socket:", socket.rooms);
  });

  socket.on("leave-orgchart", (orgChartId) => {
    socket.leave(orgChartId);
    console.log(`User left org chart ${orgChartId}`);
    console.log("Current rooms for this socket after leaving:", socket.rooms);
  });

  socket.on("update-orgchart", (orgChartId, updatedOrgChart) => {
    try {
      console.log(`Emitting update to room ${orgChartId}`);
      io.to(orgChartId).emit("orgchart-updated", JSON.parse(updatedOrgChart));
    } catch (error) {
      console.error("Error emitting updated org chart", error);
    }
  });

  socket.on("new-table-item", async (newItem) => {
    try {
      console.log("Received new table item:", newItem);
      // Aquí puedes agregar lógica para guardar el nuevo item en la base de datos si es necesario
      // await axios.post(`${REST_API_BASE_URL}/ruta/para/guardar`, newItem);

      // Emitir el nuevo item a todos los clientes conectados
      io.emit("table-item-added", newItem);
    } catch (error) {
      console.error("Error adding new table item", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
