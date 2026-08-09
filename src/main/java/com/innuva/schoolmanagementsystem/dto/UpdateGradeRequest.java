package com.innuva.schoolmanagementsystem.dto;

public class UpdateGradeRequest {

    private Long studentId;
    private Long courseId;
    private Double grade;

    public UpdateGradeRequest() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public Double getGrade() {
        return grade;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }
}