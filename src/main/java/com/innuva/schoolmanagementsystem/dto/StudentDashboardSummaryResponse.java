package com.innuva.schoolmanagementsystem.dto;

public class StudentDashboardSummaryResponse {
    private Long studentId;
    private String studentName;
    private String className;
    private long courseCount;
    private Double averageGrade;

    public StudentDashboardSummaryResponse(Long studentId, String studentName, String className, long courseCount, Double averageGrade) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.className = className;
        this.courseCount = courseCount;
        this.averageGrade = averageGrade;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getClassName() {
        return className;
    }

    public long getCourseCount() {
        return courseCount;
    }

    public Double getAverageGrade() {
        return averageGrade;
    }
}
