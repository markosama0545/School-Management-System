package com.innuva.schoolmanagementsystem.dto;

public class CourseInfo {

    private String courseName;
    private String teacherName;
    private Double grade;

    public CourseInfo(
            String courseName,
            String teacherName,
            Double grade
    ) {
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.grade = grade;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public Double getGrade() {
        return grade;
    }
}