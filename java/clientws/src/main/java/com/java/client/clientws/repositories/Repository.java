package com.java.client.clientws.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.java.client.clientws.modelo.Persona;

public interface Repository extends JpaRepository<Persona, Long> {

}
