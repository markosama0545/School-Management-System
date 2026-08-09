package com.innuva.schoolmanagementsystem.dto;

import java.util.List;

public class TeacherClassInfo {

    private Long classId;
    private String className;
    private List<TeacherStudentInfo> students;

    public TeacherClassInfo() {
    }

    public TeacherClassInfo(
            Long classId,
            String className,
            List<TeacherStudentInfo> students
    ) {
        this.classId = classId;
        this.className = className;
        this.students = students;
    }

    public Long getClassId() {
        return classId;
    }

    public String getClassName() {
        return className;
    }

    public List<TeacherStudentInfo> getStudents() {
        return students;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public void setStudents(List<TeacherStudentInfo> students) {
        this.students = students;
    }
}