package com.innuva.schoolmanagementsystem.entity;

import com.innuva.schoolmanagementsystem.dto.StudentResponse;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "Name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClassId")
    @JsonBackReference
    private SchoolClass schoolClass;

    public Student() {
    }

    public Student(Long id, String name, SchoolClass schoolClass) {
        this.id = id;
        this.name = name;
        this.schoolClass = schoolClass;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SchoolClass getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(SchoolClass schoolClass) {
        this.schoolClass = schoolClass;
    }
    private StudentResponse toStudentResponse(Student student) {

        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getSchoolClass().getId(),
                student.getSchoolClass().getName()
        );
    }
}

