package com.innuva.schoolmanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class SchoolClassRequest {

    @NotBlank(message = "Class name is required")
    private String name;

    public SchoolClassRequest() {
    }

    public SchoolClassRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
