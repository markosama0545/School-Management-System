package com.innuva.schoolmanagementsystem.repository;

public interface TeacherDashboardRowProjection {

    Long getTeacherId();

    String getTeacherName();

    Long getCourseId();

    String getCourseName();

    Long getClassId();

    String getClassName();

    Long getStudentId();

    String getStudentName();

    Double getGrade();
}