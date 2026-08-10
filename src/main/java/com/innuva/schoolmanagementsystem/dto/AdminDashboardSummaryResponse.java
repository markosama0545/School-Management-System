package com.innuva.schoolmanagementsystem.dto;

public class AdminDashboardSummaryResponse {
    private long studentCount;
    private long teacherCount;
    private long classCount;
    private long courseCount;

    public AdminDashboardSummaryResponse(long studentCount, long teacherCount, long classCount, long courseCount) {
        this.studentCount = studentCount;
        this.teacherCount = teacherCount;
        this.classCount = classCount;
        this.courseCount = courseCount;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public long getTeacherCount() {
        return teacherCount;
    }

    public long getClassCount() {
        return classCount;
    }

    public long getCourseCount() {
        return courseCount;
    }
}
