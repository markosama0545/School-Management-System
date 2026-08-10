package com.innuva.schoolmanagementsystem.dto;

public class TeacherDashboardSummaryResponse {
    private Long teacherId;
    private String teacherName;
    private long courseCount;
    private long classCount;
    private long studentCount;

    public TeacherDashboardSummaryResponse(Long teacherId, String teacherName, long courseCount, long classCount, long studentCount) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.courseCount = courseCount;
        this.classCount = classCount;
        this.studentCount = studentCount;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public long getCourseCount() {
        return courseCount;
    }

    public long getClassCount() {
        return classCount;
    }

    public long getStudentCount() {
        return studentCount;
    }
}
