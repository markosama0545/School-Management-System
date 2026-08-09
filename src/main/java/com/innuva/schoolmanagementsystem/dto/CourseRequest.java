package com.innuva.schoolmanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class CourseRequest {

    @NotBlank(message = "Course name is required")
    private String name;

    @NotNull(message = "Teacher is required")
    private Long teacherId;

    private List<Long> classIds = new ArrayList<>();

    public CourseRequest() {
    }

    public CourseRequest(String name, Long teacherId, List<Long> classIds) {
        this.name = name;
        this.teacherId = teacherId;
        this.classIds = classIds != null ? classIds : new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(List<Long> classIds) {
        this.classIds = classIds != null ? classIds : new ArrayList<>();
    }
}
