package com.innuva.schoolmanagementsystem.dto;

import java.util.ArrayList;
import java.util.List;

public class CourseResponse {

    private Long id;
    private String name;
    private Long teacherId;
    private String teacherName;
    private List<Long> classIds = new ArrayList<>();
    private List<String> classNames = new ArrayList<>();

    public CourseResponse() {
    }

    public CourseResponse(
            Long id,
            String name,
            Long teacherId,
            String teacherName,
            List<Long> classIds,
            List<String> classNames
    ) {
        this.id = id;
        this.name = name;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.classIds = classIds != null ? classIds : new ArrayList<>();
        this.classNames = classNames != null ? classNames : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(List<Long> classIds) {
        this.classIds = classIds != null ? classIds : new ArrayList<>();
    }

    public List<String> getClassNames() {
        return classNames;
    }

    public void setClassNames(List<String> classNames) {
        this.classNames = classNames != null ? classNames : new ArrayList<>();
    }
}
