package com.innuva.schoolmanagementsystem.dto;

import java.util.List;

public class TeacherDashboardResponse {

    private Long teacherId;
    private String teacherName;
    private List<TeacherCourseInfo> courses;

    public TeacherDashboardResponse() {
    }

    public TeacherDashboardResponse(
            Long teacherId,
            String teacherName,
            List<TeacherCourseInfo> courses
    ) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.courses = courses;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public List<TeacherCourseInfo> getCourses() {
        return courses;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setCourses(List<TeacherCourseInfo> courses) {
        this.courses = courses;
    }
}