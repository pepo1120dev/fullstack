package com.java.client.clientws.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

}
