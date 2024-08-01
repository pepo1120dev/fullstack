package com.java.client.clientws.modelo;

import java.util.List;

public class OrgChart {
    private String entidad;
    private String funcion;
    private List<OrgChart> children;

    public OrgChart() {
    }

    public OrgChart(String entidad, String funcion, List<OrgChart> children) {
        this.entidad = entidad;
        this.funcion = funcion;
        this.children = children;
    }

    // Getters and setters
    public String getEntidad() {
        return entidad;
    }

    public void setEntidad(String entidad) {
        this.entidad = entidad;
    }

    public String getFuncion() {
        return funcion;
    }

    public void setFuncion(String funcion) {
        this.funcion = funcion;
    }

    public List<OrgChart> getChildren() {
        return children;
    }

    public void setChildren(List<OrgChart> children) {
        this.children = children;
    }
}