package com.innuva.schoolmanagementsystem.repository;

public interface StudentProfileProjection {

    Long getStudentId();

    String getStudentName();

    String getClassName();

    Long getClassId();
}