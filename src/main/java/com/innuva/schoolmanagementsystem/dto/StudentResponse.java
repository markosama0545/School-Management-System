package com.innuva.schoolmanagementsystem.dto;

public class StudentResponse {

    private Long id;
    private String name;
    private Long classId;
    private String className;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String name,
            Long classId,
            String className
    ) {
        this.id = id;
        this.name = name;
        this.classId = classId;
        this.className = className;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getClassId() {
        return classId;
    }

    public String getClassName() {
        return className;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}