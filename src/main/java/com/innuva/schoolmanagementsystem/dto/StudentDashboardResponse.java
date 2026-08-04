package com.innuva.schoolmanagementsystem.dto;

import java.util.List;

public class StudentDashboardResponse {

    private Long studentId;
    private String name;
    private String className;
    private List<String> classmates;
    private List<CourseInfo> courses;

    public StudentDashboardResponse() {
    }

    public StudentDashboardResponse(
            Long studentId,
            String name,
            String className,
            List<String> classmates,
            List<CourseInfo> courses
    ) {
        this.studentId = studentId;
        this.name = name;
        this.className = className;
        this.classmates = classmates;
        this.courses = courses;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getClassName() {
        return className;
    }

    public List<String> getClassmates() {
        return classmates;
    }

    public List<CourseInfo> getCourses() {
        return courses;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public void setClassmates(List<String> classmates) {
        this.classmates = classmates;
    }

    public void setCourses(List<CourseInfo> courses) {
        this.courses = courses;
    }
}