package com.innuva.schoolmanagementsystem.dto;

public class TeacherStudentInfo {

    private Long studentId;
    private String studentName;
    private Double grade;

    public TeacherStudentInfo() {
    }

    public TeacherStudentInfo(
            Long studentId,
            String studentName,
            Double grade
    ) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.grade = grade;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Double getGrade() {
        return grade;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }
}