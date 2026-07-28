package com.innuva.schoolmanagementsystem.dto;

public class StudentRequest {

    private String name;

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