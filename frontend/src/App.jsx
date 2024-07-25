import io from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";

const socket = io("/");

function App() {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/find");

        setContactos(response.data);
        if (response.data.length > 0) {
          console.log(
            "Datos recibidos:",
            JSON.stringify(response.data, null, 2)
          );
        } else {
          console.log("No se encontraron contactos");
        }
      } catch (error) {
        console.error("Error al obtener los contactos:", error);
      }
    };

    fetchContactos();

    socket.on("nuevoContacto", (nuevoContacto) => {
      setContactos([...contactos, nuevoContacto]);
    });

    socket.on("contactoActualizado", (datosActualizados) => {
      setContactos(
        contactos.map((c) =>
          c.id === datosActualizados.id ? { ...c, ...datosActualizados } : c
        )
      );
    });
  }, []);

  return (
    <div>
      <h2>Lista de Contactos</h2>
      <ul>
        {contactos.map((contacto) => (
          <li key={contacto.id}>
            <strong>{contacto.nombre}</strong> - {contacto.telefono}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
