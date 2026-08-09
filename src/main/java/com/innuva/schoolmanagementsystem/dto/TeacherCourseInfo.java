package com.innuva.schoolmanagementsystem.dto;

import java.util.List;

public class TeacherCourseInfo {

    private Long courseId;
    private String courseName;
    private List<TeacherClassInfo> classes;

    public TeacherCourseInfo() {
    }

    public TeacherCourseInfo(
            Long courseId,
            String courseName,
            List<TeacherClassInfo> classes
    ) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.classes = classes;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public List<TeacherClassInfo> getClasses() {
        return classes;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setClasses(List<TeacherClassInfo> classes) {
        this.classes = classes;
    }
}