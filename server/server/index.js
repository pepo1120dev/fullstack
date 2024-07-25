import express from "express";
import { createServer } from "node:http";
import logger from "morgan";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = createServer(app);
const io = new SocketServer(server);
const port = process.env.PORT ?? 3000;

io.on("connection", (socket) => {
  console.log("usuario conectado");

  socket.on("disconnect", () => {
    console.log("usuario desconectado");
  });

  socket.on("crearContacto", (nuevoContacto) => {
    contactos.push(nuevoContacto);
    io.emit("nuevoContacto", nuevoContacto);
  });

  socket.on("actualizarContacto", (id, datosActualizados) => {
    const contacto = contactos.find((c) => c.id === id);
    if (contacto) {
      Object.assign(contacto, datosActualizados);
      io.emit("contactoActualizado", { id, ...datosActualizados });
    }
  });
});

app.use(logger("dev"));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
