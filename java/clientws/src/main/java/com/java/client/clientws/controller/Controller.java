package com.java.client.clientws.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.java.client.clientws.modelo.Item;
import com.java.client.clientws.modelo.OrgChart;
import com.java.client.clientws.modelo.Persona;
import com.java.client.clientws.repositories.Repository;

@RestController
public class Controller {

    @Autowired
    private Repository repo;

    @GetMapping()
    public String index() {
        return "Conectado";
    }

    @GetMapping("find")
    public List<Persona> getPersonas() {
        return repo.findAll();
    }

    @PostMapping("crear")
    public String grabarPersona(@RequestBody Persona persona) {
        repo.save(persona);
        return "Usuario creado";
    }

    @PostMapping("editar/{id}")
    public String editarPersona(@PathVariable Long id, @RequestBody Persona persona) {
        Persona updatePersona = repo.findById(id).get();
        updatePersona.setNombre(persona.getNombre());
        updatePersona.setTelefono(persona.getTelefono());
        repo.save(updatePersona);
        return "Usuario editado";
    }

    @GetMapping("/items")
    public List<Item> getItems() {
        return Arrays.asList(
                new Item(1, "Departamento 1"),
                new Item(2, "Departamento 2"),
                new Item(3, "Departamento 3"));
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/orguser/{id}")
    public OrgChart getOrgChart(@PathVariable int id) {
        // Ejemplo de organigrama que podrías obtener según el ID
        if (id == 1) {
            return new OrgChart(
                    "nombre persona",
                    "COMANDANTE INCIDENTE",
                    Arrays.asList(
                            new OrgChart(
                                    "Peter Gibbons",
                                    "Ron Livingston",
                                    Arrays.asList(
                                            new OrgChart(
                                                    "And More!!",
                                                    "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                                                    null))),
                            new OrgChart(
                                    "Milton Waddams",
                                    "Stephen Root",
                                    null),
                            new OrgChart(
                                    "Bob Slydell",
                                    "John C. McGinley",
                                    null)));
        }
        if (id == 2) {
            return new OrgChart(
                    "nombre persona 2",
                    "COMANDANTE INCIDENTE 2",
                    Arrays.asList(
                            new OrgChart(
                                    "Peter Gibbons 2",
                                    "Ron Livingston 2",
                                    Arrays.asList(
                                            new OrgChart(
                                                    "And More!! 2",
                                                    "This 2",
                                                    null))),
                            new OrgChart(
                                    "Milton Waddams 2",
                                    "Stephen Root 2",
                                    null),
                            new OrgChart(
                                    "Bob Slydel 2l",
                                    "John C. McGinley 2",
                                    null)));
        } else {
            return new OrgChart(
                    "nombre persona otro",
                    "COMANDANTE INCIDENTE otro",
                    Arrays.asList(
                            new OrgChart(
                                    "Peter Gibbons otro",
                                    "Ron Livingston otro",
                                    Arrays.asList(
                                            new OrgChart(
                                                    "And More!! otro2",
                                                    "Thisotro",
                                                    null))),
                            new OrgChart(
                                    "Milton Waddams otro",
                                    "Stephen Root otro",
                                    null),
                            new OrgChart(
                                    "Bob Slydel otrol",
                                    "John C. McGinley otro",
                                    null)));
        }
    }

}
