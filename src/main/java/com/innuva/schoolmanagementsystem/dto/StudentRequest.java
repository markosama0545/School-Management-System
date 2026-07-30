package com.innuva.schoolmanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StudentRequest {

    @NotBlank(message = "Student name is required")
    private String name;


    @NotNull(message = "Class ID is required")
    @Positive(message = "Class ID must be greater than zero")
    private Long classId;

    public StudentRequest() {
    }

    public StudentRequest(String name, Long classId) {
        this.name = name;
        this.classId = classId;
    }

    public String getName() {
        return name;
    }

    public Long getClassId() {
        return classId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }
}